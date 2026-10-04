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

    public AuthController(IAuthService authService)
    {
        _authService = authService;
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
                message =
                    "Phone number and password are required."
            });
        }

        var result = await _authService.Login(request, cancellationToken);
        if (result == null)
        {
            return Unauthorized(new
            {
                message =
                    "Invalid phone number or password."
            });
        } // end if

        return Ok(result);
    } // end Login
} // end AuthController