using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using YegnaBet.Domain.Entities;

namespace YegnaBet.Infrastructure.Persistence.Configurations;

public sealed class MessageConfiguration : IEntityTypeConfiguration<Message>
{
    public void Configure(EntityTypeBuilder<Message> entity)
    {
        entity.HasKey(x => x.Id);
        entity.Property(x => x.Id).UseIdentityByDefaultColumn();
        entity.Property(x => x.Content).IsRequired().HasMaxLength(4000);
        entity.HasIndex(x => new { x.ConversationId, x.SentAt });
        entity.HasIndex(x => new { x.ConversationId, x.ReadAt, x.SenderId });

        entity.HasOne(x => x.Sender)
            .WithMany()
            .HasForeignKey(x => x.SenderId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}