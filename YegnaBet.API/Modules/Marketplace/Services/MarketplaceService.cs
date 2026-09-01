using Microsoft.EntityFrameworkCore;
using System.Net.NetworkInformation;
using YegnaBet.API.Modules.Marketplace.Dtos;
using YegnaBet.Domain.Enums;
using YegnaBet.Infrastructure.Persistence;

namespace YegnaBet.API.Modules.Marketplace.Services
{
    public class MarketplaceService
    {
        private readonly BrokerDbContext _db; 
        
        public MarketplaceService(BrokerDbContext db) 
        { 
            _db = db; 
        }

        public async Task<List<ListingCardDto>> GetListingsAsync(int? categoryId) 
        {
            var query = _db.Listings
                .AsNoTracking()
                .Where(x => x.ListingStatus == ListingStatus.Active); 
            
            //if (categoryId.HasValue)
            //    query = query.Where(x => x.CategoryId == categoryId);
            
            return await query.OrderByDescending(x => x.TrustScore)
                .Select(x => new ListingCardDto {
                    Id = x.Id, 
                    Title = x.Title,
                    Area = x.Location.Area,
                    Price = x.Price,
                    PriceUnit = x.PriceUnit,
                    Image = x.Images.First().ImageUrl,
                    TrustScore = x.TrustScore,
                    IsVerified = x.IsVerified
                })
                .ToListAsync();
        }

        public async Task<ListingDetailsDto?> GetListingAsync(long id) 
        { 
            return await _db.Listings
                .AsNoTracking()
                .Where(x => x.Id == id)
                .Select(x => new ListingDetailsDto { 
                    Id = x.Id,
                    Title = x.Title,
                    Description = x.Description,
                    Area = x.Location.Area,
                    Price = x.Price,
                    PriceUnit = x.PriceUnit,
                    Image = x.Images.First().ImageUrl,
                    TrustScore = x.TrustScore,
                    IsVerified = x.IsVerified,
                    ProviderName = x.Provider.FullName })
                .FirstOrDefaultAsync();
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
                    Type = x.Method == ListingMethod.Sales ? "Sales" :
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

        public async Task<object> GetFeaturedListings(int page = 0, int pageSize = 1000)
        {
            var results = await _db.Listings
            .Where(x =>
                x.IsFeatured &&
                (x.ListingStatus == ListingStatus.Active ||
                 x.ListingStatus == ListingStatus.Pending))
            .OrderBy(x => x.Id)
            .Skip(page * pageSize)
            .Take(pageSize + 1)
            .Select(x => new
            {
                Id = x.Id,
                Title = x.Title,
                Description = x.Description,
                Price = x.Price,
                Currency = "ETB",

                Status = x.Method == ListingMethod.Sales
                    ? "sale"
                    : "rent",

                Location = new
                {
                    City = x.Location.City,
                    Area = x.Location.Area
                },

                Images = x.Images
                    .Select(y => y.ImageUrl)
                    .ToArray(),

                Featured = x.IsFeatured,
                Verified = x.IsVerified,

                // Temporary until you have real trending logic
                Trending = true,

                // These should eventually come from the current user
                Saved = false,

                Metadata = x.AttributeValues
                    .Select(i => new
                    {
                        Name = i.AttributeDefinition.Name,
                        Value = i.Value
                    })
                    .ToList()
            })
            .ToListAsync();

            var hasMore = results.Count > pageSize;

            var items = results
                .Take(pageSize)
                .ToList();

            return new
            {
                Items = items,
                Page = page,
                PageSize = pageSize,
                HasMore = hasMore
            };
        }

        public async Task<ListingPageDto> GetListings(ListingQueryDto request)
        {
            var page = Math.Max(request.Page, 0);
            var pageSize = Math.Clamp(request.PageSize, 1, 50);

            var query = _db.Listings
                .AsNoTracking()
                .Where(x =>
                x.IsFeatured &&
                (x.ListingStatus == ListingStatus.Active ||
                 x.ListingStatus == ListingStatus.Pending));

            if (request.Method.HasValue)
            {
                query = query.Where(x =>
                    x.Method == request.Method.Value);
            }

            if (request.Featured.HasValue)
            {
                query = query.Where(x =>
                    x.IsFeatured == request.Featured.Value);
            }

            if (request.Verified.HasValue)
            {
                query = query.Where(x =>
                    x.IsVerified == request.Verified.Value);
            }

            if (!string.IsNullOrWhiteSpace(request.Location))
            {
                var location =
                    request.Location.Trim();

                query = query.Where(x =>
                    x.Location.City.Contains(location) ||
                    x.Location.Area.Contains(location));
            }

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

            if (!string.IsNullOrWhiteSpace(request.Category))
            {
                var category =
                    request.Category.Trim().ToLower();

                query = query.Where(x =>
                    x.TaxonomyNodes.Any(t =>
                        t.TaxonomyNode.Slug == category));
            }

            if (request.Attributes != null)
            {
                foreach (var attribute in request.Attributes)
                {
                    var key = attribute.Key;
                    var value = attribute.Value;

                    query = query.Where(x =>
                        x.AttributeValues.Any(a =>
                            a.AttributeDefinition.Key == key &&
                            a.Value == value));
                }
            }

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
                        x.Method == ListingMethod.Sales
                            ? "sale"
                            : "rent",
                    Location = new ListingLocationDto
                    {
                        City = x.Location.City,
                        Area = x.Location.Area
                    },
                    Images = x.Images
                        .Select(i => i.ImageUrl)
                        .ToArray(),
                    Featured = x.IsFeatured,
                    Verified = x.IsVerified,
                    Trending = false,
                    Saved = false,

                    Metadata = x.AttributeValues
                        .Select(a => new ListingMetadataDto
                        {
                            Name =
                                a.AttributeDefinition.Name,

                            Key =
                                a.AttributeDefinition.Key,

                            Value =
                                a.Value
                        })
                        .ToList()
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
        }
    }
}
