using Microsoft.EntityFrameworkCore;
using System.Runtime.InteropServices;
using YegnaBet.API.Modules.Provider.Dtos;
using YegnaBet.Domain.Enums;
using YegnaBet.Infrastructure.Persistence;

namespace YegnaBet.API.Modules.Provider.Services
{
    public class ProviderService
    {
        private readonly BrokerDbContext _db;
        private Random random = new Random();

        public ProviderService(BrokerDbContext db)
        {
            _db = db;
        }

        public async Task<ProviderDataDto> Get(long id)
        {
            // ------------------------------------------------------------ //
            // Provider 
            // ------------------------------------------------------------
            
            var provider = await _db.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Id == id); 
            
            if (provider == null) 
                throw new KeyNotFoundException($"Provider with id {id} was not found."); 
            
            var nameParts = provider.FullName .Split(' ', StringSplitOptions.RemoveEmptyEntries); 
            var initials = nameParts.Length 
                switch { 
                    0 => string.Empty, 
                    1 => nameParts[0][0].ToString().ToUpper(), _ => $"{nameParts[0][0]}{nameParts[^1][0]}".ToUpper() 
                };

            // ------------------------------------------------------------ 
            // Fetch all listings once 
            // ------------------------------------------------------------

            var listings = await _db.Listings
                .AsNoTracking()
                .Where(x => x.ProviderId == id)
                .Select(x => new ProviderListingDto 
                { 
                    Id = x.Id, 
                    Title = x.Title, 
                    Category = x.TaxonomyNodes
                        .Select(t => t.TaxonomyNode.Name)
                        .FirstOrDefault() ?? "Uncategorized", 
                    Location = x.Location != null ? x.Location.Area + ", " + x.Location.City : string.Empty, 
                    Price = x.Price?? 0, 
                    Image = x.Images
                        .Select(i => i.ImageUrl) 
                        .FirstOrDefault() ?? string.Empty, 
                    Status = x.ListingStatus.ToString(), 
                    Views = x.ViewsCount, 
                    Enquiries = x.InquiresCount, 
                    Update = "since first migration" 
                })
                .ToListAsync(); 
            
            // ------------------------------------------------------------ 
            // Calculate listing statistics from the data we already fetched 
            // ------------------------------------------------------------
            
            var activeListings = listings.Count(x => x.Status == ListingStatus.Active.ToString()); 
            var drafts = listings.Count(x => x.Status == ListingStatus.Draft.ToString()); 
            var pending = listings.Count(x => x.Status == ListingStatus.Pending.ToString()); 
            var paused = listings.Count(x => x.Status == ListingStatus.Cancelled.ToString()); 
            var totalViews = listings.Sum(x => x.Views); 
            var totalInquiries = listings.Sum(x => x.Enquiries); 
            
            // ------------------------------------------------------------ 
            // Fetch inquiries once 
            // ------------------------------------------------------------
            
            var requests = await _db.Inquiries
                .AsNoTracking()
                .Where(x => x.Listing.ProviderId == id)
                .Select(x => new 
                { 
                    x.Id, 
                    x.CustomerName, 
                    x.ListingId, 
                    ListingTitle = x.Listing != null ? x.Listing.Title : "Unknown listing", 
                    Location = x.Listing != null && x.Listing.Location != null ? x.Listing.Location.Area + ", " + x.Listing.Location.City : string.Empty 
                })
                .ToListAsync();

            // ------------------------------------------------------------ 
            // Build request DTOs 
            // ------------------------------------------------------------
            
            var requestDtos = requests
                .Select(x => new ProviderRequestDto 
                { 
                    Id = x.Id, 
                    Customer = x.CustomerName, 
                    Request = x.ListingTitle, 
                    Location = x.Location, 
                    Budget = random .Next(100_000, 1_000_000).ToString("N0"), 
                    Received = $"{random.Next(1, 60)} minutes ago", 
                    Status = "New" 
                })
                .ToList();

            // ------------------------------------------------------------ 
            // Build response 
            // ------------------------------------------------------------

            var dto = new ProviderDataDto
            {
                Provider = new ProviderDto
                {
                    Name = provider.FullName,
                    Initials = initials,
                    Verified = provider.IsVerified,

                    // Dummy value for now
                    BusinessName = $"{provider.FullName} properties",
                    BusinessHealth = random.Next(50, 99)
                },
                Status = new ProviderStatusDto
                {
                    ActiveListings = activeListings,
                    TotalViews = totalViews,
                    Inquiries = totalInquiries,

                    // Dummy value for now
                    Deals = random.Next(1, 10)
                },
                Summary = new ProviderListingSummary
                {
                    Active = activeListings,
                    Drafts = drafts,
                    Pending = pending,
                    Paused = paused
                },
                Listings = listings,
                Requests = requestDtos,

                // Dummy for now
                Opportunities = new List<ProviderOpportunityDto> {
                    new ProviderOpportunityDto
                    {
                        Id = 1,
                        _Type = "attention",
                        Title = "Modern Family House needs an update",
                        Description = "This listing has not been updated for 21 days.",
                        _Action = "Update listing"
                    }
                }
            };
            
            return dto; 
        }

        public async Task<List<ProviderTaxonomyDto>> GetProviderTaxonomyAsync(CancellationToken cancellationToken = default)
        {
            var nodes = await _db.TaxonomyNode
                .AsNoTracking()
                .Where(x => x.IsActive && x.Taxonomy.IsActive)
                .OrderBy(x => x.SortOrder)
                .Select(x => new
                {
                    x.Id,
                    x.ParentId,
                    x.Name,
                    x.SortOrder
                })
                .ToListAsync(cancellationToken);

            var lookup = nodes.ToDictionary(
                x => x.Id,
                x => new ProviderTaxonomyDto
                {
                    Id = x.Id,
                    Name = x.Name
                });

            var roots = new List<ProviderTaxonomyDto>();

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
            }

            return roots;
        }
    }
}