namespace YegnaBet.API.Modules.Marketplace.Dtos
{
    public class ListingPageDto
    {
        public List<ListingDto> Items { get; set; } = [];
        public int Page { get; set; }
        public int PageSize { get; set; }
        public bool HasMore { get; set; }
    }
}