namespace YegnaBet.API.Modules.Provider.Dtos
{
    public class ProviderRequestDto
    {
        public long Id { get; set; }
        public string Customer { get; set; } = null!;
        public string Request { get; set; } = null!;
        public string Location { get; set; } = null!;
        public string Budget { get; set; } = null!;
        public string Received { get; set; } = null!;
        public string Status { get; set; } = null!;
    }
}