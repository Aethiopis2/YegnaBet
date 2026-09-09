namespace YegnaBet.API.Modules.Provider.Dtos
{
    public class ProviderTaxonomyNodeAttributeDto
    {
        public long Id { get; set; }
        public string Key { get; set; } = null!;
        public string Label { get; set; } = null!;
        public string Type { get; set; } = null!;
    }
}