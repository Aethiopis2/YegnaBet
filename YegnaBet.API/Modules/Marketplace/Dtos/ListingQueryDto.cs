using YegnaBet.Domain.Enums;

namespace YegnaBet.API.Modules.Marketplace.Dtos
{
    public class ListingQueryDto
    {
        public int Page { get; set; } = 0;
        public int PageSize { get; set; } = 5;

        public long? Id { get; set; } = -1;
        public long? UserId { get; set; } = -1;
        public long? ProviderId { get; set; }

        public ListingMethod? Method { get; set; }

        public int? TaxonomyNodeId { get; set; }
        public string? Category { get; set; }
        public string? Search { get; set; }

        // New: supports multiple selected locations.
        public List<int>? LocationIds { get; set; }

        // Legacy: retained for existing callers.
        public string? Location { get; set; }

        public bool? Verified { get; set; }
        public bool? Featured { get; set; }
        public bool? Trending { get; set; }
        public bool? Saved { get; set; }

        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }

        public string? Sort { get; set; }

        public Dictionary<string, string>? Attributes { get; set; }

        public ListingStatus? Status { get; set; }
        public bool AllStatuses { get; set; }
        public bool MyListingsOnly { get; set; }
    }
}
