namespace YegnaBet.API.Modules.Marketplace.Dtos
{
    public class HomeFeaturedListingsDto
    {
        public long Id { get; set; }
        public string Type { get; set; } = null!;
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public string? Currency {  get; set; }
        public string Status { get; set; } = null!;
        public ListingLocationDto Location { get; set; } = new ListingLocationDto();
        public string[] Images { get; set; } = null!;
        public bool Featured { get; set; }
        public bool Verified { get; set; }
        public bool Trending { get; set; }
        public bool Saved { get; set; } = false;
    }
}
