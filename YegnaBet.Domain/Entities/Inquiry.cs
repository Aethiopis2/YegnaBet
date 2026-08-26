using YegnaBet.Domain.Enums;

namespace YegnaBet.Domain.Entities
{
    public class Inquiry
    {
        public long Id { get; set; }
        public long ListingId { get; set; }
        public long EmployeeId { get; set; }
        public long? CustomerId { get; set; }
        public string? CustomerName { get; set; }
        public string? CustomerPhone { get; set; }
        public InquiryStatus InquiryStatus { get; set; } = InquiryStatus.New;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public Listing Listing { get; set; } = null!;
        public User Employee { get; set; } = null!;
        public User? Customer { get; set; }
    }
}