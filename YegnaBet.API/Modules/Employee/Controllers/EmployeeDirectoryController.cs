using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using YegnaBet.API.Modules.Authentication;
using YegnaBet.API.Modules.Employee.Dtos;
using YegnaBet.API.Modules.Employee.Services;

namespace YegnaBet.API.Modules.Employee.Controllers;

[ApiController]
[Authorize(Roles = "Employee")]
[Route("api/employee/directory")]
public sealed class EmployeeDirectoryController(
    EmployeeDirectoryService directory,
    ICurrentUser currentUser) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<EmployeeAccountDto>>> GetAll(CancellationToken cancellationToken)
    {
        return Ok(await directory.GetAll(cancellationToken));
    }

    [HttpGet("{employeeId:long}")]
    public async Task<ActionResult<EmployeeAccountDto>> Get(
        long employeeId,
        CancellationToken cancellationToken)
    {
        try
        {
            return Ok(await directory.Get(employeeId, cancellationToken));
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpPost]
    public async Task<ActionResult<EmployeeAccountDto>> Create(
        CreateEmployeeAccountRequest request,
        CancellationToken cancellationToken)
    {
        try
        {
            var employee = await directory.Create(request, cancellationToken);
            return CreatedAtAction(nameof(Get), new { employeeId = employee.Id }, employee);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{employeeId:long}")]
    public async Task<ActionResult<EmployeeAccountDto>> Update(
        long employeeId,
        UpdateEmployeeAccountRequest request,
        CancellationToken cancellationToken)
    {
        try
        {
            if (employeeId == currentUser.Id && !request.IsActive)
                return BadRequest(new { message = "You cannot deactivate your own employee account." });

            return Ok(await directory.Update(employeeId, request, cancellationToken));
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpDelete("{employeeId:long}")]
    public async Task<IActionResult> Remove(long employeeId, CancellationToken cancellationToken)
    {
        try
        {
            await directory.Remove(employeeId, currentUser.Id, cancellationToken);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
