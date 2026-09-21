namespace YegnaBet.API.Modules.Employee.Dtos;

public sealed class CreateTaxonomyAttributeRequest
{
    public string Name { get; set; } = null!;
    public string Key { get; set; } = null!;
    public string Type { get; set; } = null!;
    public bool Required { get; set; }
    public bool Searchable { get; set; }
    public bool Filterable { get; set; }
    public decimal? MinValue { get; set; }
    public decimal? MaxValue { get; set; }
    public List<string> Options { get; set; } = [];
}