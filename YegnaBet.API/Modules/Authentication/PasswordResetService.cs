using System.Net;
using System.Net.Mail;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using YegnaBet.Domain.Entities;
using YegnaBet.Infrastructure.Persistence;

namespace YegnaBet.API.Modules.Authentication;

public sealed class PasswordResetService(
    BrokerDbContext db,
    IPasswordHasher<User> passwordHasher,
    IConfiguration configuration,
    ILogger<PasswordResetService> logger)
{
    public bool IsConfigured =>
        !string.IsNullOrWhiteSpace(configuration["Smtp:Host"]) &&
        !string.IsNullOrWhiteSpace(configuration["Smtp:From"]);

    public async Task RequestReset(string email, CancellationToken cancellationToken)
    {
        var normalized = email.Trim().ToLowerInvariant();
        var user = await db.Users.FirstOrDefaultAsync(x => x.Email == normalized && x.IsActive, cancellationToken);
        if (user is null) return;

        var rawToken = Convert.ToBase64String(RandomNumberGenerator.GetBytes(48))
            .TrimEnd('=').Replace('+', '-').Replace('/', '_');
        var tokenHash = Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(rawToken)));
        var previousTokens = await db.PasswordResetTokens
            .Where(x => x.UserId == user.Id && x.UsedAt == null)
            .ToListAsync(cancellationToken);
        foreach (var previous in previousTokens) previous.UsedAt = DateTime.UtcNow;
        db.PasswordResetTokens.Add(new PasswordResetToken
        {
            UserId = user.Id,
            TokenHash = tokenHash,
            ExpiresAt = DateTime.UtcNow.AddMinutes(30)
        });
        await db.SaveChangesAsync(cancellationToken);

        try
        {
            await SendEmail(email: normalized, rawToken, cancellationToken);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Unable to send password reset email.");
            var token = await db.PasswordResetTokens.FirstAsync(x => x.TokenHash == tokenHash, cancellationToken);
            token.UsedAt = DateTime.UtcNow;
            await db.SaveChangesAsync(cancellationToken);
        }
    }

    public async Task<bool> ResetPassword(string email, string rawToken, string newPassword, CancellationToken cancellationToken)
    {
        var normalized = email.Trim().ToLowerInvariant();
        var tokenHash = Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(rawToken)));
        var reset = await db.PasswordResetTokens.Include(x => x.User)
            .FirstOrDefaultAsync(x => x.TokenHash == tokenHash && x.UsedAt == null && x.ExpiresAt > DateTime.UtcNow &&
                x.User.Email == normalized && x.User.IsActive, cancellationToken);
        if (reset is null) return false;

        reset.User.PasswordHash = passwordHasher.HashPassword(reset.User, newPassword);
        reset.User.UpdatedAt = DateTime.UtcNow;
        reset.UsedAt = DateTime.UtcNow;
        var otherTokens = await db.RefreshTokens.Where(x => x.UserId == reset.UserId && x.RevokedAt == null).ToListAsync(cancellationToken);
        foreach (var token in otherTokens) token.RevokedAt = DateTime.UtcNow;
        await db.SaveChangesAsync(cancellationToken);
        return true;
    }

    private async Task SendEmail(string email, string rawToken, CancellationToken cancellationToken)
    {
        var section = configuration.GetSection("Smtp");
        var host = section["Host"];
        var from = section["From"];
        if (string.IsNullOrWhiteSpace(host) || string.IsNullOrWhiteSpace(from))
            throw new InvalidOperationException("SMTP email settings are not configured.");

        var frontend = configuration["FrontendBaseUrl"] ?? "http://localhost:5173";
        var link = $"{frontend.TrimEnd('/')}/reset-password?email={Uri.EscapeDataString(email)}&token={Uri.EscapeDataString(rawToken)}";
        using var message = new MailMessage(from, email)
        {
            Subject = "Reset your YegnaBet password",
            Body = $"Use this link to reset your password. It expires in 30 minutes:\n\n{link}\n\nIf you did not request a password reset, ignore this email.",
            IsBodyHtml = false
        };
        using var client = new SmtpClient(host, int.TryParse(section["Port"], out var port) ? port : 587)
        {
            EnableSsl = !bool.TryParse(section["EnableSsl"], out var ssl) || ssl,
            DeliveryMethod = SmtpDeliveryMethod.Network
        };
        var username = section["Username"];
        var password = section["Password"];
        if (!string.IsNullOrWhiteSpace(username)) client.Credentials = new NetworkCredential(username, password);
        cancellationToken.ThrowIfCancellationRequested();
        await client.SendMailAsync(message, cancellationToken);
    }
}
