using System.Text.Json.Nodes;

namespace YegnaBet.Domain.Entities
{
    public class ListingAttributeValue
    {
        public long ListingId { get; set; }
        public long AttributeDefinitionId { get; set; }
        public JsonValue Value { get; set; } = null!;
        public Listing Listing { get; set; } = null!;
        public AttributeDefinition AttributeDefinition { get; set; } = null!;
    }
}