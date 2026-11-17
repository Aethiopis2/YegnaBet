using YegnaBet.Domain.Enums;

namespace YegnaBet.API.Modules.Employee.Dtos;

public sealed class EmployeeDealDto
{
    public long Id { get; set; }
    public long InquiryId { get; set; }
    public long ListingId { get; set; }
    public string ListingTitle { get; set; } = string.Empty;
    public string ListingLocation { get; set; } = string.Empty;
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerPhone { get; set; } = string.Empty;
    public decimal DealValue { get; set; }
    public decimal CommissionRate { get; set; }
    public decimal CommissionAmount { get; set; }
    public DealStatus Status { get; set; }
    public DateTime? CompletedAt { get; set; }
}
