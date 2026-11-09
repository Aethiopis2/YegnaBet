using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using YegnaBet.API.Modules.Authentication;
using YegnaBet.API.Modules.Authentication.Dtos;

namespace YegnaBet.API.Modules.Auth;

[ApiController]
[Route("api/auth")]
public sealed class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private const string RefreshTokenCookie = "yegnabet_refresh";
    private readonly ICurrentUser _currentUser;

    public AuthController(IAuthService authService, ICurrentUser currentUser)
    {
        _authService = authService;
        _currentUser = currentUser;
    } // end constructor


    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<ActionResult<LoginResponseDto>> Login(LoginRequestDto request, 
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.PhoneNumber) ||
            string.IsNullOrWhiteSpace(request.Password))
        {
            return BadRequest(new
            {
                message = "Phone number and password are required."
            });
        }

        var result = await _authService.Login(request, cancellationToken);
        if (result == null)
        {
            return Unauthorized(new
            {
                message = "Invalid phone number or password."
            });
        } // end if

        return Ok(result);
    } // end Login


    [AllowAnonymous]
    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh(
        CancellationToken cancellationToken)
    {
        if (!Request.Cookies.TryGetValue(
                RefreshTokenCookie,
                out var refreshToken) ||
            string.IsNullOrWhiteSpace(refreshToken))
        {
            return Unauthorized();
        }

        var result = await _authService.Refresh(
            refreshToken,
            cancellationToken);

        if (result == null)
        {
            DeleteRefreshTokenCookie();

            return Unauthorized();
        }

        SetRefreshTokenCookie(
            result.RefreshToken,
            result.RefreshTokenExpiresAt);

        return Ok(new
        {
            accessToken = result.AccessToken,
            expiresAt = result.ExpiresAt,
            user = result.User
        });
    } // end Refersh


    [Authorize]
    [HttpPost("logout")]
    public IActionResult Logout()
    {
        DeleteRefreshTokenCookie();

        return NoContent();
    } // end Logout


    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> GetMe()
    {
        try
        {
            var resp = await _authService.GetUser(_currentUser.Id);
            return Ok(resp);
        } // end try
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        } // end catch
    } // end GetMe


    private void SetRefreshTokenCookie(
        string refreshToken,
        DateTime expiresAt)
    {
        Response.Cookies.Append(
            RefreshTokenCookie,
            refreshToken,
            new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = new DateTimeOffset(expiresAt),
                Path = "/api/auth"
            });
    } // end SetRefershToken

    private void DeleteRefreshTokenCookie()
    {
        Response.Cookies.Delete(
            RefreshTokenCookie,
            new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Path = "/api/auth"
            });
    } // end Logout
} // end AuthController