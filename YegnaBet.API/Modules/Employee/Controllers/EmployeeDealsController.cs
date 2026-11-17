using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using YegnaBet.API.Modules.Authentication;
using YegnaBet.API.Modules.Employee.Dtos;
using YegnaBet.API.Modules.Employee.Services;

namespace YegnaBet.API.Modules.Employee.Controllers;

[ApiController]
[Authorize(Roles = "Employee")]
[Route("api/employee/deals")]
public sealed class EmployeeDealsController(
    EmployeeDealService deals,
    ICurrentUser currentUser) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<EmployeeDealPageDto>> GetPage(
        [FromQuery] EmployeeDealQueryDto request,
        CancellationToken cancellationToken)
        => Ok(await deals.GetPage(currentUser.Id, request, cancellationToken));

    [HttpPut("{dealId:long}")]
    public async Task<ActionResult<EmployeeDealDto>> Update(
        long dealId,
        [FromBody] UpdateEmployeeDealRequest request,
        CancellationToken cancellationToken)
    {
        try { return Ok(await deals.Update(currentUser.Id, dealId, request, cancellationToken)); }
        catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
        catch (ArgumentException ex) { return BadRequest(new { message = ex.Message }); }
        catch (InvalidOperationException ex) { return BadRequest(new { message = ex.Message }); }
    }

    [HttpDelete("{dealId:long}")]
    public async Task<IActionResult> Remove(long dealId, CancellationToken cancellationToken)
    {
        try
        {
            await deals.Remove(currentUser.Id, dealId, cancellationToken);
            return NoContent();
        }
        catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
        catch (InvalidOperationException ex) { return BadRequest(new { message = ex.Message }); }
    }
}
