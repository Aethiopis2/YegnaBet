using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using YegnaBet.API.Modules.Marketplace.Services;

namespace YegnaBet.API.Modules.Marketplace.Controllers
{
    [Route("api/categories")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly CategoryService _service;
        
        public CategoriesController(CategoryService service)
        {
            _service = service;
        }

        [HttpGet] 
        public async Task<IActionResult> Get()
        {
            return Ok(await _service.getTaxonomyTree());
        } // end get /category


        [AllowAnonymous]
        [HttpGet("attributes/{nodeId:long}")]
        public async Task<IActionResult> GetTaxonomyNodeAttributes(long nodeId,
            CancellationToken cancellationToken)
        {
            return Ok(await _service.GetTaxonomyNodeAttributes(nodeId, cancellationToken));
        } // end GetTaxonomyNodeAttributes
    } // end CategoriesController
} // end namespace