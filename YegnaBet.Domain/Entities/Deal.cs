using YegnaBet.Domain.Enums;

namespace YegnaBet.Domain.Entities
{
    public class Deal
    {
        public long Id { get; set; }
        public long InquiryId { get; set; }
        public long ListingId { get; set; }
        public long EmployeeId { get; set; }
        public decimal DealValue { get; set; }
        public decimal CommissionRate { get; set; }
        public decimal CommissionAmount { get; set; }
        public DealStatus DealStatus { get; set; } = DealStatus.Pending;
        public DateTime? CompletedAt { get; set; }

        public Inquiry Inquiry { get; set; } = null!;
        public Listing Listing { get; set; } = null!;
        public User Employee { get; set; } = null!;
    }
}