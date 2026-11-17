using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using YegnaBet.API.Modules.Realtime;
using YegnaBet.API.Modules.Realtime.Dtos;
using YegnaBet.Domain.Entities;
using YegnaBet.Domain.Enums;
using YegnaBet.Infrastructure.Persistence;

namespace YegnaBet.API.Modules.Realtime.Services;

public sealed class MessagingService
{
    private readonly BrokerDbContext _db;
    private readonly IHubContext<BrokerHub> _hub;
    private readonly ILogger<MessagingService> _logger;

    public MessagingService(
        BrokerDbContext db,
        IHubContext<BrokerHub> hub,
        ILogger<MessagingService> logger)
    {
        _db = db;
        _hub = hub;
        _logger = logger;
    }

    public async Task<List<ConversationDto>> GetConversationsAsync(long userId, CancellationToken cancellationToken)
    {
        return await _db.Conversations
            .AsNoTracking()
            .Where(x => x.UserOneId == userId || x.UserTwoId == userId)
            .OrderByDescending(x => x.UpdatedAt)
            .Select(x => new ConversationDto
            {
                Id = x.Id,
                OtherUserId = x.UserOneId == userId ? x.UserTwoId : x.UserOneId,
                OtherUserName = x.UserOneId == userId ? x.UserTwo.FullName : x.UserOne.FullName,
                OtherUserRole = x.UserOneId == userId ? x.UserTwo.Role.ToString() : x.UserOne.Role.ToString(),
                OtherUserAvatar = x.UserOneId == userId ? x.UserTwo.Avatar : x.UserOne.Avatar,
                LastMessage = x.Messages.OrderByDescending(m => m.SentAt).Select(m => m.Content).FirstOrDefault(),
                LastMessageAt = x.Messages.OrderByDescending(m => m.SentAt).Select(m => (DateTime?)m.SentAt).FirstOrDefault(),
                UnreadCount = x.Messages.Count(m => m.SenderId != userId && m.ReadAt == null)
            })
            .ToListAsync(cancellationToken);
    }

    public async Task<List<MessageContactDto>> GetContactsAsync(long userId, string? search, CancellationToken cancellationToken)
    {
        var current = await _db.Users.AsNoTracking()
            .Where(x => x.Id == userId && x.IsActive)
            .Select(x => (UserRole?)x.Role)
            .SingleOrDefaultAsync(cancellationToken);

        if (current is null)
            return new List<MessageContactDto>();

        var allowedRoles = current.Value switch
        {
            UserRole.Customer => new[] { UserRole.Employee, UserRole.Owner },
            UserRole.Employee => new[] { UserRole.Customer, UserRole.Owner },
            UserRole.Owner => new[] { UserRole.Customer, UserRole.Employee },
            _ => Array.Empty<UserRole>()
        };

        var query = _db.Users.AsNoTracking()
            .Where(x => x.IsActive && x.Id != userId && allowedRoles.Contains(x.Role));

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim();
            query = query.Where(x => x.FullName.ToLower().Contains(term.ToLower()));
        }

