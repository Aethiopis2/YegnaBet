using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using YegnaBet.Domain.Entities;

namespace YegnaBet.Infrastructure.Persistence.Configurations
{
    public class UserConfigurationEx : IEntityTypeConfiguration<UserEx>
    {
        public void Configure(EntityTypeBuilder<UserEx> entity)
        {
            entity.HasKey(x => x.UserId);

            entity.HasOne(x => x.User)
                .WithOne()
                .HasForeignKey<UserEx>(x => x.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(x => x.Location)
                .WithMany()
                .HasForeignKey(x => x.LocationId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}