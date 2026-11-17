namespace YegnaBet.API.Modules.Employee.Dtos;

public sealed class ProviderDirectoryQueryDto
{
    public int Page { get; set; }
    public int PageSize { get; set; } = 8;
    public string? Search { get; set; }
    public bool? IsActive { get; set; }
}
