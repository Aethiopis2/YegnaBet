using YegnaBet.Domain.Enums;

namespace YegnaBet.Domain.Entities
{
    /// <summary>
    /// Who was intereseted
    /// </summary>
    public class Inquiry
    {
        public long Id { get; set; }

        public long ListingId { get; set; }
        public Listing Listing { get; set; } = null!;

        public string CustomerName { get; set; } = null!;
        public string CustomerPhone { get; set; } = null!;

        public InquiryStatus InquiryStatus { get; set; } = InquiryStatus.New;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}