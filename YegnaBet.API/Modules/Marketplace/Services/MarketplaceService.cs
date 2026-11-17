using Microsoft.EntityFrameworkCore;
using System.Net.NetworkInformation;
using System.Globalization;
using System.Text.RegularExpressions;
using YegnaBet.API.Modules.Authentication;
using YegnaBet.API.Modules.Marketplace.Dtos;
using YegnaBet.API.Modules.Users.Dtos;
using YegnaBet.Domain.Entities;
using YegnaBet.Domain.Enums;
using YegnaBet.Infrastructure.Persistence;

namespace YegnaBet.API.Modules.Marketplace.Services
{
    public class MarketplaceService
    {
        private readonly BrokerDbContext _db;
        private readonly EmployeeAssignmentService _employeeAssignmentService;

        public MarketplaceService(BrokerDbContext db, 
            EmployeeAssignmentService employeeAssignmentService) 
        { 
            _db = db; 
            _employeeAssignmentService = employeeAssignmentService;
        }

        //public async Task<List<ListingCardDto>> GetListingsAsync(int? categoryId) 
        //{
        //    var query = _db.Listings
        //        .AsNoTracking()
        //        .Where(x => x.ListingStatus == ListingStatus.Active); 
            
        //    //if (categoryId.HasValue)
        //    //    query = query.Where(x => x.CategoryId == categoryId);
            
        //    return await query.OrderByDescending(x => x.TrustScore)
        //        .Select(x => new ListingCardDto {
        //            Id = x.Id, 
        //            Title = x.Title,
        //            Area = x.Location.Area,
        //            Price = x.Price,
        //            PriceUnit = x.PriceUnit,
        //            Image = x.Images.First().ImageUrl,
        //            TrustScore = x.TrustScore,
        //            IsVerified = x.IsVerified
        //        })
        //        .ToListAsync();
        //}

        public async Task<ListingDto?> GetListingAsync(long id, long? userId = null,
            ListingStatus? listingStatus = null)
        {
            var res = await getListings(
                new ListingQueryDto
                {
                    Id = id,
                    UserId = userId,
                    Status = listingStatus
                });

            var ret = res.Items.FirstOrDefault();

            if (ret == null)
                return null;

            // Management reads must not create customer inquiry assignments,
            // especially for drafts and other non-public listing states.
            var assignment = listingStatus.HasValue
                ? null
                : _employeeAssignmentService.Assign(id);

            if (assignment != null)
            {
                var emp =
                    assignment.Employee;

                ret.Employee = new ListingEmployeeDto
                {
                    Id = emp.Id,
                    Name = emp.Name,
                    Avatar = emp.Avatar,
                    Phone = emp.Phone,
                };

                ret.AssignmentId =
                    assignment.AssignmentId;

                ret.AssignmentExpiresAt =
                    assignment.ExpiresAt;
            }

            return ret;
        }

        public async Task<ListingDto?> GetManagedListingAsync(long id, long userId, bool isOwner)
        {
            var listing = await _db.Listings
                .AsNoTracking()
                .Where(x => x.Id == id)
                .Select(x => new { x.ProviderId, x.ListingStatus })
                .FirstOrDefaultAsync();

            if (listing is null) return null;

            return await GetListingAsync(id, userId, listing.ListingStatus);
        }

        public async Task<ListingDto?> UpdateManagedListingAsync(long id, long userId,
            bool isOwner, UpdateManagedListingDto request)
        {
            if (!Enum.IsDefined(request.ListingStatus))
                throw new ArgumentOutOfRangeException(nameof(request.ListingStatus), "Invalid listing status.");
            if (!Enum.IsDefined(request.Method))
                throw new ArgumentOutOfRangeException(nameof(request.Method), "Invalid listing method.");
            if (string.IsNullOrWhiteSpace(request.Title))
                throw new ArgumentException("A listing title is required.");
            if (string.IsNullOrWhiteSpace(request.City) || string.IsNullOrWhiteSpace(request.Area))
                throw new ArgumentException("City and area are required.");
            if (request.Price < 0)
                throw new ArgumentOutOfRangeException(nameof(request.Price), "Price cannot be negative.");

            var listing = await _db.Listings
                .Include(x => x.Location)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (listing is null) return null;
            listing.Title = request.Title.Trim();
            listing.Description = request.Description?.Trim();
            listing.Price = request.Price;
            listing.Method = request.Method;
            listing.ListingStatus = request.ListingStatus;
            if (listing.Location is null)
            {
                listing.Location = new Location { City = request.City.Trim(), Area = request.Area.Trim() };
            }
            else
            {
                listing.Location.City = request.City.Trim();
                listing.Location.Area = request.Area.Trim();
            }

            await _db.SaveChangesAsync();
            return await GetListingAsync(id, userId, listing.ListingStatus);
        }

