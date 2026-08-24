namespace YegnaBet.Domain.Entities
{
    public class Location
    {
        public long Id { get; set; }

        public string Country { get; set; } = "Ethiopia";
        public string City { get; set; } = null!;
        public string Area { get; set; } = null!;
        public string? SubArea { get; set; }

        // only visible to employees and admin
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
    }
}