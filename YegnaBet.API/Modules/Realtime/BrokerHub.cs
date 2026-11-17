using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace YegnaBet.API.Modules.Realtime;

public class BrokerHub : Hub
{
    public static string UserGroup(long userId) => $"user:{userId}";

    public override async Task OnConnectedAsync()
    {
        // Keep the existing hub available to its current anonymous listeners.
        // Only authenticated messaging roles are added to private user groups.
        var principal = Context.User;
        var role = principal?.FindFirstValue(ClaimTypes.Role);
        var userIdValue = principal?.FindFirstValue(ClaimTypes.NameIdentifier);

        if (principal?.Identity?.IsAuthenticated == true &&
            (role is "Customer" or "Owner" or "Employee") &&
            long.TryParse(userIdValue, out var userId))
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, UserGroup(userId));
        }

        await base.OnConnectedAsync();
    }
}
