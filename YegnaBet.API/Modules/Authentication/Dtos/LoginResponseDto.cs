namespace YegnaBet.API.Modules.Authentication.Dtos;

public sealed class LoginResponseDto
{
    public string AccessToken { get; set; } = "";
    public DateTime ExpiresAt { get; set; }
    public AuthUserDto User { get; set; } = null!;
}