namespace YegnaBet.API.Modules.Realtime.Dtos;

public sealed class ConversationDto
{
    public long Id { get; set; }
    public long OtherUserId { get; set; }
    public string OtherUserName { get; set; } = "";
    public string OtherUserRole { get; set; } = "";
    public string? OtherUserAvatar { get; set; }
    public string? LastMessage { get; set; }
    public DateTime? LastMessageAt { get; set; }
    public int UnreadCount { get; set; }
}

public sealed class MessageDto
{
    public long Id { get; set; }
    public long ConversationId { get; set; }
    public long SenderId { get; set; }
    public string SenderName { get; set; } = "";
    public string Content { get; set; } = "";
    public DateTime SentAt { get; set; }
    public DateTime? ReadAt { get; set; }
    public bool IsMine { get; set; }
}

public sealed class MessageContactDto
{
    public long Id { get; set; }
    public string FullName { get; set; } = "";
    public string Role { get; set; } = "";
    public string? Avatar { get; set; }
}

public sealed class StartConversationRequest
{
    public long RecipientId { get; set; }
}

public sealed class SendMessageRequest
{
    public string Content { get; set; } = "";
}
