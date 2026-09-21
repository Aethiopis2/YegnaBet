namespace YegnaBet.API.Modules.Employee.Dtos;

public sealed class EmployeeTaxonomyNodeDto
{
    public long Id { get; set; }
    public string Name { get; set; } = null!;
    public string Slug { get; set; } = null!;
    public string? Description { get; set; }
    public string? Image { get; set; }
    public long? ParentId { get; set; }
    public int SortOrder { get; set; }
    public bool IsActive { get; set; }
    public int ListingCount { get; set; }
    public List<EmployeeTaxonomyNodeDto> Children { get; set; } = [];
}