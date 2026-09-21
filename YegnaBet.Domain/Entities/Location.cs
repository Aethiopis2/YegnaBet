namespace YegnaBet.Domain.Entities
{
    public class Location
    {
        public long Id { get; set; }
        public string Country { get; set; } = "ethiopia";
        public string City { get; set; } = null!;
        public string Area { get; set; } = null!;
        public string? SubArea { get; set; }
    }
}