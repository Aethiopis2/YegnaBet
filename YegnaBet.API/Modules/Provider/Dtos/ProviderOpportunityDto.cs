namespace YegnaBet.API.Modules.Provider.Dtos
{
    public class ProviderOpportunityDto
    {
        public long Id { get; set; }
        public string _Type { get; set; } = null!;
        public string Title { get; set; } = null!;
        public string? Description {  get; set; }
        public string _Action { get; set; } = null!;
    }
}