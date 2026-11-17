using Microsoft.EntityFrameworkCore;
using YegnaBet.API.Modules.Employee.Dtos;
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


        public async Task<List<EmployeeTaxonomyAttributeDto>> GetTaxonomyNodeAttributes(long nodeId,
            CancellationToken cancellationToken = default)
        {
            var nodes = await _db.TaxonomyNode
                .AsNoTracking()
                .Where(x => x.IsActive && x.Taxonomy.IsActive)
                .Select(x => new { x.Id, x.ParentId })
                .ToListAsync(cancellationToken);

            var nodeIds = new HashSet<long> { nodeId };
            var pending = new Stack<long>();
            pending.Push(nodeId);
            while (pending.Count > 0)
            {
                var current = pending.Pop();
                foreach (var child in nodes.Where(x => x.ParentId == current))
                {
                    if (nodeIds.Add(child.Id)) pending.Push(child.Id);
                }
            }

            var attrs = await _db.AttributeDefinition
                .AsNoTracking()
                .Where(x => x.IsActive && x.IsFilterable &&
                    x.Nodes.Any(y => nodeIds.Contains(y.TaxonomyNodeId)))
                .ToListAsync(cancellationToken);

            return [.. attrs
                .OrderBy(x => x.SortOrder)
                .Select(x => new EmployeeTaxonomyAttributeDto
                {
                    Id = x.Id,
                    Name = x.Name,
                    Key = x.Key,
                    Type = x.DataType.ToString().ToLower(),

                    Required = x.IsRequired,
                    Searchable = x.IsSearchable,
                    Filterable = x.IsFilterable,

                    MinValue = x.MinValue,
                    MaxValue = x.MaxValue,

                    Options = x.Options == null
                        ? new List<string>()
                        : x.Options.RootElement
                            .EnumerateArray()
                            .Select(v => v.GetString() ?? v.ToString())
                            .ToList()
                })];
        } // end GetAttributes
    } // end CategoryService
} // end namespace
