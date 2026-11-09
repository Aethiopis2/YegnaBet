using YegnaBet.Domain.Enums;

namespace YegnaBet.API.Modules.Authentication.Dtos;

public sealed class UserResponseDto
{
    public long Id { get; set; }
    public UserRole Role { get; set; }
    public string FullName { get; set; } = null!;
    public string PhoneNumber { get; set; } = null!;
    public string Email { get; set; } = null!;
    public bool IsVerified { get; set; }
    public bool IsActive { get; set; }
    public string? Avatar { get; set; }
}