
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using YegnaBet.API.Modules.Owner.Dtos;
using YegnaBet.Domain.Enums;
using YegnaBet.Infrastructure.Persistence;

namespace YegnaBet.API.Controllers;

[ApiController]
[Route("api/owner/dashboard")]
[Authorize(Roles = "Owner")]
public sealed class OwnerDashboardController : ControllerBase
{
    private readonly BrokerDbContext _db;

    public OwnerDashboardController(BrokerDbContext db)
    {
        _db = db;
    }

    [HttpGet("summary")]
    public async Task<ActionResult<OwnerDashboardSummaryDto>> GetSummary(
        [FromQuery] string period = "30d",
        CancellationToken cancellationToken = default)
    {
        var now = DateTime.UtcNow;

        var days = period.ToLowerInvariant() switch
        {
            "7d" => 7,
            "30d" => 30,
            "90d" => 90,
            "12m" => 365,
            _ => 30
        };

        var from = now.AddDays(-days);
        var previousFrom = from.AddDays(-days);

        // Current inventory snapshot
        var listings = _db.Listings.AsNoTracking();

        // Current active account counts
        var users = _db.Users
            .AsNoTracking()
            .Where(x => x.IsActive);

        // Period-based inquiries
        var inquiries = _db.Inquiries
            .AsNoTracking()
            .Where(x => x.CreatedAt >= from &&
                        x.CreatedAt <= now);

        // Period-based deals
        var deals = _db.Deals
            .AsNoTracking()
            .Where(x => x.DealStatus == DealStatus.Successful &&
                        x.CompletedAt >= from &&
                        x.CompletedAt <= now);

        // Previous equivalent period
        var previousDeals = _db.Deals
            .AsNoTracking()
            .Where(x => x.DealStatus == DealStatus.Successful &&
                        x.CompletedAt >= previousFrom &&
                        x.CompletedAt < from);

        var totalCommission = await deals
            .SumAsync(x => (decimal?)x.CommissionAmount, cancellationToken)
            ?? 0m;

        var previousCommission = await previousDeals
            .SumAsync(x => (decimal?)x.CommissionAmount, cancellationToken)
            ?? 0m;

        var growth = previousCommission == 0
            ? 0
            : Math.Round(
                (totalCommission - previousCommission)
                / previousCommission * 100m, 2);


        var categories = await _db.TaxonomyNode
            .AsNoTracking()
            .Where(x => x.IsActive && x.Taxonomy.IsActive)
            .Select(x => new DashboardCategoryDto
            {
                Id = x.Id,
                Name = x.Name,
                Taxonomy = x.Taxonomy.Name,
                ListingCount = x.Listings
                    .Select(l => l.ListingId)
                    .Distinct()
                    .Count()
            })
            .OrderByDescending(x => x.ListingCount)
            .ToListAsync(cancellationToken);

        var result = new OwnerDashboardSummaryDto
        {
            Period = period,
            From = from,
            To = now,

            Overview = new DashboardOverviewDto
            {
                TotalListings = await listings.CountAsync(cancellationToken),

                ActiveListings = await listings.CountAsync(
                    x => x.ListingStatus == ListingStatus.Active,
                    cancellationToken),

                PendingListings = await listings.CountAsync(
                    x => x.ListingStatus == ListingStatus.Pending,
                    cancellationToken),

                DraftListings = await listings.CountAsync(
                    x => x.ListingStatus == ListingStatus.Draft,
                    cancellationToken),

                TotalCustomers = await users.CountAsync(
                    x => x.Role == UserRole.Customer,
                    cancellationToken),

                TotalProviders = await users.CountAsync(
                    x => x.Role == UserRole.Provider,
                    cancellationToken),

                ClosedListings = await listings.CountAsync(
                    x => x.ListingStatus == ListingStatus.Closed,
                    cancellationToken),

                CancelledListings = await listings.CountAsync(
                    x => x.ListingStatus == ListingStatus.Cancelled,
                    cancellationToken),

                TotalEmployees = await users.CountAsync(
                    x => x.Role == UserRole.Employee,
                    cancellationToken)
            },

            Inquiries = new DashboardInquiryDto
            {
                Total = await inquiries.CountAsync(cancellationToken),

                New = await inquiries.CountAsync(
                    x => x.InquiryStatus == InquiryStatus.New,
                    cancellationToken),

                Negotiating = await inquiries.CountAsync(
                    x => x.InquiryStatus == InquiryStatus.Negotiating,
                    cancellationToken),

                Completed = await inquiries.CountAsync(
                    x => x.InquiryStatus == InquiryStatus.Completed,
                    cancellationToken),

                Cancelled = await inquiries.CountAsync(
                    x => x.InquiryStatus == InquiryStatus.Cancelled,
                    cancellationToken)
            },

            Deals = new DashboardDealDto
            {
                Total = await _db.Deals
                    .AsNoTracking()
                    .CountAsync(
                        x => x.CompletedAt >= from &&
                             x.CompletedAt <= now,
                        cancellationToken),

                Successful = await deals.CountAsync(cancellationToken),

                Pending = await _db.Deals
                    .AsNoTracking()
                    .CountAsync(
                        x => x.DealStatus == DealStatus.Pending,
                        cancellationToken),

                Failed = await _db.Deals
                    .AsNoTracking()
                    .CountAsync(
                        x => x.DealStatus == DealStatus.Failed,
                        cancellationToken)
            },

            Revenue = new DashboardRevenueDto
            {
                CommissionGenerated = totalCommission,
                PreviousPeriodCommission = previousCommission,
                GrowthPercentage = growth
            },

            Listings = new DashboardListingDto
            {
                Verified = await listings.CountAsync(
                    x => x.IsVerified,
                    cancellationToken),

                Unverified = await listings.CountAsync(
                    x => !x.IsVerified,
                    cancellationToken),

                Featured = await listings.CountAsync(
                    x => x.IsFeatured &&
                         x.FeaturedUntil > now,
                    cancellationToken)
            },

            Categories = categories,
        };

        return Ok(result);
    }



