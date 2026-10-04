using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;
using YegnaBet.API.Modules.Authentication.Dtos;
using YegnaBet.Domain.Entities;
using YegnaBet.Infrastructure.Persistence;

namespace YegnaBet.API.Modules.Authentication;

public sealed class AuthService : IAuthService
{
    private readonly BrokerDbContext _db;
    private readonly IPasswordHasher<User> _passwordHasher;
    private readonly IJwtService _jwtService;

    private sealed class RefreshResult
    {
        public string AccessToken { get; init; } = "";
        public DateTime ExpiresAt { get; init; }

        public string RefreshToken { get; init; } = "";
        public DateTime RefreshTokenExpiresAt { get; init; }

        public AuthUserDto User { get; init; } = null!;
    }


    public AuthService(
        BrokerDbContext db,
        IPasswordHasher<User> passwordHasher,
        IJwtService jwtService)
    {
        _db = db;
        _passwordHasher = passwordHasher;
        _jwtService = jwtService;
    }

    public async Task<LoginResponseDto?> Login(
        LoginRequestDto request,
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

        var accessToken = _jwtService.CreateAccessToken(user);
        var expiresAt = _jwtService.GetExpiration();
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
                IsVerified = user.IsVerified
            }
        };
    } // end Login


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