using Microsoft.EntityFrameworkCore;
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
            
            if (categoryId.HasValue)
                query = query.Where(x => x.CategoryId == categoryId);
            
            return await query.OrderByDescending(x => x.TrustScore)
                .Select(x => new ListingCardDto {
                    Id = x.Id, 
                    Title = x.Title,
                    Area = x.Location.Area,
                    Price = x.Price,
                    PriceUnit = x.PriceUnit,
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
                    TrustScore = x.TrustScore,
                    IsVerified = x.IsVerified,
                    ProviderName = x.Provider.FullName })
                .FirstOrDefaultAsync();
        }
    }
}
