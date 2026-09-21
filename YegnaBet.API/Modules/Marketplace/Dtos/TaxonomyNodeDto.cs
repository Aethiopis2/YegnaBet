namespace YegnaBet.API.Modules.Marketplace.Dtos
{
    public class TaxonomyNodeDto
    {
        public long Id { get; set; }
        public string Name { get; set; } = null!;
        public string Slug { get; set; } = null;
        public string? Description { get; set; }
        public string? Image { get; set;  }
        public List<TaxonomyNodeDto> Children { get; set; } = [];
    }
}