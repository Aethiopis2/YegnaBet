namespace YegnaBet.API.Modules.Marketplace.Dtos
{
    public class ListingLocationDto
    {
        public long Id { get; set; }
        public string City { get; set; } = null!;
        public string Area { get; set; } = null!;
        public string? SubArea { get; set; }
    }
}