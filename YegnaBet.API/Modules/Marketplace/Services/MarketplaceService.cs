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

        public async Task<object> GetFeaturedListings()
        {
            return await _db.Listings
                .Where(x => x.IsFeatured == true)
                .Select(x => new 
                {
                    Id = x.Id,
                    Title = x.Title,
                    Description = x.Description,
                    Price = x.Price,
                    Currency = "ETB",
                    Status = x.Method == ListingMethod.Sales ? "Sales" : "Rent",
                    location = new
                    {
                        City = x.Location.City,
                        Area = x.Location.Area,
                    },
                    Images = x.Images.Select(y => y.ImageUrl).ToArray(),
                    Featured = x.IsFeatured,
                    Verified = x.IsVerified,
                    Trending = true,
                    Saved = false,
                    Metadata = x.AttributeValues.Select(i => new
                    {
                        Name = i.AttributeDefinition.Name,
                        value = i.Value
                        
                    })
                })
                .ToListAsync();
        }
    }
}
