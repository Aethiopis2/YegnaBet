namespace YegnaBet.API.Modules.Employee.Dtos;

public sealed class CreateTaxonomyNodeRequest
{
    public string Name { get; set; } = null!;
    public string? Slug { get; set; }
    public string? Description { get; set; }
    public string? Image { get; set; }
    public long? ParentId { get; set; }
}