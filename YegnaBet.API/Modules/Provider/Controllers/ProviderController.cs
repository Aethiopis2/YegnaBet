using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using YegnaBet.API.Modules.Authentication;
using YegnaBet.API.Modules.Provider.Dtos;
using YegnaBet.API.Modules.Provider.Services;

namespace YegnaBet.API.Modules.Provider.Controllers
{
    [Route("api/provider")]
    [ApiController]
    public class ProviderController(ProviderService service, ICurrentUser currentUser) : ControllerBase
    {
        private readonly ProviderService _service = service;
        private readonly ICurrentUser _currentUser = currentUser;

        // ---------------------------------------------------------
        // Provider dashboard
        // ---------------------------------------------------------

        [Authorize(Roles = "Provider")]
        [HttpGet("me")]
        public async Task<IActionResult> GetMe()
        {
            var providerId = _currentUser.Id;
            return Ok(await _service.Get(providerId));
        } // end GetMe


        // ---------------------------------------------------------
        // Taxonomy
        // ---------------------------------------------------------

        [Authorize(Roles = "Provider")]
        [HttpGet("get-taxonomyNodes")]
        public async Task<IActionResult> GetTaxonomyNodes()
        {
            return Ok(
                await _service.GetProviderTaxonomyAsync()
            );
        }

        [Authorize(Roles = "Provider")]
        [HttpGet("get-taxonomyNodeAtrributes")]
        public async Task<IActionResult> GetTaxonomyNodeAttributes(
            [FromQuery] long nodeId)
        {
            return Ok(
                await _service.GetNodeAttributes(nodeId)
            );
        }

        // ---------------------------------------------------------
        // Create listing
        // ---------------------------------------------------------

        [Authorize(Roles = "Provider")]
        [HttpPost]
        public async Task<IActionResult> CreateListing([FromForm] ListingDraftDto draft)
        {
            var providerId = _currentUser.Id;

            var listingId = await _service.CreateListing(providerId, draft);
            return Ok(listingId);
        }
    }
}