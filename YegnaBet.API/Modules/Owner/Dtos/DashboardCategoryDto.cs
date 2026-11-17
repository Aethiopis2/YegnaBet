namespace YegnaBet.API.Modules.Owner.Dtos;

public sealed class DashboardCategoryDto
{
    public long Id { get; set; }
    public string Name { get; set; } = null!;
    public string Taxonomy { get; set; } = null!;
    public int ListingCount { get; set; }
}