using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using YegnaBet.Infrastructure.Persistence;

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

        [HttpGet] public async Task<IActionResult> Get()
        {
            var data = await _db.Categories
                .OrderBy(x => x.SortOrder)
                .Select(x => new { x.Id, x.Name })
                .ToListAsync(); 
            
            return Ok(data);
        }
    }
}