        public async Task<bool> RemoveManagedListingAsync(long id)
        {
            var listing = await _db.Listings.FirstOrDefaultAsync(x => x.Id == id);
            if (listing is null) return false;

            // Keep inquiry/saved-listing history intact while removing it from the marketplace.
            listing.ListingStatus = ListingStatus.Cancelled;
            await _db.SaveChangesAsync();
            return true;
        }

        public async Task<List<ListingStatusCountDto>> GetListingStatusCountAsync(int providerId)
        {
            return await _db.Listings
                .Where(x => x.ProviderId == providerId)
                .OrderBy(x => x.ListingStatus)
                .GroupBy(x => x.ListingStatus)
                .Select(g => new ListingStatusCountDto 
                {
                    Status = g.Key == ListingStatus.Draft ? "Draft" :
                        g.Key == ListingStatus.Active ? "Active" :
                        g.Key == ListingStatus.Pending ? "Pending" : "Closed",
                    Count = g.Count()
                })
                .ToListAsync();
        } // end GetListingStatusCount

        public async Task<List<ProviderListingViewDto>> GetProviderListings(int providerId)
        {
            return await _db.Listings
                .Where(x => x.ProviderId == providerId)
                .Select(x => new ProviderListingViewDto
                {
                    Id = x.Id,
                    Title = x.Title,
                    Type = x.Method == ListingMethod.Buy ? "Buy" :
                        x.Method == ListingMethod.Rent ? "Rent" :
                        x.Method == ListingMethod.Contract ? "Contract" : "Service",
                    Price = x.Price,
                    PriceUnit = x.PriceUnit,
                    Status = x.ListingStatus == ListingStatus.Draft ? "Draft" :
                        x.ListingStatus == ListingStatus.Active ? "Active" :
                        x.ListingStatus == ListingStatus.Pending ? "Pending" : "Closed",
                    Image = x.Images.First().ImageUrl
                })
                .ToListAsync();
        } // end GetProviderLisitings


        private async Task<List<long>> GetTaxonomyDescendantIds(int rootId)
        {
            var nodes = await _db.TaxonomyNode
                .AsNoTracking()
                .Select(x => new
                {
                    x.Id,
                    x.ParentId
                })
                .ToListAsync();

            var children = nodes
                .Where(x => x.ParentId.HasValue)
                .GroupBy(x => x.ParentId!.Value)
                .ToDictionary(
                    group => group.Key,
                    group => group.Select(x => x.Id).ToList()
                );

            var result = new HashSet<long> { rootId };
            var pending = new Stack<long>();
            pending.Push(rootId);

            while (pending.Count > 0)
            {
                var currentId = pending.Pop();

                if (!children.TryGetValue(currentId, out var childIds))
                    continue;

                foreach (var childId in childIds)
                {
                    if (result.Add(childId))
                    {
                        pending.Push(childId);
                    }
                }
            }

            return result.ToList();
        }

