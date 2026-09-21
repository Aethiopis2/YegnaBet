using Microsoft.EntityFrameworkCore;
using YegnaBet.API.Modules.Employee.Dtos;
using YegnaBet.Domain.Entities;
using YegnaBet.Infrastructure.Persistence;

namespace YegnaBet.API.Modules.Employee.Services
{
    public sealed class EmployeeTaxonomyService : IEmployeeTaxonomyService
    {
        private readonly BrokerDbContext _db;

        public EmployeeTaxonomyService(BrokerDbContext db)
        {
            _db = db;
        } // end ctr


        public async Task<List<EmployeeTaxonomyNodeDto>> getTree(long taxonomyId,
            CancellationToken cancellationToken = default)
        {
            // First make sure the taxonomy itself exists and is active.
            var taxonomyExists = await _db.Taxonomy
                .AsNoTracking()
                .AnyAsync(
                    t => t.Id == taxonomyId && t.IsActive,
                    cancellationToken);

            if (!taxonomyExists)
                throw new KeyNotFoundException(
                    $"Taxonomy {taxonomyId} was not found.");

            // Load only the information required to construct the tree.
            var nodes = await _db.TaxonomyNode
                .AsNoTracking()
                .Where(x =>
                    x.TaxonomyId == taxonomyId &&
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
                    x.SortOrder,
                    x.IsActive,

                    ListingCount = x.Listings.Count()
                })
                .ToListAsync(cancellationToken);

            var lookup = nodes.ToDictionary(
            x => x.Id,
            x => new EmployeeTaxonomyNodeDto
            {
                Id = x.Id,
                Name = x.Name,
                Slug = x.Slug,
                Description = x.Description,
                Image = x.Image,
                ParentId = x.ParentId,
                SortOrder = x.SortOrder,
                IsActive = x.IsActive,
                ListingCount = x.ListingCount
            });

            var roots = new List<EmployeeTaxonomyNodeDto>();

            foreach (var node in nodes)
            {
                var dto = lookup[node.Id];

                if (node.ParentId is null)
                {
                    roots.Add(dto);
                    continue;
                }

                if (lookup.TryGetValue(node.ParentId.Value, out var parent))
                {
                    parent.Children.Add(dto);
                }
            }

            return roots;
        } // end GetTree


        public async Task updateNode(long nodeId, UpdateTaxonomyNodeRequest request,
            CancellationToken cancellationToken = default)
        {
            var node = await _db.TaxonomyNode
                .FirstOrDefaultAsync(
                    x => x.Id == nodeId,
                    cancellationToken);

            if (node is null)
                throw new KeyNotFoundException(
                    $"Taxonomy node {nodeId} was not found.");

            if (string.IsNullOrWhiteSpace(request.Name))
                throw new ArgumentException("Node name is required.");

            // A node cannot be its own parent.
            if (request.ParentId == node.Id)
                throw new ArgumentException(
                    "A node cannot be its own parent.");

            // If moving to another parent, make sure that parent
            // belongs to the same taxonomy.
            if (request.ParentId is not null)
            {
                var parent = await _db.TaxonomyNode
                    .FirstOrDefaultAsync(
                        x =>
                            x.Id == request.ParentId.Value &&
                            x.TaxonomyId == node.TaxonomyId &&
                            x.IsActive,
                        cancellationToken);

                if (parent is null)
                    throw new KeyNotFoundException(
                        "The specified parent category was not found.");
            }

            node.Name = request.Name.Trim();

            node.Slug = string.IsNullOrWhiteSpace(request.Slug)
                ? createSlug(request.Name)
                : request.Slug.Trim();

            node.Description = request.Description?.Trim();

            node.Image = request.Image;

            node.ParentId = request.ParentId;

            node.SortOrder = request.SortOrder;

            node.IsActive = request.IsActive;

            await _db.SaveChangesAsync(cancellationToken);
        } // end UpdateNode


        public async Task<EmployeeTaxonomyNodeDto> createNode(long taxonomyId, CreateTaxonomyNodeRequest request,
            CancellationToken cancellationToken = default)
        {
            var taxonomy = await _db.Taxonomy
                .AsNoTracking()
                .FirstOrDefaultAsync(
                    x => x.Id == taxonomyId && x.IsActive,
                    cancellationToken);

            if (taxonomy is null)
                throw new KeyNotFoundException(
                    $"Taxonomy {taxonomyId} was not found.");

            if (string.IsNullOrWhiteSpace(request.Name))
                throw new ArgumentException("Node name is required.");

            if (request.ParentId is not null)
            {
                var parentExists = await _db.TaxonomyNode
                    .AnyAsync(
                        x =>
                            x.Id == request.ParentId.Value &&
                            x.TaxonomyId == taxonomyId &&
                            x.IsActive,
                        cancellationToken);

                if (!parentExists)
                    throw new KeyNotFoundException(
                        "The specified parent category was not found.");
            }

            // Put the new node after the existing siblings.
            var nextSortOrder = await _db.TaxonomyNode
                .Where(x =>
                    x.TaxonomyId == taxonomyId &&
                    x.ParentId == request.ParentId &&
                    x.IsActive)
                .Select(x => (int?)x.SortOrder)
                .MaxAsync(cancellationToken) ?? 0;

            var node = new TaxonomyNode
            {
                TaxonomyId = taxonomyId,
                ParentId = request.ParentId,
                Name = request.Name.Trim(),
                Slug = string.IsNullOrWhiteSpace(request.Slug)
                    ? createSlug(request.Name)
                    : request.Slug.Trim(),
                Description = request.Description?.Trim(),
                Image = request.Image,
                SortOrder = nextSortOrder + 1,
                IsActive = true
            };

            await _db.TaxonomyNode.AddAsync(
                node,
                cancellationToken);

            await _db.SaveChangesAsync(cancellationToken);

            return new EmployeeTaxonomyNodeDto
            {
                Id = node.Id,
                Name = node.Name,
                Slug = node.Slug,
                Description = node.Description,
                Image = node.Image,
                ParentId = node.ParentId,
                SortOrder = node.SortOrder,
                IsActive = node.IsActive,
                ListingCount = 0,
                Children = []
            };
        } // end createNode


        private static string createSlug(string value)
        {
            return value.Trim()
                .ToLowerInvariant()
                .Replace(" ", "-");
        } // end createSlug
    } // end class
} // end namespae