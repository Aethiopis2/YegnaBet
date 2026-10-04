using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using YegnaBet.API.Modules.Employee.Dtos;
using YegnaBet.Domain.Entities;
using YegnaBet.Domain.Enums;
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


        public async Task<List<EmployeeTaxonomyNodeDto>> GetTree(long taxonomyId,
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


        public async Task UpdateNode(long nodeId, UpdateTaxonomyNodeRequest request,
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
                ? CreateSlug(request.Name)
                : request.Slug.Trim();

            node.Description = request.Description?.Trim();

            node.Image = request.Image;

            node.ParentId = request.ParentId;

            node.SortOrder = request.SortOrder;

            node.IsActive = request.IsActive;

            await _db.SaveChangesAsync(cancellationToken);
        } // end UpdateNode


        public async Task<EmployeeTaxonomyNodeDto> CreateNode(long taxonomyId, CreateTaxonomyNodeRequest request,
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
                    ? CreateSlug(request.Name)
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
        } // end CreateNode


        public async Task MoveNode(long nodeId, MoveTaxonomyNodeRequest request,
            CancellationToken cancellationToken = default)
        {
            await using var transaction =
                await _db.Database.BeginTransactionAsync(
                    cancellationToken);

            var node = await _db.TaxonomyNode
                .FirstOrDefaultAsync(
                    x => x.Id == nodeId &&
                         x.IsActive,
                    cancellationToken);

            if (node is null)
                throw new KeyNotFoundException(
                    $"Taxonomy node {nodeId} was not found.");

            // A node cannot be its own parent.
            if (request.TargetParentId == node.Id)
                throw new ArgumentException(
                    "A node cannot be moved under itself.");

            // Find the target parent, if there is one.
            TaxonomyNode? targetParent = null;

            if (request.TargetParentId is not null)
            {
                targetParent = await _db.TaxonomyNode
                    .FirstOrDefaultAsync(
                        x =>
                            x.Id == request.TargetParentId.Value &&
                            x.IsActive,
                        cancellationToken);

                if (targetParent is null)
                    throw new KeyNotFoundException(
                        "The target category was not found.");

                // Cross-taxonomy moves are not allowed.
                if (targetParent.TaxonomyId != node.TaxonomyId)
                    throw new ArgumentException(
                        "A category cannot be moved to another taxonomy.");

                // Prevent:
                //
                // A
                // └── B
                //     └── C
                //
                // moving A under C.
                if (await IsDescendant(node.Id, targetParent.Id,
                        cancellationToken))
                {
                    throw new ArgumentException(
                        "A category cannot be moved under one of its descendants.");
                }
            }

            var oldParentId = node.ParentId;

            // Nothing actually changed.
            if (oldParentId == request.TargetParentId)
            {
                await transaction.CommitAsync(cancellationToken);
                return;
            }

            node.ParentId = request.TargetParentId;

            // Put it at the end of the new sibling group.
            var maxSortOrder = await _db.TaxonomyNode
                .Where(x =>
                    x.TaxonomyId == node.TaxonomyId &&
                    x.ParentId == request.TargetParentId &&
                    x.IsActive &&
                    x.Id != node.Id)
                .Select(x => (int?)x.SortOrder)
                .MaxAsync(cancellationToken) ?? 0;

            node.SortOrder = maxSortOrder + 1;

            await _db.SaveChangesAsync(cancellationToken);

            // Repair ordering in the old sibling group.
            await NormalizeSiblingOrder(
                node.TaxonomyId,
                oldParentId,
                cancellationToken);

            // Repair ordering in the new sibling group.
            await NormalizeSiblingOrder(
                node.TaxonomyId,
                request.TargetParentId,
                cancellationToken);

            await transaction.CommitAsync(cancellationToken);
        } // end MoveNode

        private async Task<bool> IsDescendant(long nodeId, long possibleDescendantId,
            CancellationToken cancellationToken)
        {
            var currentParentId = await _db.TaxonomyNode
                .Where(x => x.Id == possibleDescendantId)
                .Select(x => x.ParentId)
                .FirstOrDefaultAsync(cancellationToken);

            while (currentParentId is not null)
            {
                if (currentParentId == nodeId)
                    return true;

                currentParentId = await _db.TaxonomyNode
                    .Where(x => x.Id == currentParentId.Value)
                    .Select(x => x.ParentId)
                    .FirstOrDefaultAsync(cancellationToken);
            }

            return false;
        } // end IsDescendant


        public async Task<List<EmployeeTaxonomyAttributeDto>> GetAttributes(long nodeId,
            CancellationToken cancellationToken = default)
        {
            var attrs = await _db.AttributeDefinition
                .AsNoTracking()
                .Where(x => x.Nodes.ToList()
                    .Any(y => y.TaxonomyNodeId == nodeId))
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


        public async Task<EmployeeTaxonomyAttributeDto> CreateAttribute(long nodeId, 
            CreateTaxonomyAttributeRequest request, CancellationToken cancellationToken = default)
        {
            var nodeExists = await _db.TaxonomyNode
                .AnyAsync(
                    x => x.Id == nodeId && x.IsActive,
                    cancellationToken);

            if (!nodeExists)
                throw new KeyNotFoundException("Taxonomy node not found.");

            if (!Enum.TryParse<AttributeDataType>(
                    request.Type,
                    ignoreCase: true,
                    out var dataType))
            {
                throw new ArgumentException(
                    $"Invalid attribute type '{request.Type}'.");
            }

            var key = request.Key.Trim().ToLowerInvariant();

            if (string.IsNullOrWhiteSpace(key))
                throw new ArgumentException("Attribute key is required.");

            var alreadyExists = await _db.AttributeDefinition
                .AnyAsync(
                    x =>
                        x.Nodes.All(y => y.TaxonomyNodeId == nodeId) &&
                        x.Key == key &&
                        x.IsActive,
                    cancellationToken);

            if (alreadyExists)
                throw new ArgumentException(
                    $"An attribute with key '{key}' already exists on this category.");

            if (request.MinValue > request.MaxValue &&
                request.MinValue.HasValue &&
                request.MaxValue.HasValue)
            {
                throw new ArgumentException(
                    "Minimum value cannot be greater than maximum value.");
            }

            var maxSortOrder = await _db.AttributeDefinition
                .Where(x => x.Nodes.All(y => y.TaxonomyNodeId == nodeId))
                .Select(x => (int?)x.SortOrder)
                .MaxAsync(cancellationToken) ?? 0;

            var definition = new AttributeDefinition
            {
                Name = request.Name.Trim(),
                Key = key,
                DataType = dataType,
                IsActive = true,

                IsSearchable = request.Searchable,
                IsFilterable = request.Filterable,

                MinValue = request.MinValue,
                MaxValue = request.MaxValue,

                Options = CreateOptionsDocument(request.Options)
            };

            var nodeAttribute = new NodeAttributeDefinition
            {
                TaxonomyNodeId = nodeId,
                AttributeDefinition = definition,

                IsRequired = request.Required,
                SortOrder = maxSortOrder + 1
            };

            var attr = await _db.AttributeDefinition
                .Where(x => x.Id == nodeAttribute.AttributeDefinition.Id)
                .FirstAsync();

            attr.Nodes.Add(nodeAttribute);
            await _db.SaveChangesAsync(cancellationToken);

            return new EmployeeTaxonomyAttributeDto
            {
                Id = definition.Id,
                Name = definition.Name,
                Key = definition.Key,
                Type = definition.DataType.ToString().ToLower(),

                Required = nodeAttribute.IsRequired,
                Searchable = definition.IsSearchable,
                Filterable = definition.IsFilterable,

                MinValue = definition.MinValue,
                MaxValue = definition.MaxValue,

                Options = request.Options ?? []
            };
        } // end CreateAttribute


        public async Task UpdateAttribute(long nodeId, long attributeId,
            UpdateTaxonomyAttributeRequest request, CancellationToken cancellationToken = default)
        {
            var nodeAttribute = await _db.AttributeDefinition
                .FirstOrDefaultAsync(
                    x =>
                        x.Nodes.All(y => y.TaxonomyNodeId == nodeId) &&
                        x.Id == attributeId &&
                        x.IsActive,
                    cancellationToken);

            if (nodeAttribute is null)
                throw new KeyNotFoundException("Attribute not found.");

            if (!Enum.TryParse<AttributeDataType>(
                    request.Type,
                    true,
                    out var dataType))
            {
                throw new ArgumentException(
                    $"Invalid attribute type '{request.Type}'.");
            }

            if (request.MinValue > request.MaxValue &&
                request.MinValue.HasValue &&
                request.MaxValue.HasValue)
            {
                throw new ArgumentException(
                    "Minimum value cannot be greater than maximum value.");
            }

            var key = request.Key.Trim().ToLowerInvariant();

            var duplicate = await _db.AttributeDefinition
                .AnyAsync(
                    x =>
                        x.Nodes.All(y => y.TaxonomyNodeId == nodeId) &&
                        x.Id != attributeId &&
                        x.Key == key &&
                        x.IsActive,
                    cancellationToken);

            if (duplicate)
                throw new ArgumentException(
                    $"An attribute with key '{key}' already exists on this category.");

            var definition = nodeAttribute;

            definition.Name = request.Name.Trim();
            definition.Key = key;
            definition.DataType = dataType;

            definition.IsSearchable = request.Searchable;
            definition.IsFilterable = request.Filterable;

            definition.MinValue = request.MinValue;
            definition.MaxValue = request.MaxValue;

            definition.Options = CreateOptionsDocument(request.Options);

            nodeAttribute.IsRequired = request.Required;

            await _db.SaveChangesAsync(cancellationToken);
        } // end UpdateAttribute


        public async Task DeleteAttribute(long nodeId, long attributeId,
            CancellationToken cancellationToken = default)
        {
            var nodeAttribute = await _db.AttributeDefinition
                .FirstOrDefaultAsync(
                    x =>
                        x.Nodes.All(y => y.TaxonomyNodeId == nodeId) &&
                        x.Id == attributeId,
                    cancellationToken);

            if (nodeAttribute is null)
                throw new KeyNotFoundException("Attribute not found.");

            _db.AttributeDefinition.Remove(nodeAttribute);

            var stillUsed = await _db.AttributeDefinition
                .AnyAsync(
                    x =>
                        x.Id == attributeId &&
                        x.Nodes.All(y => y.TaxonomyNodeId != nodeId),
                    cancellationToken);

            if (!stillUsed)
            {
                var definition = await _db.AttributeDefinition
                    .FirstOrDefaultAsync(
                        x => x.Id == attributeId,
                        cancellationToken);

                if (definition is not null)
                {
                    definition.IsActive = false;
                }
            }

            await _db.SaveChangesAsync(cancellationToken);
        } // end DeleteAttribute


        private async Task NormalizeSiblingOrder(long taxonomyId, long? parentId,
            CancellationToken cancellationToken)
        {
            var siblings = await _db.TaxonomyNode
                .Where(x =>
                    x.TaxonomyId == taxonomyId &&
                    x.ParentId == parentId &&
                    x.IsActive)
                .OrderBy(x => x.SortOrder)
                .ThenBy(x => x.Id)
                .ToListAsync(cancellationToken);

            for (var i = 0; i < siblings.Count; i++)
            {
                siblings[i].SortOrder = i + 1;
            }

            await _db.SaveChangesAsync(cancellationToken);
        } // end NormalizeSiblingOrder


        private static string CreateSlug(string value)
        {
            return value.Trim()
                .ToLowerInvariant()
                .Replace(" ", "-");
        } // end CreateSlug


        private static JsonDocument? CreateOptionsDocument(IEnumerable<string>? options)
        {
            if (options is null)
                return null;

            var values = options
                .Select(x => x.Trim())
                .Where(x => !string.IsNullOrWhiteSpace(x))
                .ToList();

            if (values.Count == 0)
                return null;

            return JsonDocument.Parse(
                JsonSerializer.Serialize(values));
        } // end CreateOptionsDocument
    } // end class
} // end namespae