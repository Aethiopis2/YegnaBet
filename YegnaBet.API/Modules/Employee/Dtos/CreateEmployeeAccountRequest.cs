using System.ComponentModel.DataAnnotations;

namespace YegnaBet.API.Modules.Employee.Dtos;

public sealed class CreateEmployeeAccountRequest
{
    [Required, StringLength(120, MinimumLength = 2)]
    public string FullName { get; set; } = "";

    [Required, Phone, StringLength(30)]
    public string PhoneNumber { get; set; } = "";

    [Required, EmailAddress, StringLength(254)]
    public string Email { get; set; } = "";

    [Required, MinLength(6)]
    public string Password { get; set; } = "";
}
