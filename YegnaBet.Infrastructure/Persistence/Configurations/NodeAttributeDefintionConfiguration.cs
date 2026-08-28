using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using YegnaBet.Domain.Entities;

namespace YegnaBet.Infrastructure.Persistence.Configurations
{
    public class NodeAttributeDefintionConfiguration : IEntityTypeConfiguration<NodeAttributeDefinition>
    {
        public void Configure(EntityTypeBuilder<NodeAttributeDefinition> entity)
        {
            entity.HasKey(x => new
            {
                x.TaxonomyNodeId,
                x.AttributeDefinitionId
            });

            entity.HasOne(x => x.TaxonomyNode)
                .WithMany(x => x.Attributes)
                .HasForeignKey(x => x.TaxonomyNodeId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(x => x.AttributeDefinition)
                .WithMany(x => x.Nodes)
                .HasForeignKey(x => x.AttributeDefinitionId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}