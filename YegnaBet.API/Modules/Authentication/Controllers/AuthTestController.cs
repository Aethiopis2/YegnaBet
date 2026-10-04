using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using YegnaBet.API.Modules.Authentication;

namespace YegnaBet.API.Modules.Auth;

[ApiController]
[Route("api/test-auth")]
public sealed class TestAuthController : ControllerBase
{
    private readonly ICurrentUser _currentUser;

    public TestAuthController(ICurrentUser currentUser)
    {
        _currentUser = currentUser;
    }

    [Authorize]
    [HttpGet("me")]
    public IActionResult Me()
    {
        return Ok(new
        {
            authenticated = _currentUser.IsAuthenticated,
            id = _currentUser.Id,
            role = _currentUser.Role
        });
    }

    [Authorize(Roles = "Customer")]
    [HttpGet("customer")]
    public IActionResult Customer()
    {
        return Ok(new
        {
            message = "Customer authorization succeeded.",
            id = _currentUser.Id,
            role = _currentUser.Role
        });
    }

    [Authorize(Roles = "Provider")]
    [HttpGet("provider")]
    public IActionResult Provider()
    {
        return Ok(new
        {
            message = "Provider authorization succeeded.",
            id = _currentUser.Id,
            role = _currentUser.Role
        });
    }

    [Authorize(Roles = "Employee")]
    [HttpGet("employee")]
    public IActionResult Employee()
    {
        return Ok(new
        {
            message = "Employee authorization succeeded.",
            id = _currentUser.Id,
            role = _currentUser.Role
        });
    }

    [Authorize(Roles = "Owner")]
    [HttpGet("owner")]
    public IActionResult Owner()
    {
        return Ok(new
        {
            message = "Owner authorization succeeded.",
            id = _currentUser.Id,
            role = _currentUser.Role
        });
    }
}