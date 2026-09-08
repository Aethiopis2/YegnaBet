namespace YegnaBet.API.Modules.Provider.Dtos
{
    public class ProviderListingSummary
    {
        public int Active { get; set; }
        public int Drafts { get; set; }
        public int Pending { get; set; }
        public int Paused { get; set; }
    }
}