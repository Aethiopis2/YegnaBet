namespace YegnaBet.API.Modules.Brokers.Dtos
{
    public sealed class CreateInquiryDto
    {
        public long ListingId { get; set; }
        public Guid AssignmentId { get; set; }
    }
}