        private async Task<(long Id, HashSet<int> MatchedTokenIndexes)?> ResolveSearchTaxonomyAsync(IReadOnlyList<string> tokens)
        {
            var nodes = await _db.TaxonomyNode
                .AsNoTracking()
                .Where(x => x.IsActive && x.Taxonomy.IsActive)
                .Select(x => new { x.Id, x.ParentId, x.Name, x.Slug })
                .ToListAsync();

            var candidates = new List<(long Id, int Depth, HashSet<int> Matches)>();
            foreach (var node in nodes)
            {
                var normalizedNodeWords = Regex.Matches($"{node.Name} {node.Slug}".ToLowerInvariant(), @"[\p{L}\p{N}]+")
                    .Select(match => NormalizeSearchWord(match.Value))
                    .Where(word => !string.IsNullOrWhiteSpace(word))
                    .ToHashSet(StringComparer.OrdinalIgnoreCase);

                var aliases = new HashSet<string>(normalizedNodeWords, StringComparer.OrdinalIgnoreCase);
                if (normalizedNodeWords.Contains("house")) aliases.Add("home");
                if (normalizedNodeWords.Contains("apartment")) aliases.Add("flat");

                var matches = tokens
                    .Select((token, index) => (token, index))
                    .Where(item => aliases.Contains(NormalizeSearchWord(item.token)))
                    .Select(item => item.index)
                    .ToHashSet();
                if (matches.Count == 0) continue;

                int depth = 0;
                var parentId = node.ParentId;
                while (parentId.HasValue && depth <= nodes.Count)
                {
                    depth++;
                    parentId = nodes.FirstOrDefault(item => item.Id == parentId.Value)?.ParentId;
                }

                candidates.Add((node.Id, depth, matches));
            }

            var selected = candidates.OrderByDescending(item => item.Depth).FirstOrDefault();
            return selected.Id == 0 ? null : (selected.Id, selected.Matches);
        }

        private static string NormalizeSearchWord(string word)
        {
            var normalized = word.ToLowerInvariant();
            if (normalized.EndsWith("ies", StringComparison.Ordinal) && normalized.Length > 3)
                return normalized[..^3] + "y";
            if (normalized.EndsWith('s') && normalized.Length > 3 && !normalized.EndsWith("ss", StringComparison.Ordinal))
                return normalized[..^1];
            return normalized;
        }


