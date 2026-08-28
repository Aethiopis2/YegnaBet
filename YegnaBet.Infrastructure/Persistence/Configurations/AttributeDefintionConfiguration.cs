using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using YegnaBet.Domain.Entities;

namespace YegnaBet.Infrastructure.Persistence.Configurations
{
    public class AttributeDefintionConfiguration : IEntityTypeConfiguration<AttributeDefinition>
    {
        public void Configure(EntityTypeBuilder<AttributeDefinition> entity)
        {
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Id)
                .UseIdentityByDefaultColumn();

            entity.Property(x => x.Name)
                .HasMaxLength(260)
                .IsRequired();

            entity.Property(x => x.Key)
                .HasMaxLength(150)
                .IsRequired();

            entity.HasIndex(x => x.Key)
                .IsUnique();

            entity.Property(x => x.DataType)
                .HasConversion<string>()
                .HasMaxLength(30);

            entity.Property(x => x.Options)
                .HasColumnType("jsonb");
        }
    }
}