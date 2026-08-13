using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using YegnaBet.API.Modules.Brokers.Dtos;
using YegnaBet.API.Modules.Brokers.Services;

namespace YegnaBet.API.Modules.Brokers.Controllers
{
    [Route("api/inquiries")]
    [ApiController]
    public class InquiriesController : ControllerBase
    {
        private readonly BrokerService _service;

        public InquiriesController(BrokerService service)
        {
            _service = service;
        }


        [HttpPost]
        public async Task<IActionResult> Create(CreateInquiryDto dto)
        {
            var id = await _service.CreateInquiryAsync(dto);
            return Ok(new { id });
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            return Ok(await _service.GetInquiresAsync());
        }

        [HttpPut("{id:long}/status")]
        public async Task<IActionResult> UpdateStatus(long id, UpdateInquiryStatusDto dto)
        {
            var ok = await _service.UpdateStatusAsync(id, dto.Status);
            if (!ok)
                return BadRequest();

            return NoContent();
        }
    }
}
