namespace YegnaBet.API.Modules.Employee.Dtos;

public sealed class ProviderDirectoryPageDto
{
    public List<ProviderAccountDto> Items { get; set; } = [];
    public int Page { get; set; }
    public int PageSize { get; set; }
    public bool HasMore { get; set; }
    public int TotalCount { get; set; }
}
