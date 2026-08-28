using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using YegnaBet.Domain.Entities;

namespace YegnaBet.Infrastructure.Persistence.Configurations
{
    public class TaxonomyNodeConfiguration : IEntityTypeConfiguration<TaxonomyNode>
    {
        public void Configure(EntityTypeBuilder<TaxonomyNode> entity)
        {
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Id)
                .UseIdentityByDefaultColumn();

            entity.Property(x => x.Name)
                .HasMaxLength(260)
                .IsRequired();

            entity.Property(x => x.Slug)
                .HasMaxLength(260)
                .IsRequired();

            entity.HasIndex(x => new
            {
                x.TaxonomyId,
                x.ParentId,
                x.Slug
            })
            .IsUnique();

            entity.HasOne(x => x.Taxonomy)
                .WithMany(x => x.Nodes)
                .HasForeignKey(x => x.TaxonomyId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(x => x.Parent)
                .WithMany(x => x.Children)
                .HasForeignKey(x => x.ParentId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}