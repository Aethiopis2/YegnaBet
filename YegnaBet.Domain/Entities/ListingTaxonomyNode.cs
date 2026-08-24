namespace YegnaBet.Domain.Entities
{
    public class ListingTaxonomyNode
    {
        public long ListingId { get; set; }

        public long TaxonomyNodeId { get; set; }

        public Listing Listing { get; set; } = null!;

        public TaxonomyNode TaxonomyNode { get; set; } = null!;
    }
}