using YegnaBet.API.Modules.Authentication.Dtos;

namespace YegnaBet.API.Modules.Authentication;

public interface IAuthService
{
    Task<LoginResponseDto?> Login(LoginRequestDto request,
        CancellationToken cancellationToken = default);
    Task<RefreshTokenResult?> Refresh(string refreshToken,
        CancellationToken cancellationToken);

    Task<AuthResponseDto> RegisterAsync(RegisterRequestDto request);
    Task<AuthUserDto> GetUser(long userId);
}