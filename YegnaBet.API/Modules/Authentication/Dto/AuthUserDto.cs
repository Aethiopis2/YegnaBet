namespace YegnaBet.API.Modules.Authentication.Dtos;

public sealed class AuthUserDto
{
    public long Id { get; set; }
    public string FullName { get; set; } = "";
    public string PhoneNumber { get; set; } = "";
    public string Role { get; set; } = "";
    public bool IsVerified { get; set; }
}