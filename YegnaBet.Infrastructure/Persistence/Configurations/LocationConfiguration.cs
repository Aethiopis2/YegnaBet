using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using YegnaBet.Domain.Entities;

namespace YegnaBet.Infrastructure.Persistence.Configurations
{
    public class LocationConfiguration : IEntityTypeConfiguration<Location>
    {
        public void Configure(EntityTypeBuilder<Location> entity)
        {
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Id)
                .UseIdentityByDefaultColumn();

            entity.Property(x => x.Country)
                .IsRequired()
                .HasMaxLength(128);

            entity.Property(x => x.City)
                .IsRequired()
                .HasMaxLength(128);

            entity.Property(x => x.Area)
                .IsRequired()
                .HasMaxLength(256);

            entity.Property(x => x.SubArea)
                .HasMaxLength(256);
        }
    }
}