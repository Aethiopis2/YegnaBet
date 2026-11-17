using YegnaBet.Domain.Enums;

namespace YegnaBet.API.Modules.Owner.Dtos;

public sealed class OwnerListingsDto
{
    public long Id { get; set; }
    public long? ListingId { get; set; }
    public string Title { get; set; } = null!;
    public string Category { get; set; } = null!;
    public string Location { get; set; } = null!;
    public string Provider { get; set; } = null!;
    public ListingStatus ListingStatus { get; set; }
    public bool Verified { get; set; }
    public long Views {  get; set; }
    public DateTime CreatedAt { get; set; }
    public string Status { get; set; } = string.Empty;
    public decimal Price { get; set; }
}
