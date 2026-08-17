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

        [HttpGet] 
        public async Task<IActionResult> Get()
        {
            var data = await _db.Categories
                .OrderBy(x => x.SortOrder)
                .Select(x => new {
                    id = x.Id, 
                    name = x.Name, 
                    image = x.Icon,
                    Count = _db.Listings.Count(l => l.CategoryId == x.Id)
                }).ToListAsync();
            
            return Ok(data);
        }
    }
}
