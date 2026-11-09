using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using YegnaBet.Domain.Entities;

namespace YegnaBet.Infrastructure.Persistence.Configurations
{
    public class ListingViewsDatesConfiguration : IEntityTypeConfiguration<ListingViewsDates>
    {
        public void Configure(EntityTypeBuilder<ListingViewsDates> entity)
        {
            entity.HasKey(x => x.Id);

            entity.Property(x => x.Id)
                .UseIdentityByDefaultColumn();

            entity.HasOne(x => x.User)
                .WithMany()
                .HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(x => x.Listing)
                .WithMany()
                .HasForeignKey(x => x.ListingId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}