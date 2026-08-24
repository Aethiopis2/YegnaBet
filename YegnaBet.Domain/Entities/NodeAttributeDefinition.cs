namespace YegnaBet.Domain.Entities
{
    public class NodeAttributeDefinition
    {
        public long TaxonomyNodeId { get; set; }

        public long AttributeDefinitionId { get; set; }

        public bool IsRequired { get; set; }

        public int SortOrder { get; set; }

        public TaxonomyNode TaxonomyNode { get; set; } = null!;

        public AttributeDefinition AttributeDefinition { get; set; } = null!;
    }
}