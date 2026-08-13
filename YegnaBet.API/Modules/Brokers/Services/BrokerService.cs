using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using YegnaBet.API.Modules.Brokers.Dtos;
using YegnaBet.API.Modules.Realtime;
using YegnaBet.Domain.Entities;
using YegnaBet.Domain.Enums;
using YegnaBet.Infrastructure.Persistence;


namespace YegnaBet.API.Modules.Brokers.Services
{
    public class BrokerService
    {
        private readonly BrokerDbContext _db;
        private readonly IHubContext<BrokerHub> _hub;

        public BrokerService(BrokerDbContext db,  IHubContext<BrokerHub> hub)
        {
            _db = db;
            _hub = hub;
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
    }
}
