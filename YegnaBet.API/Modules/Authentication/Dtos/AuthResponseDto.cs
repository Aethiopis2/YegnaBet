namespace YegnaBet.API.Modules.Authentication.Dtos;

public sealed class AuthResponseDto
{
    public string Token { get; set; } = null!;
    public UserResponseDto User { get; set; } = null!;
}