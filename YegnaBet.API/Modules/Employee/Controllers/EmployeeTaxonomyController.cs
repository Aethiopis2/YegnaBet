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
                var tree = await _service.GetTree(taxonomyId, cancellationToken);

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
                await _service.UpdateNode(nodeId, request, cancellationToken);
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
                var node = await _service.CreateNode(taxonomyId, request, cancellationToken);
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


        [HttpPut("nodes/{nodeId:long}/move")]
        public async Task<IActionResult> MoveNode(long nodeId, 
            [FromBody] MoveTaxonomyNodeRequest request, CancellationToken cancellationToken)
        {
            try
            {
                await _service.MoveNode(nodeId, request,
                    cancellationToken);

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
        } // end MoveNode


        [HttpGet("nodes/{nodeId:long}/attributes")]
        public async Task<IActionResult> GetAttributes(long nodeId,
            CancellationToken cancellationToken)
        {
            return Ok(await _service.GetAttributes(
                nodeId,
                cancellationToken));
        } // end GetAttributes


        [HttpPost("nodes/{nodeId:long}/attributes")]
        public async Task<IActionResult> CreateAttribute(long nodeId,
            CreateTaxonomyAttributeRequest request, CancellationToken cancellationToken)
        {
            try
            {
                var result = await _service.CreateAttribute(nodeId, request, cancellationToken);
                return Ok(result);
            } // end try
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            } // end catch 1
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            } // end catch 22
        } // end CreateAttribute


        [HttpPut("nodes/{nodeId:long}/attributes/{attributeId:long}")]
        public async Task<IActionResult> UpdateAttribute(long nodeId, long attributeId,
            UpdateTaxonomyAttributeRequest request, CancellationToken cancellationToken)
        {
            try
            {
                await _service.UpdateAttribute(
                    nodeId,
                    attributeId,
                    request,
                    cancellationToken);

                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        } // end UpdateAttribute


        [HttpDelete("nodes/{nodeId:long}/attributes/{attributeId:long}")]
        public async Task<IActionResult> DeleteAttribute(long nodeId, long attributeId,
            CancellationToken cancellationToken)
        {
            try
            {
                await _service.DeleteAttribute(
                    nodeId,
                    attributeId,
                    cancellationToken);

                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        } // end DeleteAttribute
    } // end class
} // end namespace