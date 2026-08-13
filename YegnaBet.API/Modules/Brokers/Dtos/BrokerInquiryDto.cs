namespace YegnaBet.API.Modules.Brokers.Dtos
{
    public class BrokerInquiryDto
    {
        public long Id { get; set; }
        public string ListingTitle { get; set; } = null!;
        public string CustomerName { get; set; } = null!;
        public string CustomerPhone { get; set; } = null!;
        public string Status { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
    }
}