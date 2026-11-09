using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using YegnaBet.API.Modules.Authentication;
using YegnaBet.API.Modules.Employee.Dtos;
using YegnaBet.API.Modules.Employee.Services;
using YegnaBet.API.Modules.Provider.Dtos;
using YegnaBet.Domain.Enums;

namespace YegnaBet.API.Modules.Employee.Controllers
{
    [Route("api/employee")]
    [ApiController]
    public class EmployeeController : Controller
    {
        private readonly EmployeeService _service;
        private readonly ICurrentUser _currentUser;

        public EmployeeController(EmployeeService service, ICurrentUser currentUser)
        {
            _service = service;
            _currentUser = currentUser;
        } // end EmployeeController


        [Authorize(Roles = "Employee")]
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var empId = _currentUser.Id;
            var dash = await _service.GetDashboardStats(empId);
            return Ok(dash);
        } // end Get


        [Authorize(Roles = "Employee")]
        [HttpPost]
        public async Task<IActionResult> Create([FromForm] ListingDraftDto draft)
        {
            var res = await _service.CreateListing(_currentUser.Id, draft);
            return Ok(res);
        } // end Create


        [Authorize(Roles = "Employee")]
        [HttpGet("requests")]
        public async Task<IActionResult> GetEmployeeRequest()
        {
            var empId = _currentUser.Id;
            var req = await _service.GetEmployeeRequest(empId);

            return Ok(req);
        } // end GetEmployeeRequest


        [Authorize(Roles = "Employee")]
        [HttpPut("updateRequest")]
        public async Task<IActionResult> UpdateEmployeeRequest([FromBody] UpdateInquiryDto dto)
        {
            try
            {
                var req = await _service.UpdateInquiryState(dto.InquiryId, dto.Status);
                return Ok(req);
            } 
            catch (Exception ex) 
            {
                return BadRequest(ex.Message);
            } // end catch
        } // end GetEmployeeRequest


        [Authorize(Roles = "Employee")]
        [HttpGet("getTaxonomyNodesShort")]
        public async Task<IActionResult> GetTaxonomyNodes()
        {
            return Ok(
                await _service.GetTaxonomyShortAsync()
            );
        } // end getTaxonomyNodesShort
    }
}
