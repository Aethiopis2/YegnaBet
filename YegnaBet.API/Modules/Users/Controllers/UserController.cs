using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using YegnaBet.API.Modules.Users.Services;

namespace YegnaBet.API.Modules.Users.Controllers
{
    [Route("api/user")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserService _service;

        public UserController(UserService service)
        {
            _service = service;
        } // end cntr

        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] int uid)
        {
            return Ok(await _service.Get(uid));
        } // end Get
    } // end UserController
} // end namespace