namespace YegnaBet.API.Modules.Provider.Dtos
{
    public class ProviderTaxonomyDto
    {
        public long Id { get; set; }
        public string Name { get; set; } = null!;
        public List<ProviderTaxonomyDto> Children { get; set; } = [];
    }
}