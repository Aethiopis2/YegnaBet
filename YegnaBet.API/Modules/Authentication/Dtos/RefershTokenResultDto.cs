using YegnaBet.API.Modules.Authentication.Dtos;

public sealed class RefreshTokenResult
{
    public string AccessToken { get; init; } = "";
    public DateTime ExpiresAt { get; init; }
    public string RefreshToken { get; init; } = "";
    public DateTime RefreshTokenExpiresAt { get; init; }
    public AuthUserDto User { get; init; } = null!;
}