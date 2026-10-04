using YegnaBet.API.Modules.Authentication.Dtos;

namespace YegnaBet.API.Modules.Authentication;

public interface IAuthService
{
    Task<LoginResponseDto?> Login(LoginRequestDto request,
        CancellationToken cancellationToken = default);
}