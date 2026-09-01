using YegnaBet.Domain.Enums;

namespace YegnaBet.API.Modules.Marketplace.Dtos
{
    public class ListingQueryDto
    {
        public int Page { get; set; } = 0;
        public int PageSize { get; set; } = 5;
        public ListingMethod? Method { get; set; }
        public string? Category { get; set; }
        public string? Location { get; set; }
        public bool? Verified { get; set; }
        public bool? Featured { get; set; }
        public bool? Trending { get; set; }
        public bool? Saved { get; set; }
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
        public string? Sort { get; set; }
        public Dictionary<string, string>? Attributes { get; set; }
    }
}