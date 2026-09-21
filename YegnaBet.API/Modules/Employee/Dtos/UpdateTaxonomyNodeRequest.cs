namespace YegnaBet.API.Modules.Employee.Dtos;

public sealed class UpdateTaxonomyNodeRequest
{
    public string Name { get; set; } = null!;
    public string? Slug { get; set; }
    public string? Description { get; set; }
    public string? Image { get; set; }
    public long? ParentId { get; set; }
    public int SortOrder { get; set; }
    public bool IsActive { get; set; }
}