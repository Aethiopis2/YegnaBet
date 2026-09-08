using YegnaBet.Domain.Enums;

namespace YegnaBet.Domain.Entities
{
    public class Listing
    {
        public long Id { get; set; }
        public long ProviderId { get; set; }
        public long LocationId { get; set; }
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public decimal? Price { get; set; }
        public string? PriceUnit { get; set; }
        public ListingMethod Method { get; set; }
        public ListingStatus ListingStatus { get; set; } = ListingStatus.Draft;
        public decimal TrustScore { get; set; } = 50m;
        public bool IsVerified { get; set; }
        public bool IsFeatured { get; set; }
        public DateTime FeaturedUntil { get; set; } = DateTime.UtcNow;
        public int ViewsCount { get; set; }
        public int InquiresCount { get; set; }
        public int SuccessfulDeals {  get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime ApprovedDate { get; set; } = DateTime.UtcNow;

        public decimal? Latitude { get; set; }
        public decimal? Longitude { get; set; }

        public User Provider { get; set; } = null!;
        public Location Location { get; set; } = null!;
        public ICollection<ListingImage> Images { get; set; } = [];
        public ICollection<ListingTaxonomyNode> TaxonomyNodes { get; set; } = [];
        public ICollection<ListingAttributeValue> AttributeValues { get; set; } = [];
    }
}