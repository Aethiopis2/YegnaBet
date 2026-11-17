namespace YegnaBet.API.Modules.Owner.Dtos;

public sealed class OwnerDashboardSummaryDto
{
    public string Period { get; set; } = "30d";
    public DateTime From { get; set; }
    public DateTime To { get; set; }

    public DashboardOverviewDto Overview { get; set; } = new();
    public DashboardInquiryDto Inquiries { get; set; } = new();
    public DashboardDealDto Deals { get; set; } = new();
    public DashboardRevenueDto Revenue { get; set; } = new();
    public DashboardListingDto Listings { get; set; } = new();

    public List<DashboardCategoryDto> Categories { get; set; } = [];
}