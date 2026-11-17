using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using YegnaBet.API.Modules.Employee.Dtos;
using YegnaBet.API.Modules.Employee.Services;

namespace YegnaBet.API.Modules.Employee.Controllers;

[ApiController]
[Authorize(Roles = "Employee,Owner")]
[Route("api/employee/providers")]
public sealed class ProviderDirectoryController(ProviderDirectoryService directory) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<ProviderDirectoryPageDto>> GetPage(
        [FromQuery] ProviderDirectoryQueryDto request,
        CancellationToken cancellationToken)
        => Ok(await directory.GetPage(request, cancellationToken));

    [HttpGet("{providerId:long}")]
    public async Task<ActionResult<ProviderAccountDto>> Get(
        long providerId,
        CancellationToken cancellationToken)
    {
        try { return Ok(await directory.Get(providerId, cancellationToken)); }
        catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
    }

    [HttpPost]
    [Authorize(Roles = "Employee")]
    public async Task<ActionResult<ProviderAccountDto>> Create(
        [FromBody] CreateProviderAccountRequest request,
        CancellationToken cancellationToken)
    {
        try
        {
            var provider = await directory.Create(request, cancellationToken);
            return CreatedAtAction(nameof(Get), new { providerId = provider.Id }, provider);
        }
        catch (ArgumentException ex) { return BadRequest(new { message = ex.Message }); }
    }

    [HttpPut("{providerId:long}")]
    [Authorize(Roles = "Employee")]
    public async Task<ActionResult<ProviderAccountDto>> Update(
        long providerId,
        [FromBody] UpdateProviderAccountRequest request,
        CancellationToken cancellationToken)
    {
        try { return Ok(await directory.Update(providerId, request, cancellationToken)); }
        catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
        catch (ArgumentException ex) { return BadRequest(new { message = ex.Message }); }
    }

    [HttpDelete("{providerId:long}")]
    [Authorize(Roles = "Employee")]
    public async Task<IActionResult> Remove(long providerId, CancellationToken cancellationToken)
    {
        try
        {
            await directory.Remove(providerId, cancellationToken);
            return NoContent();
        }
        catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
    }
}