    [HttpGet("allListings")]
    public async Task<ActionResult<List<OwnerListingsDto>>> GetAllListings([FromQuery] ListingStatus status)
    {
        var inquiries = await _db.Listings
            .AsNoTracking()
            .Select(x => new OwnerListingsDto
            {
                Id = x.Id,
                Title = x.Title,
                Category = x.TaxonomyNodes.First().TaxonomyNode.Name,
                Location = x.Location.Area + ", " + x.Location.City,
                Provider = x.Provider.FullName,
                ListingStatus = x.ListingStatus,
                Verified = x.IsVerified,
                Views = x.ViewsCount,
                CreatedAt = x.CreatedAt,
            })
            .ToListAsync();

        return Ok(inquiries);
    }

    [HttpGet("Inquiries")]
    public async Task<ActionResult<List<OwnerListingsDto>>> GetInquiries([FromQuery] ListingStatus status)
    {
        var inquiries = await _db.Inquiries
            .AsNoTracking()
            .Select(x => new OwnerListingsDto
            {
                Id = x.Id,
                Title = x.Listing.Title,
                Category = x.Listing.TaxonomyNodes.First().TaxonomyNode.Name,
                Location = x.Listing.Location.Area + ", " + x.Listing.Location.City,
                Provider = x.Employee.FullName,
                ListingStatus = x.Listing.ListingStatus,
                Verified = x.Listing.IsVerified,
                Views = x.Listing.ViewsCount,
                CreatedAt = x.CreatedAt,
            })
            .ToListAsync();

        return Ok(inquiries);
    }