        public async Task<ListingPageDto> getListings(ListingQueryDto request,
            long? managerId = null, bool isOwner = false)
        {
            var page = Math.Max(request.Page, 0);
            var pageSize = Math.Clamp(request.PageSize, 1, 50);

            var query = _db.Listings.AsNoTracking();

            if (request.ProviderId.HasValue)
                query = query.Where(x => x.ProviderId == request.ProviderId.Value);

            if (managerId.HasValue && request.MyListingsOnly)
                query = query.Where(x => x.ProviderId == managerId.Value);

            if (request.Status.HasValue)
            {
                query = query.Where(x =>
                    x.ListingStatus == request.Status.Value);
            }
            else if (!request.AllStatuses)
            {
                // Preserve existing marketplace behavior.
                query = query.Where(x =>
                    x.ListingStatus == ListingStatus.Active ||
                    x.ListingStatus == ListingStatus.Pending);
            }

            // Specific listing
            if (request.Id.HasValue && request.Id.Value > 0)
            {
                query = query.Where(x => x.Id == request.Id.Value);
            }

            // Saved / unsaved listings
            if (request.Saved.HasValue)
            {
                if (request.UserId.GetValueOrDefault() <= 0)
                {
                    // A saved filter requires an authenticated user.
                    query = query.Where(_ => false);
                }
                else
                {
                    var userId = request.UserId.Value;

                    var savedQuery = _db.SavedListings
                        .AsNoTracking()
                        .Where(s =>
                            s.UserId == userId &&
                            !s.IsDeleted);

                    query = request.Saved.Value
                        ? query.Where(l =>
                            savedQuery.Any(s => s.ListingId == l.Id))
                        : query.Where(l =>
                            !savedQuery.Any(s => s.ListingId == l.Id));
                }
            }

            // Listing method
            if (request.Method.HasValue)
            {
                query = query.Where(x =>
                    x.Method == request.Method.Value);
            }

            int? selectedTaxonomyNodeId = request.TaxonomyNodeId;
            if (!selectedTaxonomyNodeId.HasValue && !string.IsNullOrWhiteSpace(request.Category))
            {
                var categorySlug = request.Category.Trim().ToLowerInvariant();
                selectedTaxonomyNodeId = await _db.TaxonomyNode
                    .AsNoTracking()
                    .Where(x => x.Slug == categorySlug)
                    .Select(x => (int?)x.Id)
                    .FirstOrDefaultAsync();
            }

            // Search parsing and filtering is handled below so taxonomy terms
            // are treated as strict filters instead of loose text matches.
            if (!string.IsNullOrWhiteSpace(request.Search))
            {
                var searchWords = Regex.Matches(request.Search.ToLowerInvariant(), @"[\p{L}]+|\d+(?:[.,]\d+)*")
                    .Select(match => match.Value)
                    .ToArray();
                var consumed = new HashSet<int>();

                var taxonomyMatch = await ResolveSearchTaxonomyAsync(searchWords);
                if (taxonomyMatch.HasValue)
                {
                    consumed.UnionWith(taxonomyMatch.Value.MatchedTokenIndexes);
                    if (selectedTaxonomyNodeId.HasValue)
                    {
                        var selectedIds = await GetTaxonomyDescendantIds(selectedTaxonomyNodeId.Value);
                        var searchIds = await GetTaxonomyDescendantIds((int)taxonomyMatch.Value.Id);
                        if (selectedIds.Contains(taxonomyMatch.Value.Id))
                            selectedTaxonomyNodeId = (int)taxonomyMatch.Value.Id;
                        else if (!searchIds.Contains(selectedTaxonomyNodeId.Value))
                            query = query.Where(_ => false);
                    }
                    else
                    {
                        selectedTaxonomyNodeId = (int)taxonomyMatch.Value.Id;
                    }
                }

                if (selectedTaxonomyNodeId.HasValue)
                {
                    var attributeTaxonomyIds = await GetTaxonomyDescendantIds(selectedTaxonomyNodeId.Value);
                    var searchableAttributes = await _db.AttributeDefinition
                        .AsNoTracking()
                        .Where(attribute => attribute.IsActive && attribute.IsFilterable &&
                            attribute.Nodes.Any(node => attributeTaxonomyIds.Contains(node.TaxonomyNodeId)))
                        .Select(attribute => new
                        {
                            attribute.Id,
                            attribute.Key,
                            attribute.Name,
                            attribute.DataType
                        })
                        .ToListAsync();

                    foreach (var attribute in searchableAttributes)
                    {
                        var attributeMatched = false;
                        var phrases = new[] { attribute.Name, attribute.Key.Replace('_', ' ') }
                            .Select(value => Regex.Matches(value.ToLowerInvariant(), @"[\p{L}\p{N}]+")
                                .Select(match => NormalizeSearchWord(match.Value))
                                .ToArray())
                            .Where(words => words.Length > 0);

                        foreach (var phrase in phrases)
                        {
                            for (var start = 0; start + phrase.Length <= searchWords.Length; start++)
                            {
                                if (!phrase.SequenceEqual(searchWords.Skip(start).Take(phrase.Length)
                                    .Select(NormalizeSearchWord), StringComparer.OrdinalIgnoreCase))
                                    continue;

                                var numberIndex = start > 0 && decimal.TryParse(searchWords[start - 1],
                                    NumberStyles.Number, CultureInfo.InvariantCulture, out _)
                                    ? start - 1
                                    : start + phrase.Length < searchWords.Length &&
                                      decimal.TryParse(searchWords[start + phrase.Length], NumberStyles.Number,
                                          CultureInfo.InvariantCulture, out _)
                                        ? start + phrase.Length
                                        : -1;
                                if (numberIndex < 0 || attribute.DataType is not (AttributeDataType.Integer or AttributeDataType.Decimal))
                                    continue;

                                request.Attributes ??= new Dictionary<string, string>();
                                request.Attributes.TryAdd(attribute.Key, decimal.Parse(searchWords[numberIndex],
                                    CultureInfo.InvariantCulture).ToString(CultureInfo.InvariantCulture));
                                consumed.Add(numberIndex);
                                for (var i = start; i < start + phrase.Length; i++) consumed.Add(i);
                                attributeMatched = true;
                                break;
                            }

                            if (attributeMatched) break;
                        }
                    }
                }

                string[] stopWords = ["in", "near", "with", "for", "at", "the", "a", "an", "of", "and", "or", "to"];
                var remainingTerms = searchWords
                    .Select((word, index) => (word, index))
                    .Where(item => !consumed.Contains(item.index) &&
                        !stopWords.Contains(item.word, StringComparer.OrdinalIgnoreCase))
                    .Select(item => item.word)
                    .Distinct(StringComparer.OrdinalIgnoreCase);

                foreach (var term in remainingTerms)
                {
                    var pattern = $"%{term}%";
                    query = query.Where(x =>
                        EF.Functions.ILike(x.Title, pattern) ||
                        (x.Description != null && EF.Functions.ILike(x.Description, pattern)) ||
                        EF.Functions.ILike(x.Location.City, pattern) ||
                        EF.Functions.ILike(x.Location.Area, pattern) ||
                        (x.Location.SubArea != null && EF.Functions.ILike(x.Location.SubArea, pattern)));
                }
            }

            // Featured
            if (request.Featured.HasValue)
            {
                query = query.Where(x =>
                    x.IsFeatured == request.Featured.Value);
            }

            // Verified
            if (request.Verified.HasValue)
            {
                query = query.Where(x =>
                    x.IsVerified == request.Verified.Value);
            }

            // Multiple locations
            if (request.LocationIds?.Count > 0)
            {
                var locationIds = request.LocationIds
                    .Where(id => id > 0)
                    .Distinct()
                    .ToList();

                if (locationIds.Count > 0)
                {
                    query = query.Where(x =>
                        locationIds.Contains((int)x.LocationId));
                }
            }
            // Legacy location text search
            else if (!string.IsNullOrWhiteSpace(request.Location))
            {
                var location = request.Location.Trim();

                query = query.Where(x =>
                    x.Location.City.Contains(location) ||
                    x.Location.Area.Contains(location));
            }

            // Price range
            if (request.MinPrice.HasValue)
            {
                query = query.Where(x =>
                    x.Price >= request.MinPrice.Value);
            }

            if (request.MaxPrice.HasValue)
            {
                query = query.Where(x =>
                    x.Price <= request.MaxPrice.Value);
            }

            // Taxonomy selection: selected node + all descendants.
            if (selectedTaxonomyNodeId.HasValue)
            {
                var taxonomyIds = await GetTaxonomyDescendantIds(
                    selectedTaxonomyNodeId.Value);

                query = query.Where(x =>
                    x.TaxonomyNodes.Any(t =>
                        taxonomyIds.Contains((int)t.TaxonomyNodeId)));
            }

            // Dynamic attribute filters
            if (request.Attributes?.Count > 0)
            {
                foreach (var attribute in request.Attributes)
                {
                    var key = attribute.Key?.Trim();
                    var value = attribute.Value;

                    if (string.IsNullOrWhiteSpace(key) ||
                        string.IsNullOrWhiteSpace(value))
                    {
                        continue;
                    }

                    query = query.Where(x =>
                        x.AttributeValues.Any(a =>
                            a.AttributeDefinition.Key == key &&
                            a.Value == value));
                }
            }

            // Sorting
            query = request.Sort switch
            {
                "price-low" =>
                    query.OrderBy(x => x.Price),

                "price-high" =>
                    query.OrderByDescending(x => x.Price),

                "newest" =>
                    query.OrderByDescending(x => x.CreatedAt),

                _ =>
                    query.OrderByDescending(x => x.Id)
            };

            var rows = await query
                .Skip(page * pageSize)
                .Take(pageSize + 1)
                .Select(x => new ListingDto
                {
                    Id = x.Id,
                    Title = x.Title,
                    Description = x.Description,
                    Price = x.Price,
                    Currency = "ETB",

                    Status =
                        x.Method == ListingMethod.Buy
                            ? "buy"
                            : "rent",
                    Category = x.TaxonomyNodes
                        .Select(node => node.TaxonomyNode.Name)
                        .FirstOrDefault() ?? string.Empty,
                    Method = x.Method,
                    Views = x.ViewsCount,

                    Location = new ListingLocationDto
                    {
                        City = x.Location.City,
                        Area = x.Location.Area
                    },

                    Images = x.Images
                        .Where(i => i.Kind == ImageKind.Photo)
                        .OrderByDescending(i => i.IsPrimary)
                        .ThenBy(i => i.Id)
                        .Select(i => i.ImageUrl)
                        .ToArray(),

                    Media = x.Images
                        .OrderByDescending(i => i.IsPrimary)
                        .ThenBy(i => i.Id)
                        .Select(i => new ListingMediaDto
                        {
                            Url = i.ImageUrl,
                            Kind = i.Kind == ImageKind.Video ? "video" : "photo",
                            IsPrimary = i.IsPrimary
                        })
                        .ToList(),

                    Featured = x.IsFeatured,
                    Verified = x.IsVerified,

                    // Trending calculation is not defined yet.
                    Trending = false,

                    Saved = request.UserId.GetValueOrDefault() > 0 &&
                        _db.SavedListings
                            .AsNoTracking()
                            .Any(y =>
                                y.UserId == request.UserId.Value &&
                                y.ListingId == x.Id &&
                                !y.IsDeleted),

                    Metadata = x.AttributeValues
                        .Select(a => new ListingMetadataDto
                        {
                            Name = a.AttributeDefinition.Name,
                            Key = a.AttributeDefinition.Key,
                            Value = a.Value
                        })
                        .ToList(),

                    ListingStatus = x.ListingStatus,
                })
                .ToListAsync();

            var hasMore = rows.Count > pageSize;

            if (hasMore)
            {
                rows.RemoveAt(rows.Count - 1);
            }

            return new ListingPageDto
            {
                Items = rows,
                Page = page,
                PageSize = pageSize,
                HasMore = hasMore
            };
        } // end getListings


