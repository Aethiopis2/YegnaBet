namespace YegnaBet.API.Modules.Provider.Dtos
{
    public class ListingPhotoDraftDto
    {
        public long? Id { get; set; }
        public string? Url { get; set; }
        public IFormFile? File {  get; set; }
        public bool IsPrimary { get; set; }
    }
}