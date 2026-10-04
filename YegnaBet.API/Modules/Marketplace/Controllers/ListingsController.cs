using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using YegnaBet.API.Modules.Authentication;
using YegnaBet.API.Modules.Marketplace.Dtos;
using YegnaBet.API.Modules.Marketplace.Services;
using YegnaBet.Domain.Enums;

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
        } // end service

        //[HttpGet]
        //public async Task<IActionResult> Get([FromQuery] int? categoryId)
        //{
        //    return Ok(await _service.GetListingsAsync(categoryId));
        //}

        [HttpGet]
        public async Task<ActionResult<ListingPageDto>> Get([FromQuery] ListingQueryDto request)
        {
            return Ok(await _service.getListings(request));
        } // end GetListings


        [HttpPost("save-listing")]
        public async Task<ActionResult<long>> InsertUpdateSavedListing([FromBody] AddUpdateSavedListingDto dto)
        {
            if (dto.UserId <= 0)
                return BadRequest($"Invalid UserId {dto.UserId}");

            return Ok(await _service.InsertUpdateSaved(dto));
        } // end InsertUpdateSavedListing


        [HttpGet("status-count")]
        public async Task<IActionResult> Get([FromQuery] int providerId)
        {
            return Ok(await _service.GetListingStatusCountAsync(providerId));
        }

        [HttpGet("provider-listings")]
        public async Task<IActionResult> GetProviderListings([FromQuery] int providerId)
        {
            return Ok(await _service.GetProviderListings(providerId));
        }

        [HttpGet("{id:long}")]
        public async Task<IActionResult> Get(long id)
        {
            var listing = await _service.GetListingAsync(id);
            
            if (listing == null)
                return NotFound();
            
            return Ok(listing);
        }

        [HttpGet("get-listing-locations")]
        public async Task<IActionResult> GetListingLocations([FromQuery] long? id)
        {
            return Ok(await _service.getLocations(id));
        } // end GetListingLocations
    }
}
