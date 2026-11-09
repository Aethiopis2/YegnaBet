using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using YegnaBet.API.Modules.Authentication;
using YegnaBet.API.Modules.Brokers.Dtos;
using YegnaBet.API.Modules.Brokers.Services;

namespace YegnaBet.API.Modules.Brokers.Controllers
{
    [Route("api/inquiries")]
    [ApiController]
    public class InquiriesController : ControllerBase
    {
        private readonly BrokerService _service;
        private readonly ICurrentUser _currentUser;

        public InquiriesController(BrokerService service, ICurrentUser currentUser)
        {
            _service = service;
            _currentUser = currentUser;
        }

        [Authorize(Roles = "Customer")]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateInquiryDto request, 
            CancellationToken cancellationToken = default)
        {
            try
            {
                long userId = _currentUser.Id;
                var inquiry = await _service.CreateAsync(request, userId, cancellationToken); 
                if (inquiry == null)
                {
                    return NotFound(new { message = "Listing not found or unavailable." });
                }

                return Ok(inquiry);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        //[HttpPost]
        //public async Task<IActionResult> Create(CreateInquiryDto dto)
        //{
        //    var id = await _service.CreateInquiryAsync(dto);
        //    return Ok(new { id });
        //}

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

        [HttpPost("{id:long}/complete")]
        public async Task<IActionResult> Complete(long id, CompleteDealDto dto)
        {
            var dealId = await _service.CompleteDealAsync(id, dto);

            if (dealId == null)
                return NotFound();

            return Ok(new { dealId });
        }

        [HttpGet("counts")]
        public async Task<IActionResult> Counts()
        {
            return Ok(await _service.GetCountsAsync());
        }
    }
}
