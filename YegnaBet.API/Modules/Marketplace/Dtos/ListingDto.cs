namespace YegnaBet.API.Modules.Marketplace.Dtos
{
    public class ListingDto
    {
        public long Id { get; set; }
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public decimal? Price { get; set; }
        public string Currency { get; set; } = "ETB";
        public string Status { get; set; } = null!;
        public ListingLocationDto Location { get; set; } = null!;
        public string[] Images { get; set; } = [];
        public bool Featured { get; set; }
        public bool Verified { get; set; }
        public bool Trending { get; set; }
        public bool Saved { get; set; }
        public List<ListingMetadataDto> Metadata { get; set; } = [];
    }
}