        /// <summary>
        /// returns the location info from the database using the id parameter if
        /// supplied or the entire locations distinctly if not.
        /// </summary>
        /// <param name="id">an optional nullable id param that can be used to filter locations viz id</param>
        /// <returns>List of locationDto's</returns>
        public async Task<List<ListingLocationDto>> getLocations(long? id)
        {
            var query = _db.Locations
                .AsNoTracking();

            if (id.HasValue)
                query = query.Where(l => l.Id == id.Value);

            return await query.Select(x => new ListingLocationDto
            {
                Id = x.Id,
                Country = x.Country,
                City = x.City,
                Area = x.Area,
                SubArea = x.SubArea,
                Count = _db.Listings
                    .AsNoTracking()
                    .Count(y => y.LocationId == x.Id)
            }).OrderBy(x => x.Count).Distinct().ToListAsync();
        } // end getLocations


        public async Task<long> InsertUpdateSaved(AddUpdateSavedListingDto dto)
        {
            var listing = await _db.SavedListings
                .AsNoTracking()
                .Where(x => x.UserId == dto.UserId && x.ListingId == dto.ListingId)
                .FirstOrDefaultAsync();

            if (listing == null)
            {
                _db.SavedListings.Add(new SavedListings
                {
                    UserId = dto.UserId,
                    ListingId = dto.ListingId,
                });
            } // end if
            else
            {
                if (!dto.Saved)
                {
                    listing.IsDeleted = true;
                } // end if not saved
                else
                {
                    listing.IsDeleted = false;
                    
                } // end else
                _db.SavedListings.Update(listing);
            } // end else

            var saved = await _db.SaveChangesAsync();
            return saved;
        } // InsertUpdateSaved

