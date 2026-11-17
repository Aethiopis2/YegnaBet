namespace YegnaBet.API.Modules.Owner.Dtos;

public sealed class DashboardInquiryDto
{
    public int Total { get; set; }
    public int New { get; set; }
    public int Negotiating { get; set; }
    public int Completed { get; set; }
    public int Cancelled { get; set; }
}