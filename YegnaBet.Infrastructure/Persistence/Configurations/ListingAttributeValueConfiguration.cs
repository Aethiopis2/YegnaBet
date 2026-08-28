using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using YegnaBet.Domain.Entities;

namespace YegnaBet.Infrastructure.Persistence.Configurations
{
    public class ListingAttributeValueConfiguration : IEntityTypeConfiguration<ListingAttributeValue>
    {
        public void Configure(EntityTypeBuilder<ListingAttributeValue> entity)
        {
            entity.HasKey(x => new
            {
                x.ListingId,
                x.AttributeDefinitionId
            });

            entity.Property(x => x.Value)
                .HasColumnType("jsonb");

            entity.HasOne(x => x.Listing)
                .WithMany(x => x.AttributeValues)
                .HasForeignKey(x => x.ListingId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(x => x.AttributeDefinition)
                .WithMany(x => x.Values)
                .HasForeignKey(x => x.AttributeDefinitionId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}