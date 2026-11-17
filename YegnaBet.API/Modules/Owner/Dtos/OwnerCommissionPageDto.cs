namespace YegnaBet.API.Modules.Owner.Dtos;

public sealed class OwnerCommissionPageDto
{
    public List<OwnerCommissionListItemDto> Items { get; set; } = [];
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalCount { get; set; }
    public bool HasMore { get; set; }
    public decimal TotalAmount { get; set; }
}

public sealed class OwnerCommissionListItemDto
{
    public long Id { get; set; }
    public long DealId { get; set; }
    public long ListingId { get; set; }
    public string ListingTitle { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Method { get; set; } = string.Empty;
    public string ListingStatus { get; set; } = string.Empty;
    public string ProviderName { get; set; } = string.Empty;
    public string EmployeeName { get; set; } = string.Empty;
    public decimal CommissionAmount { get; set; }
    public decimal DealValue { get; set; }
    public decimal CommissionRate { get; set; }
    public string Currency { get; set; } = "ETB";
    public DateTime TransactionDate { get; set; }
    public string? ThumbnailUrl { get; set; }
}
