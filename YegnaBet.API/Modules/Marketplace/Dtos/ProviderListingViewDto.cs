namespace YegnaBet.API.Modules.Marketplace.Dtos
{
    public class ProviderListingViewDto
    {
        public long Id { get; set; }
        public string Title { get; set; } = null!;
        public string Type { get; set; } = null!;
        public decimal? Price { get; set; }
        public string? PriceUnit { get; set; }
        public string Status { get; set; } = null!;
        public string Image {  get; set; } = null!;
    }
}