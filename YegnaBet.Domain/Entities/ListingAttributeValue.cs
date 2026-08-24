using System.Text.Json;

namespace YegnaBet.Domain.Entities
{
    public class ListingAttributeValue
    {
        public long ListingId { get; set; }

        public long AttributeDefinitionId { get; set; }

        public JsonDocument Value { get; set; } = null!;

        public Listing Listing { get; set; } = null!;

        public AttributeDefinition AttributeDefinition { get; set; } = null!;
    }
}