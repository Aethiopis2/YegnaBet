namespace YegnaBet.API.Modules.Employee.Dtos;

public class EmployeeDashboardStatsDto
{
    public int NewRequests { get; set; }
    public int ActiveRequests { get; set; }
    public int CompletedRequests { get; set; }
    public int NeedsAttention { get; set; }
    public double RequestGrowth { get; set; }
}