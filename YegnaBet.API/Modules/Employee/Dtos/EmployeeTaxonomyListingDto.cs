namespace YegnaBet.API.Modules.Employee.Dtos;

public sealed class EmployeeTaxonomyListingDto
{
    public long Id { get; set; }
    public string Title { get; set; } = null!;
    public string Status { get; set; } = null!;
    public decimal? Price { get; set; }
    public DateTime CreatedAt { get; set; }
}
