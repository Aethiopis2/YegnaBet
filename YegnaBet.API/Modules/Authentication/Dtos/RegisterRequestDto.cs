namespace YegnaBet.API.Modules.Authentication.Dtos;

public sealed class RegisterRequestDto
{
    public string FullName { get; set; } = null!;
    public string PhoneNumber { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string Password { get; set; } = null!;
    public IFormFile? Avatar { get; set; }

    // Optional location
    public string? Country { get; set; }
    public string? City { get; set; }
    public string? Area { get; set; }
    public string? SubArea { get; set; }

    // Optional map position
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
}