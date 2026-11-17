namespace YegnaBet.API.Modules.Users.Dtos;

public sealed class UserProfileDto
{
    public long Id { get; set; }
    public string FullName { get; set; } = "";
    public string PhoneNumber { get; set; } = "";
    public string? Email { get; set; }
    public string Role { get; set; } = "";
    public string? AvatarUrl { get; set; }
    public string? City { get; set; }
    public string? Area { get; set; }
    public string? SubArea { get; set; }
    public string? Country { get; set; }
    public bool Verified { get; set; }
    public bool ReceiveNotifications { get; set; }
}

public sealed class UpdateUserProfileRequest
{
    public string FullName { get; set; } = "";
    public string PhoneNumber { get; set; } = "";
    public string? Email { get; set; }
    public string? City { get; set; }
    public string? Area { get; set; }
    public bool ReceiveNotifications { get; set; }
}
