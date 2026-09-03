namespace YegnaBet.API.Modules.Brokers.Dtos
{
    public sealed class InquiryDto
    {
        public long Id { get; set; }
        public long ListingId { get; set; }
        public long EmployeeId { get; set; }
        public long? CustomerId { get; set; }
        public string? CustomerName { get; set; }
        public string? CustomerPhone { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}