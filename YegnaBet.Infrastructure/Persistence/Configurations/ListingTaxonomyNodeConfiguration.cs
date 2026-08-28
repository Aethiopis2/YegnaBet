using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using YegnaBet.Domain.Entities;

namespace YegnaBet.Infrastructure.Persistence.Configurations
{
    public class ListingTaxonomyNodeConfiguration : IEntityTypeConfiguration<ListingTaxonomyNode>
    {
        public void Configure(EntityTypeBuilder<ListingTaxonomyNode> entity)
        {
            entity.HasKey(x => new
            {
                x.ListingId,
                x.TaxonomyNodeId
            });

            entity.HasOne(x => x.Listing)
                .WithMany(x => x.TaxonomyNodes)
                .HasForeignKey(x => x.ListingId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(x => x.TaxonomyNode)
                .WithMany(x => x.Listings)
                .HasForeignKey(x => x.TaxonomyNodeId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}