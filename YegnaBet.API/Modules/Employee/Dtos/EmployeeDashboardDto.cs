namespace YegnaBet.API.Modules.Employee.Dtos;

public class EmployeeDashboardDto
{
    public EmployeeDashboardStatsDto Stats { get; set; } = new();
    public List<DailyInquiryTrendDto> WeeklyActivities { get; set; } = [];
    public List<EmployeeInquiryDto> RecentRequests { get; set; } = [];
    public List<EmployeeInquiryDto> ActiveRequests { get; set; } = [];
}