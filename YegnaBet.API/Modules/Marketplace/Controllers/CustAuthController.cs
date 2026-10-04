using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using YegnaBet.API.Modules.Authentication;
using YegnaBet.API.Modules.Marketplace.Services;

namespace YegnaBet.API.Modules.Marketplace.Controllers
{
    [Route("api/customer")]
    [ApiController]
    public class CustAuthController(CustAuthService service, ICurrentUser currentUser) : ControllerBase
    {
        private readonly CustAuthService _service = service;
        private readonly ICurrentUser _currentUser = currentUser;


        [Authorize(Roles = "Customer")]
        [HttpGet("me")]
        public async Task<IActionResult> GetMe()
        {
            var userId = _currentUser.Id;
            try
            {
                return Ok(await _service.GetMe(userId));
            } // end try
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            } // end catch
        } // end GetMe
    } // end CustAuthController
} // end namespace