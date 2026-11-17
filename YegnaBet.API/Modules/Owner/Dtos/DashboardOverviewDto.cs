namespace YegnaBet.API.Modules.Owner.Dtos;

public sealed class DashboardOverviewDto
{
    public int TotalListings { get; set; }
    public int ActiveListings { get; set; }
    public int PendingListings { get; set; }
    public int DraftListings { get; set; }

    public int TotalCustomers { get; set; }
    public int TotalProviders { get; set; }

    public int ClosedListings { get; set; }
    public int CancelledListings { get; set; }
    public int TotalEmployees { get; set; }
}