        return await query
            .OrderBy(x => x.FullName)
            .Take(30)
            .Select(x => new MessageContactDto
            {
                Id = x.Id,
                FullName = x.FullName,
                Role = x.Role.ToString(),
                Avatar = x.Avatar
            })
            .ToListAsync(cancellationToken);
    }

    public async Task<ConversationDto?> StartConversationAsync(long userId, long recipientId, CancellationToken cancellationToken)
    {
        if (userId == recipientId)
            throw new ArgumentException("You cannot start a conversation with yourself.");

        var users = await _db.Users.AsNoTracking()
            .Where(x => x.Id == userId || x.Id == recipientId)
            .Select(x => new { x.Id, x.Role, x.IsActive })
            .ToListAsync(cancellationToken);

        var sender = users.SingleOrDefault(x => x.Id == userId);
        var recipient = users.SingleOrDefault(x => x.Id == recipientId);
        if (sender is null || !sender.IsActive || recipient is null || !recipient.IsActive)
            return null;

        var allowed = sender.Role switch
        {
            UserRole.Customer => recipient.Role is UserRole.Employee or UserRole.Owner,
            UserRole.Employee => recipient.Role is UserRole.Customer or UserRole.Owner,
            UserRole.Owner => recipient.Role is UserRole.Customer or UserRole.Employee,
            _ => false
        };
        if (!allowed)
            throw new UnauthorizedAccessException("You cannot message this user.");

        var userOneId = Math.Min(userId, recipientId);
        var userTwoId = Math.Max(userId, recipientId);

        var conversation = await _db.Conversations
            .FirstOrDefaultAsync(x => x.UserOneId == userOneId && x.UserTwoId == userTwoId, cancellationToken);

        if (conversation is null)
        {
            conversation = new Conversation
            {
                UserOneId = userOneId,
                UserTwoId = userTwoId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            _db.Conversations.Add(conversation);
            await _db.SaveChangesAsync(cancellationToken);
        }

        await NotifyConversationChangedAsync(userOneId, userTwoId, conversation.Id, cancellationToken);
        return await GetConversationAsync(conversation.Id, userId, cancellationToken);
    }

    public async Task<List<MessageDto>?> GetMessagesAsync(long userId, long conversationId, CancellationToken cancellationToken)
    {
        if (!await IsParticipantAsync(userId, conversationId, cancellationToken))
            return null;

        return await _db.Messages.AsNoTracking()
            .Where(x => x.ConversationId == conversationId)
            .OrderByDescending(x => x.SentAt)
            .Take(100)
            .OrderBy(x => x.SentAt)
            .Select(x => new MessageDto
            {
                Id = x.Id,
                ConversationId = x.ConversationId,
                SenderId = x.SenderId,
                SenderName = x.Sender.FullName,
                Content = x.Content,
                SentAt = x.SentAt,
                ReadAt = x.ReadAt,
                IsMine = x.SenderId == userId
            })
            .ToListAsync(cancellationToken);
    }

    public async Task<MessageDto?> SendMessageAsync(long userId, long conversationId, string content, CancellationToken cancellationToken)
    {
        content = content.Trim();
        if (string.IsNullOrWhiteSpace(content))
            throw new ArgumentException("Message cannot be empty.");
        if (content.Length > 4000)
            throw new ArgumentException("Messages cannot exceed 4,000 characters.");

        var conversation = await _db.Conversations
            .FirstOrDefaultAsync(x => x.Id == conversationId && (x.UserOneId == userId || x.UserTwoId == userId), cancellationToken);
        if (conversation is null)
            return null;

        var message = new Message
        {
            ConversationId = conversationId,
            SenderId = userId,
            Content = content,
            SentAt = DateTime.UtcNow
        };
        conversation.UpdatedAt = message.SentAt;
        _db.Messages.Add(message);
        await _db.SaveChangesAsync(cancellationToken);

        var senderName = await _db.Users.AsNoTracking()
            .Where(x => x.Id == userId)
            .Select(x => x.FullName)
            .SingleAsync(cancellationToken);

        var dto = new MessageDto
        {
            Id = message.Id,
            ConversationId = message.ConversationId,
            SenderId = message.SenderId,
            SenderName = senderName,
            Content = message.Content,
            SentAt = message.SentAt,
            IsMine = true
        };

        var recipientId = conversation.UserOneId == userId ? conversation.UserTwoId : conversation.UserOneId;
        var recipientDto = new MessageDto
        {
            Id = dto.Id,
            ConversationId = dto.ConversationId,
            SenderId = dto.SenderId,
            SenderName = dto.SenderName,
            Content = dto.Content,
            SentAt = dto.SentAt,
            IsMine = false
        };

        try
        {
            await _hub.Clients.Group(BrokerHub.UserGroup(recipientId))
                .SendAsync("MessageReceived", recipientDto, cancellationToken);
            await _hub.Clients.Group(BrokerHub.UserGroup(userId))
                .SendAsync("ConversationChanged", new { conversationId }, cancellationToken);
            await _hub.Clients.Group(BrokerHub.UserGroup(recipientId))
                .SendAsync("ConversationChanged", new { conversationId }, cancellationToken);
        }
        catch (OperationCanceledException) when (cancellationToken.IsCancellationRequested)
        {
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Message {MessageId} was saved, but realtime delivery failed.", message.Id);
        }

        return dto;
    }

    public async Task<bool> MarkReadAsync(long userId, long conversationId, CancellationToken cancellationToken)
    {
        var conversation = await _db.Conversations
            .FirstOrDefaultAsync(x => x.Id == conversationId && (x.UserOneId == userId || x.UserTwoId == userId), cancellationToken);
        if (conversation is null)
            return false;

        var unread = await _db.Messages
            .Where(x => x.ConversationId == conversationId && x.SenderId != userId && x.ReadAt == null)
            .ToListAsync(cancellationToken);

        if (unread.Count == 0)
            return true;

        var readAt = DateTime.UtcNow;
        foreach (var message in unread)
            message.ReadAt = readAt;

        await _db.SaveChangesAsync(cancellationToken);

        var otherUserId = conversation.UserOneId == userId ? conversation.UserTwoId : conversation.UserOneId;
        var payload = new { conversationId, readerId = userId, readAt };
        try
        {
            await _hub.Clients.Group(BrokerHub.UserGroup(userId)).SendAsync("MessagesRead", payload, cancellationToken);
            await _hub.Clients.Group(BrokerHub.UserGroup(otherUserId)).SendAsync("MessagesRead", payload, cancellationToken);
            await NotifyConversationChangedAsync(userId, otherUserId, conversationId, cancellationToken);
        }
        catch (OperationCanceledException) when (cancellationToken.IsCancellationRequested)
        {
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Read state for conversation {ConversationId} was saved, but realtime notification failed.", conversationId);
        }
        return true;
    }

    private async Task<bool> IsParticipantAsync(long userId, long conversationId, CancellationToken cancellationToken)
        => await _db.Conversations.AnyAsync(x => x.Id == conversationId && (x.UserOneId == userId || x.UserTwoId == userId), cancellationToken);

    private async Task<ConversationDto?> GetConversationAsync(long conversationId, long userId, CancellationToken cancellationToken)
        => await _db.Conversations.AsNoTracking()
            .Where(x => x.Id == conversationId && (x.UserOneId == userId || x.UserTwoId == userId))
            .Select(x => new ConversationDto
            {
                Id = x.Id,
                OtherUserId = x.UserOneId == userId ? x.UserTwoId : x.UserOneId,
                OtherUserName = x.UserOneId == userId ? x.UserTwo.FullName : x.UserOne.FullName,
                OtherUserRole = x.UserOneId == userId ? x.UserTwo.Role.ToString() : x.UserOne.Role.ToString(),
                OtherUserAvatar = x.UserOneId == userId ? x.UserTwo.Avatar : x.UserOne.Avatar,
                LastMessage = x.Messages.OrderByDescending(m => m.SentAt).Select(m => m.Content).FirstOrDefault(),
                LastMessageAt = x.Messages.OrderByDescending(m => m.SentAt).Select(m => (DateTime?)m.SentAt).FirstOrDefault(),
                UnreadCount = x.Messages.Count(m => m.SenderId != userId && m.ReadAt == null)
            })
            .SingleOrDefaultAsync(cancellationToken);

    private async Task NotifyConversationChangedAsync(long userOneId, long userTwoId, long conversationId, CancellationToken cancellationToken)
    {
        var payload = new { conversationId };
        try
        {
            await _hub.Clients.Group(BrokerHub.UserGroup(userOneId)).SendAsync("ConversationChanged", payload, cancellationToken);
            await _hub.Clients.Group(BrokerHub.UserGroup(userTwoId)).SendAsync("ConversationChanged", payload, cancellationToken);
        }
        catch (OperationCanceledException) when (cancellationToken.IsCancellationRequested)
        {
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Conversation {ConversationId} was saved, but realtime notification failed.", conversationId);
        }
    }
}
