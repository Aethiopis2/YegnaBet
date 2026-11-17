using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using YegnaBet.API.Modules.Authentication;
using YegnaBet.API.Modules.Users.Dtos;
using YegnaBet.API.Modules.Users.Services;

namespace YegnaBet.API.Modules.Users.Controllers;

[ApiController]
[Authorize]
[Route("api/user/profile")]
public sealed class UserProfileController(UserProfileService service, ICurrentUser currentUser, IAvatarStorage avatarStorage) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<UserProfileDto>> Get(CancellationToken cancellationToken)
    {
        try { return Ok(await service.Get(currentUser.Id, cancellationToken)); }
        catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
    }

    [HttpPut]
    public async Task<ActionResult<UserProfileDto>> Update([FromBody] UpdateUserProfileRequest request, CancellationToken cancellationToken)
    {
        try { return Ok(await service.Update(currentUser.Id, request, cancellationToken)); }
        catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
        catch (ArgumentException ex) { return BadRequest(new { message = ex.Message }); }
    }

    [HttpPost("avatar")]
    [RequestSizeLimit(5 * 1024 * 1024)]
    public async Task<IActionResult> UploadAvatar(IFormFile file, CancellationToken cancellationToken)
    {
        if (file is null) return BadRequest(new { message = "An image file is required." });
        try
        {
            var url = await avatarStorage.SaveAsync(file, cancellationToken);
            await service.UpdateAvatar(currentUser.Id, url, cancellationToken);
            return Ok(new { avatarUrl = url });
        }
        catch (InvalidOperationException ex) { return BadRequest(new { message = ex.Message }); }
        catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
    }

    [HttpDelete]
    public async Task<IActionResult> Delete(CancellationToken cancellationToken)
    {
        try { await service.Delete(currentUser.Id, cancellationToken); return NoContent(); }
        catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
    }
}
