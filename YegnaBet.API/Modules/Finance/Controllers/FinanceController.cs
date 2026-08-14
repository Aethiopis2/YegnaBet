using Microsoft.AspNetCore.Mvc;
using YegnaBet.API.Modules.Finance.Dtos;
using YegnaBet.API.Modules.Finance.Services;

namespace YegnaBet.API.Modules.Finance.Controllers
{
    [Route("api/finance")]
    [ApiController]
    public class FinanceController : ControllerBase
    {
        private readonly FinanceService _service;

        public FinanceController(FinanceService service)
        {
            _service = service;
        }

        [HttpGet("Dashboard")]
        public async Task<IActionResult> Dashboard()
        {
            return Ok(await _service.GetDashboardDtoAsync());
        }

        [HttpPost("expenses")]
        public async Task<IActionResult> AddExpense(CreateExpenseDto dto)
        {
            await _service.AddExpenseAsync(dto);
            return NoContent();
        }
    }
}