    [HttpGet("Successful-deals")]
    public async Task<ActionResult<List<OwnerListingsDto>>> GetSuccessfulDeals([FromQuery] ListingStatus status)
    {
        var deals = await _db.Deals
            .AsNoTracking()
            .Where(x => x.DealStatus == DealStatus.Successful)
            .Select(x => new OwnerListingsDto
            {
                Id = x.Id,
                Title = x.Listing.Title,
                Category = x.Listing.TaxonomyNodes.First().TaxonomyNode.Name,
                Location = x.Listing.Location.Area + ", " + x.Listing.Location.City,
                Provider = x.Employee.FullName,
                ListingStatus = x.Listing.ListingStatus,
                Verified = x.Listing.IsVerified,
                Views = x.Listing.ViewsCount,
                CreatedAt = x.CompletedAt ?? DateTime.MinValue,
            })
            .ToListAsync();

        return Ok(deals);
    }


    [HttpGet("Customers")]
    public async Task<ActionResult<List<OwnerListingsDto>>> GetCustomers([FromQuery] ListingStatus status)
    {
        var custs = await _db.UsersEx
            .AsNoTracking()
            .Where(x => x.User.Role == UserRole.Customer)
            .Select(x => new OwnerListingsDto
            {
                Id = x.User.Id,
                Title = x.User.FullName,
                Category = "",
                Location = x.Location.Area + ", " + x.Location.City,
                Provider = "",
                ListingStatus = ListingStatus.Active,
                Verified = x.User.IsVerified,
                Views = _db.Inquiries.Count(z => z.CustomerId == x.UserId),
                CreatedAt = x.User.CreatedAt,
            })
            .ToListAsync();

        return Ok(custs);
    }


    [HttpGet("Providers")]
    public async Task<ActionResult<List<OwnerListingsDto>>> GetProviders([FromQuery] ListingStatus status)
    {
        var provs = await _db.UsersEx
            .AsNoTracking()
            .Where(x => x.User.Role == UserRole.Provider)
            .Select(x => new OwnerListingsDto
            {
                Id = x.User.Id,
                Title = x.User.FullName,
                Category = "",
                Location = x.Location.Area + ", " + x.Location.City,
                Provider = "",
                ListingStatus = ListingStatus.Active,
                Verified = x.User.IsVerified,
                Views = _db.Listings.Count(y => y.ProviderId == x.UserId),
                CreatedAt = x.User.CreatedAt,
            })
            .ToListAsync();

        return Ok(provs);
    }


    [HttpGet("Employees")]
    public async Task<ActionResult<List<OwnerListingsDto>>> GetEmployees([FromQuery] ListingStatus status)
    {
        var emps = await _db.UsersEx
            .AsNoTracking()
            .Where(x => x.User.Role == UserRole.Employee)
            .Select(x => new OwnerListingsDto
            {
                Id = x.User.Id,
                Title = x.User.FullName,
                Category = "",
                Location = x.Location.Area + ", " + x.Location.City,
                Provider = "",
                ListingStatus = ListingStatus.Active,
                Verified = x.User.IsVerified,
                Views = _db.Inquiries.Count(y => y.EmployeeId == x.UserId),
                CreatedAt = x.User.CreatedAt,
            })
            .ToListAsync();

        return Ok(emps);
    }

