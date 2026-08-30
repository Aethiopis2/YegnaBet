namespace YegnaBet.API.Modules.Marketplace.Dtos
{
    public class HomeCategoryDto
    {
        public string Id { get; set; } = null!;
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public string Image { get; set; } = null!;
        public string Type { get; set; } = null!;
        public string Route { get; set; } = null!;
    }
}
