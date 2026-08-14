namespace YegnaBet.API.Modules.Finance.Dtos
{
    public class FinanceDashboardDto
    {
        public decimal Revenue { get; set; }
        public decimal Expenses { get; set; }
        public decimal Profit { get; set; }
        public decimal Outstanding { get; set; }
        public int DealsCompleted { get; set; }
    }
}