        public async Task<long> UpdateListingViews(SetViewsCountDto dto)
        {
            var listing = await _db.Listings
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.Id == dto.ListingId) ?? 
                throw new BadHttpRequestException($"ListingId: {dto.ListingId} not found");

            listing.ViewsCount += 1;
            _db.Listings.Update(listing);

            // make an entry for extra views stat if user has logged in
            if (dto.UserId != null)
            {
                var view = await _db.ListingViewsCount
                    .AsNoTracking()
                    .FirstOrDefaultAsync(x => x.UserId == dto.UserId && x.ListingId == dto.ListingId);

                if (view == null)
                {
                    var newView = new ListingViewsCount
                    {
                        UserId = (long)dto.UserId,
                        ListingId = dto.ListingId,
                        Count = 1
                    };

                    _db.ListingViewsCount.Add(newView);
                } // end if empty
                else
                {
                    view.Count += 1;
                    _db.ListingViewsCount.Update(view);
                } // end else

                // now add the date for these actions
                var viewDate = new ListingViewsDates
                {
                    ListingId = dto.ListingId,
                    UserId = (long)dto.UserId,
                };

                _db.ListingViewsDates.Add(viewDate);
            } // end if userId

            await _db.SaveChangesAsync();
            return listing.Id;
        } // end UpdateListingViews
    } // end MarketplaceService
} // end namespace
