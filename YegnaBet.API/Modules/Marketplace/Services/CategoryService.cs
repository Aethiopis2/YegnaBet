using Microsoft.EntityFrameworkCore;
using YegnaBet.API.Modules.Marketplace.Dtos;
using YegnaBet.Infrastructure.Persistence;

namespace YegnaBet.API.Modules.Marketplace.Services
{
    public class CategoryService
    {
        public readonly BrokerDbContext _db;

        public CategoryService(BrokerDbContext db)
        {
            _db = db;
        } // end constructor


        /// <summary>
        /// Reads and returns the tree of taxonomies or categories, that may exist 
        /// in the system.
        /// </summary>
        /// <param name="cancellationToken"></param>
        /// <returns>tree of TaxonomyNodes</returns>
        public async Task<List<TaxonomyNodeDto>> getTaxonomyTree(
    CancellationToken cancellationToken = default)
        {
            var nodes = await _db.TaxonomyNode
                .AsNoTracking()
                .Where(x =>
                    x.IsActive &&
                    x.Taxonomy.IsActive)
                .OrderBy(x => x.SortOrder)
                .Select(x => new
                {
                    x.Id,
                    x.ParentId,
                    x.Name,
                    x.Slug,
                    x.Description,
                    x.Image,
                    x.SortOrder
                })
                .ToListAsync(cancellationToken);

            var lookup = nodes.ToDictionary(
                x => x.Id,
                x => new TaxonomyNodeDto
                {
                    Id = x.Id,
                    Name = x.Name,
                    Slug = x.Slug,
                    Description = x.Description,
                    Image = x.Image
                });

            var roots = new List<TaxonomyNodeDto>();

            foreach (var node in nodes)
            {
                var dto = lookup[node.Id];

                if (node.ParentId is null)
                {
                    roots.Add(dto);
                }
                else if (lookup.TryGetValue(node.ParentId.Value, out var parent))
                {
                    parent.Children.Add(dto);
                }
            } // end foreach

            return roots;
        } // end getTaxonomyTree
    } // end CategoryService
} // end namespace