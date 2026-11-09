using YegnaBet.Domain.Enums;

namespace YegnaBet.API.Modules.Employee.Dtos;

public class CustomerSm
{
    public long Id { get; set; }
    public string Name { get; set; } = null!;
    public string PhoneNumber { get; set; } = null!;
    public string? Email {  get; set; }
}

public class ListingSm
{
    public long Id { get; set; }
    public string Title { get; set; } = null!;
    public string Category { get; set; } = null!;
    public string Location { get; set; } = null!;
    public decimal? Price { get; set; }
    public string? ImageUrl { get; set; } = null!;
}

public class EmployeeRequestDto
{
    public long Id { get; set; }
    public CustomerSm Customer { get; set; } = null!;
    public ListingSm Listing {  get; set; } = null!;
    public InquiryStatus Status { get; set; }
    public string CreatedAt { get; set; } = null!;
}


public class UpdateInquiryDto
{
    public long InquiryId { get; set; }
    public InquiryStatus Status { get; set; }
}