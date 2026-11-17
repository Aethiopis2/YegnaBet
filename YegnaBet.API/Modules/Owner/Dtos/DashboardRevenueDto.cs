namespace YegnaBet.API.Modules.Owner.Dtos;

public sealed class DashboardRevenueDto
{
    public decimal CommissionGenerated { get; set; }
    public decimal PreviousPeriodCommission { get; set; }
    public decimal GrowthPercentage { get; set; }
}