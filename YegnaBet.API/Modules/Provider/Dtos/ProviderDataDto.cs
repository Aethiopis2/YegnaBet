namespace YegnaBet.API.Modules.Provider.Dtos
{
    public class ProviderDataDto
    {
        public ProviderDto Provider { get; set; } = null!;
        public ProviderStatusDto Status { get; set; } = null!;
        public ProviderListingSummary Summary { get; set; } = null!;
        public List<ProviderListingDto> Listings { get; set; } = [];
        public List<ProviderRequestDto> Requests { get; set; } = [];
        public List<ProviderOpportunityDto> Opportunities { get; set; } = [];
    }
}