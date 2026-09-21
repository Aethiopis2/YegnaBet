namespace YegnaBet.API.Modules.Marketplace.Dtos
{
    public class ListingLocationDto
    {
        public long Id { get; set; }
        public string Country { get; set; } = "Ethiopia";
        public string City { get; set; } = null!;
        public string Area { get; set; } = null!;
        public string? SubArea { get; set; }
        public int Count { get; set; }
    }
}