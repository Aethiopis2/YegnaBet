namespace YegnaBet.API.Modules.Authentication.Dtos;

public sealed class LoginRequestDto
{
    public string PhoneNumber { get; set; } = "";
    public string Password { get; set; } = "";
}