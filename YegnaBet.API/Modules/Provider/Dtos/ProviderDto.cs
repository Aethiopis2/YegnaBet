namespace YegnaBet.API.Modules.Provider.Dtos
{
    public class ProviderDto
    {
        public string Name { get; set; } = null!;
        public string Initials { get; set; } = null!;
        public bool Verified { get; set; }
        public string? BusinessName { get; set; }
        public double BusinessHealth { get; set; }
    }
}
