using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using YegnaBet.API.Modules.Provider.Dtos;
using YegnaBet.API.Modules.Provider.Services;

namespace YegnaBet.API.Modules.Provider.Controllers
{
    [Route("api/provider")]
    [ApiController]
    public class ProviderController : ControllerBase
    {
        private readonly ProviderService _service;

        public ProviderController(ProviderService service)
        {
            _service = service;
        }

        [HttpGet("{id:long}")]
        public async Task<IActionResult> Get(long id)
        {
            return Ok(await _service.Get(id));
        }

        [HttpGet("get-taxonomyNodes")]
        public async Task<IActionResult> Get()
        {
            return Ok(await _service.GetProviderTaxonomyAsync());
        }

        [HttpGet("get-taxonomyNodeAtrributes")]
        public async Task<IActionResult> GetTaxonomyNodeAttributes([FromQuery] long nodeId)
        {
            return Ok(await _service.GetNodeAttributes(nodeId));
        }

        [HttpPost]
        public async Task<IActionResult> CreateListing([FromForm] ListingDraftDto draft)
        {
            foreach (var photo in draft.Photos)
            {
                if (photo.File is not null)
                {
                    var file = photo.File;

                    Console.WriteLine($"Name: {file.FileName}");
                    Console.WriteLine($"Size: {file.Length}");
                    Console.WriteLine($"Type: {file.ContentType}");
                }
            }

            return Ok();
        }
    }
}
