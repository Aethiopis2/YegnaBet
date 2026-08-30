using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using YegnaBet.Infrastructure.Persistence;
using YegnaBet.API.Modules.Marketplace.Dtos;

namespace YegnaBet.API.Modules.Marketplace.Controllers
{
    [Route("api/categories")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly BrokerDbContext _db;
        
        public CategoriesController(BrokerDbContext db)
        {
            _db = db;
        }

        [HttpGet] 
        public async Task<IActionResult> Get()
        {
            var data = await _db.TaxonomyNode
                .Include(x => x.Parent)
                .Where(x => x.ParentId != null &&
                            x.Parent!.ParentId != null)
                .OrderBy(x => x.Parent!.Id)
                .ThenBy(x => x.Name)
                .Select(x => new HomeCategoryDto {
                    Id = x.Slug,
                    Name = x.Name,
                    Description = x.Description,
                    Image = x.Image,
                    Type = x.Name,
                    Route = $"/categories/{x.Name}"
                }).ToListAsync();
            
            return Ok(data);
        }
    }
}
