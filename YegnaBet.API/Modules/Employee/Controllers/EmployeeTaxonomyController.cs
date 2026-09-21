using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using YegnaBet.API.Modules.Employee.Dtos;
using YegnaBet.API.Modules.Employee.Services;

namespace YegnaBet.API.Modules.Employee.Controllers
{
    [Route("api/employee/taxonomies")]
    [ApiController]
    public class EmployeeTaxonomyController : ControllerBase
    {
        private readonly IEmployeeTaxonomyService _service;

        public EmployeeTaxonomyController(IEmployeeTaxonomyService service)
        {
            _service = service;
        } // end cotr


        [HttpGet("{taxonomyId:long}/tree")]
        public async Task<ActionResult> GetTree(long taxonomyId, CancellationToken cancellationToken)
        {
            try
            {
                var tree = await _service.getTree(taxonomyId, cancellationToken);

                return Ok(tree);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new
                {
                    message = $"Taxonomy {taxonomyId} was not found."
                });
            }
        } // end GetTree


        [HttpPut("nodes/{nodeId:long}")]
        public async Task<IActionResult> UpdateNode(long nodeId, [FromBody] UpdateTaxonomyNodeRequest request,
            CancellationToken cancellationToken)
        {
            try
            {
                await _service.updateNode(nodeId, request, cancellationToken);
                return NoContent();
            } // end try
            catch (KeyNotFoundException ex)
            {
                return NotFound(new
                {
                    message = ex.Message
                });
            } // end catch 1
            catch (ArgumentException ex)
            {
                return BadRequest(new
                {
                    message = ex.Message
                });
            } // end catch 22
        } // end UpdateNode


        [HttpPost("{taxonomyId:long}/nodes")]
        public async Task<ActionResult<EmployeeTaxonomyNodeDto>> CreateNode(long taxonomyId,
            [FromBody] CreateTaxonomyNodeRequest request, CancellationToken cancellationToken)
        {
            try
            {
                var node = await _service.createNode(taxonomyId, request, cancellationToken);
                return Ok(node);
            } // end try
            catch (KeyNotFoundException ex)
            {
                return NotFound(new
                {
                    message = ex.Message
                });
            } // end catch 1
            catch (ArgumentException ex)
            {
                return BadRequest(new
                {
                    message = ex.Message
                });
            } // end catch 22
        } // end CreateNode

    } // end class
} // end namespace