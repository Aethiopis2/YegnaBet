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
        private readonly ICurrentUser _currentUser;

        public ListingsController(MarketplaceService service, ICurrentUser currentUser)
        {
            _service = service;
            _currentUser = currentUser;
        } // end service

        //[HttpGet]
        //public async Task<IActionResult> Get([FromQuery] int? categoryId)
        //{
        //    return Ok(await _service.GetListingsAsync(categoryId));
        //}

        [HttpGet]
        public async Task<ActionResult<ListingPageDto>> Get([FromQuery] ListingQueryDto request)
        {
            var isEmployee = User.IsInRole("Employee");
            var isOwner = User.IsInRole("Owner");
            if ((request.Status.HasValue || request.AllStatuses || request.MyListingsOnly || request.ProviderId.HasValue) && !isEmployee && !isOwner)
                return Forbid();

            long? managerId = isEmployee || isOwner ? _currentUser.Id : null;
            return Ok(await _service.getListings(request, managerId, isOwner));
        } // end GetListings


        [HttpPost("save-listing")]
        public async Task<ActionResult<long>> InsertUpdateSavedListing([FromBody] AddUpdateSavedListingDto dto)
        {
            if (dto.UserId <= 0)
                return BadRequest($"Invalid UserId {dto.UserId}");

            return Ok(await _service.InsertUpdateSaved(dto));
        } // end InsertUpdateSavedListing


        [HttpPost("update-listing-view-count")]
        public async Task<ActionResult<long>> UpdateListingViewCount([FromBody] SetViewsCountDto dto)
        {
            try
            {
                var res = await _service.UpdateListingViews(dto);
                return Ok(res);
            } // end try
            catch (BadHttpRequestException ex)
            {
                return BadRequest(ex.Message);
            } // end catch
        } // end UpdateListingViewCount


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
        public async Task<IActionResult> Get(long id, [FromQuery] long? userId)
        {
            var listing = await _service.GetListingAsync(id, userId);
            
            if (listing == null)
                return NotFound();
            
            return Ok(listing);
        }

        [Authorize(Roles = "Employee,Owner")]
        [HttpGet("{id:long}/manage")]
        public async Task<IActionResult> GetManagedListing(long id)
        {
            try
            {
                var listing = await _service.GetManagedListingAsync(
                    id, _currentUser.Id, User.IsInRole("Owner"));
                return listing is null ? NotFound() : Ok(listing);
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
        }

        [Authorize(Roles = "Employee,Owner")]
        [HttpPut("{id:long}/manage")]
        public async Task<IActionResult> UpdateManagedListing(long id,
            [FromBody] UpdateManagedListingDto request)
        {
            try
            {
                var listing = await _service.UpdateManagedListingAsync(
                    id, _currentUser.Id, User.IsInRole("Owner"), request);
                return listing is null ? NotFound() : Ok(listing);
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "Owner")]
        [HttpDelete("{id:long}/manage")]
        public async Task<IActionResult> RemoveManagedListing(long id)
        {
            return await _service.RemoveManagedListingAsync(id) ? NoContent() : NotFound();
        }

        [HttpGet("get-listing-locations")]
        public async Task<IActionResult> GetListingLocations([FromQuery] long? id)
        {
            return Ok(await _service.getLocations(id));
        } // end GetListingLocations
    }
}
