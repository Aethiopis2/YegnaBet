using YegnaBet.Domain.Entities;

namespace YegnaBet.API.Modules.Authentication;

public interface IJwtService
{
    string CreateAccessToken(User user);
    DateTime GetExpiration();
}