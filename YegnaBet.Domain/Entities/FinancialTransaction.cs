namespace YegnaBet.Domain.Entities
{
    /// <summary>
    /// What money moved
    /// </summary>
    public class FinancialTransaction
    {
        public long Id { get; set; }

        public long? DealId { get; set; }
        public Deal? Deal { get; set; }

        public string TransactionType { get; set; } = null!;

        public decimal Amount { get; set; }

        public string Currency { get; set; } = "ETB";
        
        public string? ReferenceNumber { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}