    [HttpGet("records")]
    public async Task<ActionResult<OwnerRecordsPageDto>> GetRecords(
        [FromQuery] OwnerRecordsQueryDto request,
        CancellationToken cancellationToken)
    {
        var page = Math.Max(0, request.Page);
        var pageSize = Math.Clamp(request.PageSize, 1, 30);
        var search = request.Search?.Trim();
        var pattern = string.IsNullOrWhiteSpace(search) ? null : $"%{search}%";
        var items = new List<OwnerListingsDto>();
        var totalCount = 0;

        if (string.Equals(request.Type, "listings", StringComparison.OrdinalIgnoreCase))
        {
            var query = _db.Listings.AsNoTracking().AsQueryable();
            if (request.ProviderId.HasValue)
                query = query.Where(x => x.ProviderId == request.ProviderId.Value);
            if (!string.IsNullOrWhiteSpace(request.Status) &&
                !request.Status.Equals("All", StringComparison.OrdinalIgnoreCase))
            {
                if (!Enum.TryParse<ListingStatus>(request.Status, true, out var status)) return BadRequest("Invalid listing status.");
                query = query.Where(x => x.ListingStatus == status);
            }
            if (pattern is not null)
                query = query.Where(x => EF.Functions.ILike(x.Title, pattern) ||
                    EF.Functions.ILike(x.Provider.FullName, pattern) ||
                    EF.Functions.ILike(x.Location.Area, pattern) ||
                    EF.Functions.ILike(x.Location.City, pattern) ||
                    x.TaxonomyNodes.Any(node => EF.Functions.ILike(node.TaxonomyNode.Name, pattern)));
            totalCount = await query.CountAsync(cancellationToken);
            var rows = await query.OrderByDescending(x => x.CreatedAt)
                .Skip(page * pageSize).Take(pageSize)
                .Include(x => x.Provider).Include(x => x.Location)
                .Include(x => x.TaxonomyNodes).ThenInclude(x => x.TaxonomyNode)
                .ToListAsync(cancellationToken);
            items = rows.Select(x => new OwnerListingsDto
            {
                Id = x.Id, ListingId = x.Id, Title = x.Title,
                Category = x.TaxonomyNodes.Select(node => node.TaxonomyNode.Name).FirstOrDefault() ?? string.Empty,
                Location = $"{x.Location.Area}, {x.Location.City}", Provider = x.Provider.FullName,
                ListingStatus = x.ListingStatus, Status = x.ListingStatus.ToString(), Verified = x.IsVerified,
                Views = x.ViewsCount, CreatedAt = x.CreatedAt, Price = x.Price ?? 0
            }).ToList();
        }
        else if (string.Equals(request.Type, "inquiries", StringComparison.OrdinalIgnoreCase))
        {
            var query = _db.Inquiries.AsNoTracking().AsQueryable();
            if (!string.IsNullOrWhiteSpace(request.Status) &&
                !request.Status.Equals("All", StringComparison.OrdinalIgnoreCase))
            {
                if (!Enum.TryParse<InquiryStatus>(request.Status, true, out var status)) return BadRequest("Invalid inquiry status.");
                query = query.Where(x => x.InquiryStatus == status);
            }
            if (pattern is not null)
                query = query.Where(x => EF.Functions.ILike(x.Listing.Title, pattern) ||
                    EF.Functions.ILike(x.Customer.FullName, pattern) || EF.Functions.ILike(x.Employee.FullName, pattern));
            if (TryGetPeriodStart(request.Period, out var from)) query = query.Where(x => x.CreatedAt >= from);
            totalCount = await query.CountAsync(cancellationToken);
            var rows = await query.OrderByDescending(x => x.CreatedAt)
                .Skip(page * pageSize).Take(pageSize)
                .Include(x => x.Listing).ThenInclude(x => x.Location)
                .Include(x => x.Listing).ThenInclude(x => x.TaxonomyNodes).ThenInclude(x => x.TaxonomyNode)
                .Include(x => x.Employee).Include(x => x.Customer)
                .ToListAsync(cancellationToken);
            items = rows.Select(x => new OwnerListingsDto
            {
                Id = x.Id, ListingId = x.ListingId, Title = x.Listing.Title,
                Category = x.Listing.TaxonomyNodes.Select(node => node.TaxonomyNode.Name).FirstOrDefault() ?? string.Empty,
                Location = $"{x.Listing.Location.Area}, {x.Listing.Location.City}",
                Provider = $"{x.Customer.FullName} · {x.Employee.FullName}", ListingStatus = x.Listing.ListingStatus,
                Status = x.InquiryStatus.ToString(), Verified = x.Listing.IsVerified, Views = x.Listing.ViewsCount,
                CreatedAt = x.CreatedAt, Price = x.Listing.Price ?? 0
            }).ToList();
        }
        else if (string.Equals(request.Type, "deals", StringComparison.OrdinalIgnoreCase))
        {
            var query = _db.Deals.AsNoTracking().AsQueryable();
            if (!string.IsNullOrWhiteSpace(request.Status) &&
                !request.Status.Equals("All", StringComparison.OrdinalIgnoreCase))
            {
                if (!Enum.TryParse<DealStatus>(request.Status, true, out var status)) return BadRequest("Invalid deal status.");
                query = query.Where(x => x.DealStatus == status);
            }
            if (pattern is not null)
                query = query.Where(x => EF.Functions.ILike(x.Listing.Title, pattern) ||
                    EF.Functions.ILike(x.Employee.FullName, pattern) || EF.Functions.ILike(x.Listing.Provider.FullName, pattern));
            if (string.Equals(request.Status, nameof(DealStatus.Successful), StringComparison.OrdinalIgnoreCase) &&
                TryGetPeriodStart(request.Period, out var from))
                query = query.Where(x => x.CompletedAt >= from);
            totalCount = await query.CountAsync(cancellationToken);
            var rows = await query.OrderByDescending(x => x.CompletedAt)
                .Skip(page * pageSize).Take(pageSize)
                .Include(x => x.Listing).ThenInclude(x => x.Location)
                .Include(x => x.Listing).ThenInclude(x => x.TaxonomyNodes).ThenInclude(x => x.TaxonomyNode)
                .Include(x => x.Listing).ThenInclude(x => x.Provider)
                .Include(x => x.Employee)
                .ToListAsync(cancellationToken);
            items = rows.Select(x => new OwnerListingsDto
            {
                Id = x.Id, ListingId = x.ListingId, Title = x.Listing.Title,
                Category = x.Listing.TaxonomyNodes.Select(node => node.TaxonomyNode.Name).FirstOrDefault() ?? string.Empty,
                Location = $"{x.Listing.Location.Area}, {x.Listing.Location.City}", Provider = x.Listing.Provider.FullName,
                ListingStatus = x.Listing.ListingStatus, Status = x.DealStatus.ToString(), Verified = x.Listing.IsVerified,
                Views = x.Listing.ViewsCount, CreatedAt = x.CompletedAt ?? DateTime.MinValue, Price = x.DealValue
            }).ToList();
        }
        else if (string.Equals(request.Type, "employees", StringComparison.OrdinalIgnoreCase))
        {
            var query = _db.Users.AsNoTracking().Where(x => x.Role == UserRole.Employee);
            if (string.Equals(request.Status, "Inactive", StringComparison.OrdinalIgnoreCase)) query = query.Where(x => !x.IsActive);
            else if (string.Equals(request.Status, "Active", StringComparison.OrdinalIgnoreCase)) query = query.Where(x => x.IsActive);
            if (pattern is not null) query = query.Where(x => EF.Functions.ILike(x.FullName, pattern) || EF.Functions.ILike(x.PhoneNumber, pattern));
            totalCount = await query.CountAsync(cancellationToken);
            var rows = await query.OrderByDescending(x => x.IsActive).ThenBy(x => x.FullName)
                .Skip(page * pageSize).Take(pageSize).ToListAsync(cancellationToken);
            items = rows.Select(x => new OwnerListingsDto
            {
                Id = x.Id, Title = x.FullName, Category = "Employee", Location = string.Empty, Provider = x.PhoneNumber,
                ListingStatus = x.IsActive ? ListingStatus.Active : ListingStatus.Closed,
                Status = x.IsActive ? "Active" : "Inactive", Verified = x.IsVerified, Views = 0, CreatedAt = x.CreatedAt
            }).ToList();
        }
        else return BadRequest("Unsupported dashboard record type.");

        return Ok(new OwnerRecordsPageDto
        {
            Items = items, Page = page, PageSize = pageSize, TotalCount = totalCount,
            HasMore = (page + 1) * pageSize < totalCount
        });
    }

    private static bool TryGetPeriodStart(string? period, out DateTime from)
    {
        var days = period?.ToLowerInvariant() switch { "7d" => 7, "90d" => 90, "12m" => 365, "30d" => 30, _ => 0 };
        from = days > 0 ? DateTime.UtcNow.AddDays(-days) : DateTime.MinValue;
        return days > 0;
    }
}
