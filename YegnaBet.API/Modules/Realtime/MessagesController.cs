using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using YegnaBet.API.Modules.Authentication;
using YegnaBet.API.Modules.Realtime.Dtos;
using YegnaBet.API.Modules.Realtime.Services;

namespace YegnaBet.API.Modules.Realtime.Controllers;

[ApiController]
[Authorize(Roles = "Customer,Owner,Employee")]
[Route("api/messages")]
public sealed class MessagesController(MessagingService service, ICurrentUser currentUser) : ControllerBase
{
    [HttpGet("conversations")]
    public async Task<IActionResult> GetConversations(CancellationToken cancellationToken)
        => Ok(await service.GetConversationsAsync(currentUser.Id, cancellationToken));

    [HttpGet("contacts")]
    public async Task<IActionResult> GetContacts([FromQuery] string? search, CancellationToken cancellationToken)
        => Ok(await service.GetContactsAsync(currentUser.Id, search, cancellationToken));

    [HttpPost("conversations")]
    public async Task<IActionResult> StartConversation([FromBody] StartConversationRequest request, CancellationToken cancellationToken)
    {
        try
        {
            var conversation = await service.StartConversationAsync(currentUser.Id, request.RecipientId, cancellationToken);
            return conversation is null ? NotFound(new { message = "User not found." }) : Ok(conversation);
        }
        catch (ArgumentException ex) { return BadRequest(new { message = ex.Message }); }
        catch (UnauthorizedAccessException) { return Forbid(); }
    }

    [HttpGet("conversations/{conversationId:long}/messages")]
    public async Task<IActionResult> GetMessages(long conversationId, CancellationToken cancellationToken)
    {
        var messages = await service.GetMessagesAsync(currentUser.Id, conversationId, cancellationToken);
        return messages is null ? NotFound() : Ok(messages);
    }

    [HttpPost("conversations/{conversationId:long}/messages")]
    public async Task<IActionResult> SendMessage(long conversationId, [FromBody] SendMessageRequest request, CancellationToken cancellationToken)
    {
        try
        {
            var message = await service.SendMessageAsync(currentUser.Id, conversationId, request.Content, cancellationToken);
            return message is null ? NotFound() : Ok(message);
        }
        catch (ArgumentException ex) { return BadRequest(new { message = ex.Message }); }
    }

    [HttpPost("conversations/{conversationId:long}/read")]
    public async Task<IActionResult> MarkRead(long conversationId, CancellationToken cancellationToken)
        => await service.MarkReadAsync(currentUser.Id, conversationId, cancellationToken) ? NoContent() : NotFound();
}
