using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using YegnaBet.Domain.Entities;

namespace YegnaBet.Infrastructure.Persistence.Configurations
{
    public class TaxonomyConfiguration : IEntityTypeConfiguration<Taxonomy>
    {
        public void Configure(EntityTypeBuilder<Taxonomy> entity)
        {
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Id)
                .UseIdentityByDefaultColumn();

            entity.Property(x => x.Name)
                .HasMaxLength(260)
                .IsRequired();

            entity.Property(x => x.Description)
                .HasMaxLength(4000);
        }
    }
}