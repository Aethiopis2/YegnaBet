namespace YegnaBet.API.Modules.Owner.Dtos;

public sealed class OwnerCommissionDetailDto
{
    public OwnerCommissionListItemDto Commission { get; set; } = new();
    public string? ReferenceNumber { get; set; }
    public string? ListingDescription { get; set; }
    public decimal? ListingPrice { get; set; }
    public string? PriceUnit { get; set; }
    public string City { get; set; } = string.Empty;
    public string Area { get; set; } = string.Empty;
    public string? SubArea { get; set; }
    public DateTime? DealCompletedAt { get; set; }
    public string DealStatus { get; set; } = string.Empty;
    public List<OwnerCommissionMediaDto> Media { get; set; } = [];
    public List<OwnerCommissionAttributeDto> Attributes { get; set; } = [];
    public OwnerCommissionPersonDto Provider { get; set; } = new();
    public OwnerCommissionPersonDto Employee { get; set; } = new();
    public OwnerCommissionPersonDto? Customer { get; set; }
}

public sealed class OwnerCommissionMediaDto
{
    public string Url { get; set; } = string.Empty;
    public string Kind { get; set; } = "photo";
    public bool IsPrimary { get; set; }
}

public sealed class OwnerCommissionAttributeDto
{
    public string Name { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
}

public sealed class OwnerCommissionPersonDto
{
    public long Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string? Avatar { get; set; }
}
