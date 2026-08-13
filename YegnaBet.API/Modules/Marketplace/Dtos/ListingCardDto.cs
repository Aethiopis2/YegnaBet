namespace YegnaBet.API.Modules.Marketplace.Dtos
{
    public class ListingCardDto 
    {
        public long Id { get; set; } 
        public string Title { get; set; } = null!; 
        public string Area { get; set; } = null!; 
        public decimal? Price { get; set; } 
        public string? PriceUnit { get; set; } 
        public decimal TrustScore { get; set; } 
        public bool IsVerified { get; set; } 
    }
}
