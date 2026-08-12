namespace YegnaBet.Domain.Entities
{
    /// <summary>
    /// Where an entity is located
    /// </summary>
    public class Location
    {
        public long Id { get; set; }

        public string City { get; set; } = null!;
        public string Area { get; set; } = null!;
        public string? SubArea { get; set; }
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
    }
}