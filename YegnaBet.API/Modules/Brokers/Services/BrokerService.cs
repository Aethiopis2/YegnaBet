using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using YegnaBet.API.Modules.Brokers.Dtos;
using YegnaBet.API.Modules.Realtime;
using YegnaBet.Domain.Entities;
using YegnaBet.Domain.Enums;
using YegnaBet.Infrastructure.Persistence;
using YegnaBet.Infrastructure.Services;


namespace YegnaBet.API.Modules.Brokers.Services
{
    public class BrokerService
    {
        private readonly BrokerDbContext _db;
        private readonly IHubContext<BrokerHub> _hub;
        private readonly AuditService _audit;

        public BrokerService(BrokerDbContext db,  IHubContext<BrokerHub> hub, AuditService audit)
        {
            _db = db;
            _hub = hub;
            _audit = audit;
        }

        public async Task<long> CreateInquiryAsync(CreateInquiryDto dto)
        {
            var inquiry = new Inquiry
            {
                ListingId = dto.ListingId,
                CustomerName = dto.CustomerName,
                CustomerPhone = dto.CustomerPhone,
                InquiryStatus = InquiryStatus.New
            };

            _db.Inquiries.Add(inquiry);

            var listing = await _db.Listings.FindAsync(dto.ListingId);
            if (listing != null)
                listing.InquiresCount++;

            await _db.SaveChangesAsync();

            await _hub.Clients.All.SendAsync("InquiryCreated", new
            {
                inquiry.Id,
                dto.CustomerName,
                ListingId = dto.ListingId
            });

            return inquiry.Id;
        }

        public async Task<List<BrokerInquiryDto>> GetInquiresAsync()
        {
            return await _db.Inquiries
                .AsNoTracking()
                .OrderByDescending(x => x.CreatedAt)
                .Select(x => new BrokerInquiryDto
                {
                    Id = x.Id,
                    ListingTitle = x.Listing.Title,
                    CustomerName = x.CustomerName,
                    CustomerPhone = x.CustomerPhone,
                    Status = x.InquiryStatus.ToString(),
                    CreatedAt = x.CreatedAt
                })
                .ToListAsync();
        }

        public async Task<bool> UpdateStatusAsync(long id, string status)
        {
            var inquiry = await _db.Inquiries.FindAsync(id);
            if (inquiry == null)
                return false;

            if (!Enum.TryParse<InquiryStatus>(status, true, out var parsed))
                return false;

            inquiry.InquiryStatus = parsed;
            await _db.SaveChangesAsync();

            await _hub.Clients.All.SendAsync("InquiryUpdated", 
                new { 
                    inquiry.Id, 
                    Status = inquiry.InquiryStatus.ToString() 
                }); 
            
            return true;
        }

        public async Task<long?> CompleteDealAsync(long inquiryId, CompleteDealDto dto)
        {
            var inquiry = await _db.Inquiries
                .Include(x => x.Listing)
                .FirstOrDefaultAsync(x => x.Id == inquiryId);
            
            if (inquiry == null)
                return null;
            
            inquiry.InquiryStatus = InquiryStatus.Completed;
            
            var commission = dto.DealValue * dto.CommissionRate / 100m;
            var deal = new Deal {
                InquiryId = inquiry.Id,
                ListingId = inquiry.ListingId,
                BrokerId = inquiry.Listing.BrokerId ?? 1,
                DealValue = dto.DealValue,
                CommissionRate = dto.CommissionRate,
                CommissionAmount = commission,
                DealStatus = DealStatus.Successful,
                CompletedAt = DateTime.UtcNow
            }; _db.Deals.Add(deal);
            
            inquiry.Listing.SuccessfulDeals += 1;
            inquiry.Listing.TrustScore = Math.Min(100, inquiry.Listing.TrustScore + 1);
            
            await _db.SaveChangesAsync();
            
            await _hub.Clients.All.SendAsync("DealCompleted", 
                new { deal.Id, deal.CommissionAmount });

            _db.FinancialTransactions.Add(new FinancialTransaction
            {
                Deal = deal,
                TransactionType = "Comission Earned",
                Amount = commission
            });

            await _audit.LogAsync(
                "Deal", 
                deal.Id, 
                "Completed", 
                null, 
                $"DealValue={deal.DealValue};Commission={deal.CommissionAmount}"
            );

            await _hub.Clients.All.SendAsync("FinanceUpdated");
            return deal.Id;
        }

        public async Task<PipelineCountsDto> GetCountsAsync()
        {
            var data = await _db.Inquiries
                .GroupBy(x => x.InquiryStatus)
                .Select(g => new { g.Key, Count = g.Count() })
                .ToListAsync(); 
            
            return new PipelineCountsDto
            {
                New = data.FirstOrDefault(x => x.Key == InquiryStatus.New)?.Count ?? 0,
                Called = data.FirstOrDefault(x => x.Key == InquiryStatus.Called)?.Count ?? 0,
                Visited = data.FirstOrDefault(x => x.Key == InquiryStatus.Visited)?.Count ?? 0,
                Negotiating = data.FirstOrDefault(x => x.Key == InquiryStatus.Negotiating)?.Count ?? 0,
                Completed = data.FirstOrDefault(x => x.Key == InquiryStatus.Completed)?.Count ?? 0
            };
        }
    }
}
