using YegnaBet.Domain.Enums;

namespace YegnaBet.Domain.Entities
{
    /// <summary>
    /// What is being offered
    /// </summary>
    public class Listing
    {
        public long Id { get; set; }

        public long ProviderId { get; set; }
        public User Provider { get; set; } = null!;

        public int CategoryId { get; set; }
        public Category Category { get; set; } = null!;

        public long LocationId { get; set; }
        public Location Location { get; set; } = null!;

        public ListingMethod Method { get; set; }

        public string Title { get; set; } = null!;
        public string? Description { get; set; }

        public decimal? Price { get; set; }
        public string? PriceUnit { get; set; }

        public ListingStatus ListingStatus { get; set; } = ListingStatus.Draft;

        public bool IsVerified { get; set; }

        public decimal TrustScore { get; set; } = 50m;

        public int ViewsCount { get; set; }
        public int InquiresCount { get; set; }
        public int SuccessfulDeals {  get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<ListingImage> Images { get; set; } = [];
        public ICollection<ListingTaxonomyNode> TaxonomyNodes { get; set; } = [];

        public ICollection<ListingAttributeValue> AttributeValues { get; set; } = [];
    }
}