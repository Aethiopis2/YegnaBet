namespace YegnaBet.API.Modules.Brokers.Dtos
{
    public class CompleteDealDto
    {
        public decimal DealValue { get; set; } 
        public decimal CommissionRate { get; set; } = 5;
    }
}