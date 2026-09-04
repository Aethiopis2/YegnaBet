using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using YegnaBet.API.Modules.Brokers.Dtos;
using YegnaBet.API.Modules.Marketplace.Services;
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
        private readonly EmployeeAssignmentService _employeeAssignmentService;

        public BrokerService(BrokerDbContext db,  IHubContext<BrokerHub> hub, AuditService audit,
            EmployeeAssignmentService employeeAssignmentService)
        {
            _db = db;
            _hub = hub;
            _audit = audit;
            _employeeAssignmentService = employeeAssignmentService;
        }

        public async Task<InquiryDto?> CreateAsync(CreateInquiryDto request, CancellationToken cancellationToken = default)
        { 
            /* 
             * Make sure the listing exists and is still available. 
             */
            var listingExists = await _db.Listings.AsNoTracking()
                .AnyAsync(x => x.Id == request.ListingId && 
                (x.ListingStatus == ListingStatus.Active || x.ListingStatus == ListingStatus.Pending), 
                cancellationToken); 
            
            if (!listingExists) 
                return null; 
            
            /* 
             * Resolve the employee from the in-memory 
             * assignment session. 
             * 
             * The frontend does NOT choose the employee. 
             */ 
            var employee = _employeeAssignmentService.GetAssignment(request.AssignmentId); 
            
            if (employee == null) 
                throw new InvalidOperationException("The listing assignment is no longer valid.");

            var cust = await _db.Users.AsNoTracking()
                .AnyAsync(x => x.Id == request.CustomerId || x.PhoneNumber == request.CustomerPhone, 
                cancellationToken);

            if (!cust)
            {
                // register this new customer and use its Id
                if (request.CustomerPhone != null && request.CustomerName != null)
                {
                    User customer = new User
                    {
                        FullName = request.CustomerName,
                        PhoneNumber = request.CustomerPhone,
                        IsActive = false,
                        IsVerified = false,
                        Role = UserRole.Customer
                    };

                    _db.Users.Add(customer);
                    await _db.SaveChangesAsync(); 
                        
                    request.CustomerId = _db.Users.First(x => x.PhoneNumber == customer.PhoneNumber).Id;
                }
            }

            /* 
             * Verify that this assignment belongs to 
             * the listing being requested. 
             * 
             * This requires the assignment to know which 
             * listing it was created for.
             */ 
            if (employee.ListingId != request.ListingId) 
                throw new InvalidOperationException("The assignment does not belong to this listing."); 
            
            var inquiry = new Inquiry
            {
                ListingId = request.ListingId,
                EmployeeId = employee.EmployeeId,
                CustomerId = request.CustomerId,
                CustomerName = request.CustomerName,
                CustomerPhone = request.CustomerPhone,
                InquiryStatus = InquiryStatus.New,
                CreatedAt = DateTime.UtcNow
            }; 
            
            _db.Inquiries.Add(inquiry);

            var listing = await _db.Listings.FindAsync(request.ListingId);
            if (listing != null)
                listing.InquiresCount++;

            await _hub.Clients.All.SendAsync("InquiryCreated", new
            {
                inquiry.Id,
                request.CustomerName,
                request.ListingId
            });

            await _db.SaveChangesAsync(cancellationToken);

            return new InquiryDto
            {
                Id = inquiry.Id,
                ListingId = inquiry.ListingId,
                EmployeeId = inquiry.EmployeeId,
                CustomerId = inquiry.CustomerId,
                CustomerName = inquiry.CustomerName,
                CustomerPhone = inquiry.CustomerPhone,
                Status = inquiry.InquiryStatus.ToString(),
                CreatedAt = inquiry.CreatedAt
            };
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
                EmployeeId = inquiry.EmployeeId,
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
