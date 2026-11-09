using YegnaBet.Domain.Enums;

namespace YegnaBet.API.Modules.Employee.Dtos;

public class EmployeeInquiryDto
{
    public long Id { get; set; }
    public long ListingId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string ListingTitle { get; set; } = string.Empty;
    public InquiryStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }
}