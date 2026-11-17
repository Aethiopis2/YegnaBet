using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace YegnaBet.API.Modules.Authentication.Controllers;

[ApiController]
[AllowAnonymous]
[Route("api/auth/password")]
public sealed class PasswordResetController(PasswordResetService service) : ControllerBase
{
    public sealed record RequestResetDto(string Email);
    public sealed record ResetPasswordDto(string Email, string Token, string NewPassword);

    [HttpPost("forgot")]
    public async Task<IActionResult> Forgot([FromBody] RequestResetDto request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.Email)) return BadRequest(new { message = "Email is required." });
        if (!service.IsConfigured) return StatusCode(StatusCodes.Status503ServiceUnavailable,
            new { message = "Password reset email is not configured on this server." });
        await service.RequestReset(request.Email, cancellationToken);
        return Ok(new { message = "If an active account uses that email, password reset instructions have been sent." });
    }

    [HttpPost("reset")]
    public async Task<IActionResult> Reset([FromBody] ResetPasswordDto request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Token))
            return BadRequest(new { message = "Reset link is invalid or expired." });
        if (string.IsNullOrWhiteSpace(request.NewPassword) || request.NewPassword.Length < 8)
            return BadRequest(new { message = "Password must be at least 8 characters." });
        if (!await service.ResetPassword(request.Email, request.Token, request.NewPassword, cancellationToken))
            return BadRequest(new { message = "This reset link is invalid or expired." });
        return NoContent();
    }
}
