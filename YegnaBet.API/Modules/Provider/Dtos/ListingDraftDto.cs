namespace YegnaBet.API.Modules.Provider.Dtos
{
    public class ListingDraftDto
    {
        public long? Id { get; set; }
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public string PriceUnit { get; set; } = null!;
        public string Method { get; set; } = null!;
        public long TaxonomyId { get; set; }
        public long? LocationId { get; set; }
        public long ProviderId { get; set; }
        public string City { get; set; } = null!;
        public string Area { get; set; } = null!;
        public string? SubArea { get; set; }
        public Dictionary<string, string> Attributes { get; set; } = [];
        public List<ListingPhotoDraftDto> Photos { get; set; } = [];
        public List<ListingVideoDraftDto> Videos { get; set; } = [];
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
        public bool PreciseLocation { get; set; } = false;
     }
}