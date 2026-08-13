namespace YegnaBet.API.Modules.Brokers.Dtos
{
    public class CreateInquiryDto
    {
        public long ListingId { get; set; }
        public string CustomerName { get; set; } = null!;
        public string CustomerPhone { get; set; } = null!;
    }
}
