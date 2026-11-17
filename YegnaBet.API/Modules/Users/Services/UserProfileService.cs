using Microsoft.EntityFrameworkCore;
using YegnaBet.API.Modules.Users.Dtos;
using YegnaBet.Domain.Entities;
using YegnaBet.Infrastructure.Persistence;

namespace YegnaBet.API.Modules.Users.Services;

public sealed class UserProfileService(BrokerDbContext db)
{
    public async Task<UserProfileDto> Get(long userId, CancellationToken cancellationToken)
    {
        var user = await db.Users.AsNoTracking().FirstOrDefaultAsync(x => x.Id == userId && x.IsActive, cancellationToken)
            ?? throw new KeyNotFoundException("User account was not found.");
        var location = await (from profile in db.UsersEx.AsNoTracking()
                              join place in db.Locations.AsNoTracking() on profile.LocationId equals place.Id
                              where profile.UserId == userId
                              select place).FirstOrDefaultAsync(cancellationToken);
        return ToDto(user, location);
    }

    public async Task<UserProfileDto> Update(long userId, UpdateUserProfileRequest request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.FullName)) throw new ArgumentException("Full name is required.");
        if (string.IsNullOrWhiteSpace(request.PhoneNumber)) throw new ArgumentException("Phone number is required.");
        var user = await db.Users.FirstOrDefaultAsync(x => x.Id == userId && x.IsActive, cancellationToken)
            ?? throw new KeyNotFoundException("User account was not found.");
        var phone = request.PhoneNumber.Trim();
        if (await db.Users.AnyAsync(x => x.Id != userId && x.PhoneNumber == phone, cancellationToken))
            throw new ArgumentException("That phone number is already in use.");
        var email = string.IsNullOrWhiteSpace(request.Email) ? null : request.Email.Trim().ToLowerInvariant();
        if (email is not null && await db.Users.AnyAsync(x => x.Id != userId && x.Email == email, cancellationToken))
            throw new ArgumentException("That email address is already in use.");

        user.FullName = request.FullName.Trim();
        user.PhoneNumber = phone;
        user.Email = email;
        user.ReceiveNotifications = request.ReceiveNotifications;
        user.UpdatedAt = DateTime.UtcNow;

        var userEx = await db.UsersEx.Include(x => x.Location).FirstOrDefaultAsync(x => x.UserId == userId, cancellationToken);
        var hasLocation = !string.IsNullOrWhiteSpace(request.City) || !string.IsNullOrWhiteSpace(request.Area);
        if (userEx is null && hasLocation)
        {
            var location = new Location { Country = "ethiopia", City = request.City?.Trim() ?? "", Area = request.Area?.Trim() ?? "" };
            db.Locations.Add(location);
            await db.SaveChangesAsync(cancellationToken);
            db.UsersEx.Add(new UserEx { UserId = userId, LocationId = location.Id });
        }
        else if (userEx is not null && userEx.Location is not null)
        {
            userEx.Location.City = request.City?.Trim() ?? "";
            userEx.Location.Area = request.Area?.Trim() ?? "";
        }
        await db.SaveChangesAsync(cancellationToken);
        var updatedLocation = await (from profile in db.UsersEx.AsNoTracking()
                                     join place in db.Locations.AsNoTracking() on profile.LocationId equals place.Id
                                     where profile.UserId == userId
                                     select place).FirstOrDefaultAsync(cancellationToken);
        return ToDto(user, updatedLocation);
    }

    public async Task UpdateAvatar(long userId, string avatarUrl, CancellationToken cancellationToken)
    {
        var user = await db.Users.FirstOrDefaultAsync(x => x.Id == userId && x.IsActive, cancellationToken)
            ?? throw new KeyNotFoundException("User account was not found.");
        user.Avatar = avatarUrl;
        user.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync(cancellationToken);
    }

    public async Task Delete(long userId, CancellationToken cancellationToken)
    {
        var user = await db.Users.FirstOrDefaultAsync(x => x.Id == userId && x.IsActive, cancellationToken)
            ?? throw new KeyNotFoundException("User account was not found.");
        user.IsActive = false;
        user.UpdatedAt = DateTime.UtcNow;
        var refreshTokens = await db.RefreshTokens.Where(x => x.UserId == userId && x.RevokedAt == null).ToListAsync(cancellationToken);
        foreach (var token in refreshTokens) token.RevokedAt = DateTime.UtcNow;
        await db.SaveChangesAsync(cancellationToken);
    }

    private static UserProfileDto ToDto(User user, Location? location) => new()
    {
        Id = user.Id, FullName = user.FullName, PhoneNumber = user.PhoneNumber, Email = user.Email,
        Role = user.Role.ToString(), AvatarUrl = user.Avatar, City = location?.City, Area = location?.Area,
        Country = location?.Country, SubArea = location?.SubArea, Verified = user.IsVerified, ReceiveNotifications = user.ReceiveNotifications
    };
}
