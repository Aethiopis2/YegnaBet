namespace YegnaBet.API.Modules.Owner.Dtos;

public sealed class DashboardDealDto
{
    public int Total { get; set; }
    public int Successful { get; set; }
    public int Pending { get; set; }
    public int Failed { get; set; }
}