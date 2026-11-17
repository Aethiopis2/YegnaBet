using YegnaBet.Domain.Enums;

namespace YegnaBet.API.Modules.Marketplace.Dtos;

public sealed class UpdateManagedListingDto
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal? Price { get; set; }
    public string City { get; set; } = string.Empty;
    public string Area { get; set; } = string.Empty;
    public ListingMethod Method { get; set; }
    public ListingStatus ListingStatus { get; set; }
}
