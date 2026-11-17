using System.ComponentModel.DataAnnotations;

namespace YegnaBet.API.Modules.Employee.Dtos;

public sealed class UpdateEmployeeAccountRequest
{
    [Required, StringLength(120, MinimumLength = 2)]
    public string FullName { get; set; } = "";

    [Required, Phone, StringLength(30)]
    public string PhoneNumber { get; set; } = "";

    [Required, EmailAddress, StringLength(254)]
    public string Email { get; set; } = "";

    public bool IsActive { get; set; }
    public bool IsVerified { get; set; }

    [MinLength(6)]
    public string? NewPassword { get; set; }
}
