using YegnaBet.Domain.Enums;

namespace YegnaBet.Domain.Entities
{
    /// <summary>
    /// What was agreed
    /// </summary>
    public class Deal
    {
        public long Id { get; set; }

        public long InquiryId { get; set; }
        public Inquiry Inquiry { get; set; } = null!;

        public long ListingId { get; set; }
        public Listing Listing { get; set; } = null!;

        public long BrokerId { get; set; }
        public User Broker { get; set; } = null!;

        public decimal DealValue { get; set; }

        public decimal CommissionRate { get; set; }
        public decimal CommissionAmount { get; set; }

        public DealStatus DealStatus { get; set; } = DealStatus.Pending;

        public DateTime? CompletedAt { get; set; }
    }
}