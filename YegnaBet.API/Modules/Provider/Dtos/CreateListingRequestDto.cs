using YegnaBet.Domain.Enums;

namespace YegnaBet.API.Modules.Provider.Dtos
{
    public class CreateListingRequestDto
    {
        public string Title { get; set; } = null!;
        public string? Description { get; set; }

        public decimal? Price { get; set; }
        public string? PriceUnit { get; set; }

        public ListingMethod Method { get; set; }
        public ListingStatus ListingStatus { get; set; } = ListingStatus.Draft;

        public long LocationId { get; set; }
        public long TaxonomyId { get; set; }

        // Optional precise location
        public decimal? Latitude { get; set; }
        public decimal? Longitude { get; set; }

        public List<IFormFile> Images { get; set; } = [];
        public List<string> VideoUrls { get; set; } = [];
    }
}
