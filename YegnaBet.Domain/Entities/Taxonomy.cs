namespace YegnaBet.Domain.Entities
{
    public class Taxonomy
    {
        public long Id { get; set; }

        public string Name { get; set; } = null!;
        public string? Description { get; set; }

        public bool IsActive { get; set; } = true;

        public ICollection<TaxonomyNode> Nodes { get; set; } = [];
    }
}
