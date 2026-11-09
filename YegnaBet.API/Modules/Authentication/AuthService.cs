using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;
using YegnaBet.API.Modules.Authentication.Dtos;
using YegnaBet.API.Modules.Users.Dtos;
using YegnaBet.Domain.Entities;
using YegnaBet.Domain.Enums;
using YegnaBet.Infrastructure.Persistence;

namespace YegnaBet.API.Modules.Authentication;

public sealed class AuthService(BrokerDbContext db, IPasswordHasher<User> passwordHasher, 
    IJwtService jwtService, IAvatarStorage avatarStorage) : IAuthService
{
    private readonly BrokerDbContext _db = db;
    private readonly IPasswordHasher<User> _passwordHasher = passwordHasher;
    private readonly IJwtService _jwtService = jwtService;
    private readonly IAvatarStorage _avatarStorage = avatarStorage;

    private sealed class RefreshResult
    {
        public string AccessToken { get; init; } = "";
        public DateTime ExpiresAt { get; init; }

        public string RefreshToken { get; init; } = "";
        public DateTime RefreshTokenExpiresAt { get; init; }

        public AuthUserDto User { get; init; } = null!;
    }

    public async Task<LoginResponseDto?> Login(LoginRequestDto request, 
        CancellationToken cancellationToken)
    {
        var phoneNumber = request.PhoneNumber.Trim();

        var user = await _db.Users
            .SingleOrDefaultAsync(
                x => x.PhoneNumber == phoneNumber,
                cancellationToken);

        if (user == null)
            return null;

        if (!user.IsActive)
            return null;

        var passwordResult =
            _passwordHasher.VerifyHashedPassword(
                user,
                user.PasswordHash,
                request.Password);

        if (passwordResult ==
            PasswordVerificationResult.Failed)
        {
            return null;
        }

        var accessToken =
            _jwtService.CreateAccessToken(user);

        var expiresAt =
            _jwtService.GetExpiration();

        // Create refresh token
        var refreshToken = GenerateRefreshToken();

        var refreshTokenEntity = new RefreshToken
        {
            UserId = user.Id,
            TokenHash = HashToken(refreshToken),
            ExpiresAt = DateTime.UtcNow.AddDays(30)
        };

        _db.RefreshTokens.Add(refreshTokenEntity);

        await _db.SaveChangesAsync(cancellationToken);

        return new LoginResponseDto
        {
            AccessToken = accessToken,
            ExpiresAt = expiresAt,
            User = new AuthUserDto
            {
                Id = user.Id,
                FullName = user.FullName,
                PhoneNumber = user.PhoneNumber,
                Role = user.Role.ToString(),
                IsVerified = user.IsVerified,
                Avatar = user.Avatar,
            }
        };
    } // end Login


    public async Task<RefreshTokenResult?> Refresh(
        string refreshToken,
        CancellationToken cancellationToken)
    {
        var tokenHash = HashToken(refreshToken);

        var storedToken = await _db.RefreshTokens
            .Include(x => x.User)
            .SingleOrDefaultAsync(
                x => x.TokenHash == tokenHash,
                cancellationToken);

        if (storedToken == null)
            return null;

        if (storedToken.RevokedAt.HasValue)
            return null;

        if (storedToken.ExpiresAt <= DateTime.UtcNow)
            return null;

        var user = storedToken.User;

        if (!user.IsActive)
            return null;

        // Rotate refresh token
        storedToken.RevokedAt = DateTime.UtcNow;

        var newRefreshToken = GenerateRefreshToken();

        var newRefreshTokenHash =
            HashToken(newRefreshToken);

        var newRefreshTokenEntity = new RefreshToken
        {
            UserId = user.Id,
            TokenHash = newRefreshTokenHash,
            ExpiresAt = DateTime.UtcNow.AddDays(30)
        };

        storedToken.ReplacedByTokenHash =
            newRefreshTokenHash;

        _db.RefreshTokens.Add(newRefreshTokenEntity);

        // Create new access token
        var accessToken =
            _jwtService.CreateAccessToken(user);

        var expiresAt =
            _jwtService.GetExpiration();

        await _db.SaveChangesAsync(cancellationToken);

        return new RefreshTokenResult
        {
            AccessToken = accessToken,
            ExpiresAt = expiresAt,
            RefreshToken = newRefreshToken,
            RefreshTokenExpiresAt =
                newRefreshTokenEntity.ExpiresAt,

            User = new AuthUserDto
            {
                Id = user.Id,
                FullName = user.FullName,
                PhoneNumber = user.PhoneNumber,
                Role = user.Role.ToString(),
                IsVerified = user.IsVerified
            }
        };
    } // end Refersh


    public async Task<AuthResponseDto> RegisterAsync(RegisterRequestDto request)
    {
        if (string.IsNullOrWhiteSpace(request.FullName))
            throw new InvalidOperationException(
                "Full name is required.");

        if (string.IsNullOrWhiteSpace(request.PhoneNumber))
            throw new InvalidOperationException(
                "Phone number is required.");

        if (string.IsNullOrWhiteSpace(request.Email))
            throw new InvalidOperationException(
                "Email is required.");

        if (string.IsNullOrWhiteSpace(request.Password))
            throw new InvalidOperationException(
                "Password is required.");

        if (request.Password.Length < 6)
            throw new InvalidOperationException(
                "Password must be at least 6 characters.");

        var phoneNumber =
            request.PhoneNumber.Trim();

        var email =
            request.Email.Trim().ToLowerInvariant();

        var phoneExists =
            await _db.Users.AnyAsync(
                x => x.PhoneNumber == phoneNumber);

        if (phoneExists)
            throw new InvalidOperationException(
                "An account with this phone number already exists.");

        var emailExists =
            await _db.Users.AnyAsync(
                x => x.Email.ToLower() == email);

        if (emailExists)
            throw new InvalidOperationException(
                "An account with this email already exists.");

        var user = new User
        {
            FullName = request.FullName.Trim(),
            PhoneNumber = phoneNumber,
            Email = email,

            Role = UserRole.Customer,

            IsVerified = false,
            IsActive = true,

            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        user.PasswordHash =
            _passwordHasher.HashPassword(
                user,
                request.Password);

        /*
         * Optional avatar
         */
        if (request.Avatar is not null)
        {
            user.Avatar =
                await _avatarStorage.SaveAsync(
                    request.Avatar);
        }

        /*
         * Optional location
         *
         * This section depends on your existing
         * Location entity.
         */
        if (HasLocation(request))
        {
            var location = new Location
            {
                Country = request.Country!.Trim(),
                City = request.City!.Trim(),
                Area = request.Area!.Trim(),
                SubArea = string.IsNullOrWhiteSpace(
                    request.SubArea)
                    ? null
                    : request.SubArea.Trim(),

                //Latitude = request.Latitude,
                //Longitude = request.Longitude
            };

            _db.Locations.Add(location);
            await _db.SaveChangesAsync();

            var userEx = new UserEx
            {
                LocationId = location.Id,
                UserId = user.Id,
            };
            //user.Location = location;
        }

        _db.Users.Add(user);

        await _db.SaveChangesAsync();

        /*
         * Generate the same JWT you generate during login.
         */
        return GenerateAuthResponse(user);
    } // end Register


    public async Task<AuthUserDto> GetUser(long userId)
    {
        var user = await _db.Users
            .AsNoTracking()
            .Where(x => x.Id == userId)
            .Select(u => new AuthUserDto
            {
                Id = u.Id,
                FullName = u.FullName,
                PhoneNumber = u.PhoneNumber,
                Role = u.Role.ToString(),
                Avatar = u.Avatar,
                IsVerified = u.IsVerified
            })
            .FirstOrDefaultAsync();

        if (user == null)
            throw new KeyNotFoundException($"User with id {userId} was not found.");

        return user;
    } // end GetUser

    private AuthResponseDto GenerateAuthResponse(User user)
    {
        var token = _jwtService.CreateAccessToken(user);
        return new AuthResponseDto
        {
            Token = token,

            User = new UserResponseDto
            {
                Id = user.Id,
                Role = user.Role,
                FullName = user.FullName,
                PhoneNumber = user.PhoneNumber,
                Email = user.Email??"",
                IsVerified = user.IsVerified,
                IsActive = user.IsActive,
                Avatar = user.Avatar
            }
        };
    }


    private static bool HasLocation(
    RegisterRequestDto request)
    {
        return
            !string.IsNullOrWhiteSpace(request.Country) ||
            !string.IsNullOrWhiteSpace(request.City) ||
            !string.IsNullOrWhiteSpace(request.Area) ||
            !string.IsNullOrWhiteSpace(request.SubArea) ||
            request.Latitude.HasValue ||
            request.Longitude.HasValue;
    } // end HasLocation


    private static string GenerateRefreshToken()
    {
        var bytes = RandomNumberGenerator.GetBytes(64);
        return Convert.ToBase64String(bytes);
    } // end GenerateRefershToken

    private static string HashToken(string token)
    {
        var bytes = SHA256.HashData(
            Encoding.UTF8.GetBytes(token));

        return Convert.ToHexString(bytes);
    } // end HashToken
}