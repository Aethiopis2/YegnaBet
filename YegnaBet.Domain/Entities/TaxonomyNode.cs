namespace YegnaBet.Domain.Entities
{
    public class TaxonomyNode
    {
        public long Id { get; set; }
        public long TaxonomyId { get; set; }
        public long? ParentId { get; set; }
        public string Name { get; set; } = null!;
        public string Slug { get; set; } = null!;
        public string? Description { get; set; }
        public int SortOrder { get; set; }
        public bool IsActive { get; set; } = true;
        public Taxonomy Taxonomy { get; set; } = null!;
        public string? Image { get; set; }
        public TaxonomyNode? Parent { get; set; }
        public ICollection<TaxonomyNode> Children { get; set; } = [];
        public ICollection<NodeAttributeDefinition> Attributes { get; set; } = [];
        public ICollection<ListingTaxonomyNode> Listings { get; set; } = [];
    }
}