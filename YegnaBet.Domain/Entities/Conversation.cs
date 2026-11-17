namespace YegnaBet.Domain.Entities;

public sealed class Conversation
{
    public long Id { get; set; }
    public long UserOneId { get; set; }
    public long UserTwoId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public User UserOne { get; set; } = null!;
    public User UserTwo { get; set; } = null!;
    public ICollection<Message> Messages { get; set; } = new List<Message>();
}