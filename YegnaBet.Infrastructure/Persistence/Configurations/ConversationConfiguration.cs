using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using YegnaBet.Domain.Entities;

namespace YegnaBet.Infrastructure.Persistence.Configurations;

public sealed class ConversationConfiguration : IEntityTypeConfiguration<Conversation>
{
    public void Configure(EntityTypeBuilder<Conversation> entity)
    {
        entity.HasKey(x => x.Id);
        entity.Property(x => x.Id).UseIdentityByDefaultColumn();

        entity.HasIndex(x => new { x.UserOneId, x.UserTwoId }).IsUnique();
        entity.HasIndex(x => x.UpdatedAt);

        entity.HasOne(x => x.UserOne)
            .WithMany()
            .HasForeignKey(x => x.UserOneId)
            .OnDelete(DeleteBehavior.Restrict);

        entity.HasOne(x => x.UserTwo)
            .WithMany()
            .HasForeignKey(x => x.UserTwoId)
            .OnDelete(DeleteBehavior.Restrict);

        entity.HasMany(x => x.Messages)
            .WithOne(x => x.Conversation)
            .HasForeignKey(x => x.ConversationId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}