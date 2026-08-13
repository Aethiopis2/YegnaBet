using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using YegnaBet.API.Modules.Marketplace.Services;

namespace YegnaBet.API.Modules.Marketplace.Controllers
{
    [Route("api/listings")]
    [ApiController]
    public class ListingsController : ControllerBase
    {
        private readonly MarketplaceService _service;
        
        public ListingsController(MarketplaceService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] int? categoryId)
        {
            return Ok(await _service.GetListingsAsync(categoryId));
        }

        [HttpGet("{id:long}")]
        public async Task<IActionResult> Get(long id)
        {
            var listing = await _service.GetListingAsync(id);
            
            if (listing == null)
                return NotFound();
            
            return Ok(listing);
        }
    }
}
