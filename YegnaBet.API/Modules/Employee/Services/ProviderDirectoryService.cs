using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using YegnaBet.API.Modules.Employee.Dtos;
using YegnaBet.Domain.Entities;
using YegnaBet.Domain.Enums;
using YegnaBet.Infrastructure.Persistence;

namespace YegnaBet.API.Modules.Employee.Services;

public sealed class ProviderDirectoryService(
    BrokerDbContext db,
    IPasswordHasher<User> passwordHasher)
{
    public async Task<ProviderDirectoryPageDto> GetPage(
        ProviderDirectoryQueryDto request,
        CancellationToken cancellationToken)
    {
        var page = Math.Max(0, request.Page);
        var pageSize = Math.Clamp(request.PageSize, 1, 30);
        var query = db.Users.AsNoTracking().Where(user => user.Role == UserRole.Provider);
        if (request.IsActive.HasValue)
            query = query.Where(user => user.IsActive == request.IsActive.Value);
        var search = request.Search?.Trim();
        if (!string.IsNullOrWhiteSpace(search))
        {
            var pattern = $"%{search}%";
            query = query.Where(user =>
                EF.Functions.ILike(user.FullName, pattern) ||
                EF.Functions.ILike(user.PhoneNumber, pattern) ||
                (user.Email != null && EF.Functions.ILike(user.Email, pattern)));
        }

        var totalCount = await query.CountAsync(cancellationToken);
        var rows = await query
            .OrderByDescending(user => user.IsActive)
            .ThenBy(user => user.FullName)
            .Skip(page * pageSize)
            .Take(pageSize + 1)
            .Select(user => new ProviderAccountDto
            {
                Id = user.Id,
                FullName = user.FullName,
                PhoneNumber = user.PhoneNumber,
                Email = user.Email ?? string.Empty,
                IsActive = user.IsActive,
                IsVerified = user.IsVerified,
                CreatedAt = user.CreatedAt,
                UpdatedAt = user.UpdatedAt
            })
            .ToListAsync(cancellationToken);
        var hasMore = rows.Count > pageSize;
        if (hasMore) rows.RemoveAt(rows.Count - 1);

        return new ProviderDirectoryPageDto
        {
            Items = rows,
            Page = page,
            PageSize = pageSize,
            HasMore = hasMore,
            TotalCount = totalCount
        };
    }

    public async Task<ProviderAccountDto> Get(long providerId, CancellationToken cancellationToken)
    {
        var provider = await db.Users.AsNoTracking()
            .FirstOrDefaultAsync(user => user.Id == providerId && user.Role == UserRole.Provider,
                cancellationToken)
            ?? throw new KeyNotFoundException("Provider account was not found.");
        return ToDto(provider);
    }

    public async Task<ProviderAccountDto> Create(
        CreateProviderAccountRequest request,
        CancellationToken cancellationToken)
    {
        var phone = request.PhoneNumber.Trim();
        var email = request.Email.Trim().ToLowerInvariant();
        await EnsureUnique(phone, email, null, cancellationToken);

        var provider = new User
        {
            Role = UserRole.Provider,
            FullName = request.FullName.Trim(),
            PhoneNumber = phone,
            Email = email,
            IsActive = true,
            IsVerified = false,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        provider.PasswordHash = passwordHasher.HashPassword(provider, request.Password);
        db.Users.Add(provider);
        await db.SaveChangesAsync(cancellationToken);
        return ToDto(provider);
    }

    public async Task<ProviderAccountDto> Update(
        long providerId,
        UpdateProviderAccountRequest request,
        CancellationToken cancellationToken)
    {
        var provider = await db.Users.FirstOrDefaultAsync(
            user => user.Id == providerId && user.Role == UserRole.Provider,
            cancellationToken)
            ?? throw new KeyNotFoundException("Provider account was not found.");

        var phone = request.PhoneNumber.Trim();
        var email = request.Email.Trim().ToLowerInvariant();
        await EnsureUnique(phone, email, providerId, cancellationToken);

        provider.FullName = request.FullName.Trim();
        provider.PhoneNumber = phone;
        provider.Email = email;
        provider.IsActive = request.IsActive;
        provider.IsVerified = request.IsVerified;
        provider.UpdatedAt = DateTime.UtcNow;

        if (!string.IsNullOrWhiteSpace(request.NewPassword))
        {
            if (request.NewPassword.Length < 6)
                throw new ArgumentException("Password must be at least 6 characters.");
            provider.PasswordHash = passwordHasher.HashPassword(provider, request.NewPassword);
        }

        if (!provider.IsActive)
            await RevokeRefreshTokens(providerId, cancellationToken);

        await db.SaveChangesAsync(cancellationToken);
        return ToDto(provider);
    }

    public async Task Remove(long providerId, CancellationToken cancellationToken)
    {
        var provider = await db.Users.FirstOrDefaultAsync(
            user => user.Id == providerId && user.Role == UserRole.Provider && user.IsActive,
            cancellationToken)
            ?? throw new KeyNotFoundException("Active provider account was not found.");

        provider.IsActive = false;
        provider.UpdatedAt = DateTime.UtcNow;
        await RevokeRefreshTokens(providerId, cancellationToken);
        await db.SaveChangesAsync(cancellationToken);
    }

    private async Task EnsureUnique(
        string phone,
        string email,
        long? exceptId,
        CancellationToken cancellationToken)
    {
        var phoneQuery = db.Users.Where(user => user.PhoneNumber == phone);
        var emailQuery = db.Users.Where(user => user.Email != null && user.Email.ToLower() == email);
        if (exceptId.HasValue)
        {
            phoneQuery = phoneQuery.Where(user => user.Id != exceptId.Value);
            emailQuery = emailQuery.Where(user => user.Id != exceptId.Value);
        }

        if (await phoneQuery.AnyAsync(cancellationToken))
            throw new ArgumentException("That phone number is already in use.");
        if (await emailQuery.AnyAsync(cancellationToken))
            throw new ArgumentException("That email address is already in use.");
    }

    private async Task RevokeRefreshTokens(long providerId, CancellationToken cancellationToken)
    {
        var tokens = await db.RefreshTokens
            .Where(token => token.UserId == providerId && token.RevokedAt == null)
            .ToListAsync(cancellationToken);
        foreach (var token in tokens) token.RevokedAt = DateTime.UtcNow;
    }

    private static ProviderAccountDto ToDto(User user) => new()
    {
        Id = user.Id,
        FullName = user.FullName,
        PhoneNumber = user.PhoneNumber,
        Email = user.Email ?? string.Empty,
        IsActive = user.IsActive,
        IsVerified = user.IsVerified,
        CreatedAt = user.CreatedAt,
        UpdatedAt = user.UpdatedAt
    };
}
