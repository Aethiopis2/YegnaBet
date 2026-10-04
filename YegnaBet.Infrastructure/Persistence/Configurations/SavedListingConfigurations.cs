using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using YegnaBet.Domain.Entities;

namespace YegnaBet.Infrastructure.Persistence.Configurations
{
    public class SavedListingConfiguration : IEntityTypeConfiguration<SavedListings>
    {
        public void Configure(EntityTypeBuilder<SavedListings> entity)
        {
            entity.HasKey(x => x.Id);

            entity.Property(x => x.Id)
                .UseIdentityByDefaultColumn();

            // Foreign key: Listing
            entity.HasOne(x => x.Listing)
                .WithMany()
                .HasForeignKey(x => x.ListingId)
                .OnDelete(DeleteBehavior.Cascade);

            // Foreign key: User
            entity.HasOne(x => x.User)
                .WithMany()
                .HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Prevent duplicate user-listing combinations
            entity.HasIndex(x => new { x.UserId, x.ListingId })
                .IsUnique();
        }
    }
}