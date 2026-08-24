using System.Text.Json;
using YegnaBet.Domain.Enums;

namespace YegnaBet.Domain.Entities
{
    public class AttributeDefinition
    {
        public long Id { get; set; }

        public string Name { get; set; } = null!;

        public string Key { get; set; } = null!;

        public AttributeDataType DataType { get; set; }

        public string? Description { get; set; }

        public bool IsActive { get; set; } = true;

        public JsonDocument? Options { get; set; }

        public ICollection<NodeAttributeDefinition> Nodes { get; set; } = [];

        public ICollection<ListingAttributeValue> Values { get; set; } = [];
    }
}