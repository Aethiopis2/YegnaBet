using YegnaBet.Domain.Enums;

namespace YegnaBet.API.Modules.Employee.Dtos;

public sealed class EmployeeDealQueryDto
{
    public int Page { get; set; }
    public int PageSize { get; set; } = 8;
    public string? Search { get; set; }
    public DealStatus? Status { get; set; }
}
