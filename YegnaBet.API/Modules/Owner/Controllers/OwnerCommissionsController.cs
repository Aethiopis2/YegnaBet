using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using YegnaBet.API.Modules.Owner.Dtos;
using YegnaBet.Domain.Entities;
using YegnaBet.Domain.Enums;
using YegnaBet.Infrastructure.Persistence;

namespace YegnaBet.API.Modules.Owner.Controllers;

[ApiController]
[Authorize(Roles = "Owner")]
[Route("api/owner/commissions")]
public sealed class OwnerCommissionsController(BrokerDbContext db) : ControllerBase
{
    private IQueryable<FinancialTransaction> CommissionTransactions() => db.FinancialTransactions
        .AsNoTracking()
        .Where(transaction => transaction.TransactionType == "commission_earned" &&
            transaction.Deal != null && transaction.Deal.DealStatus == DealStatus.Successful);

    private IQueryable<FinancialTransaction> WithDetails() => CommissionTransactions()
        .Include(transaction => transaction.Deal!).ThenInclude(deal => deal.Listing).ThenInclude(listing => listing.Provider)
        .Include(transaction => transaction.Deal!).ThenInclude(deal => deal.Listing).ThenInclude(listing => listing.Location)
        .Include(transaction => transaction.Deal!).ThenInclude(deal => deal.Listing).ThenInclude(listing => listing.Images)
        .Include(transaction => transaction.Deal!).ThenInclude(deal => deal.Listing).ThenInclude(listing => listing.TaxonomyNodes).ThenInclude(node => node.TaxonomyNode)
        .Include(transaction => transaction.Deal!).ThenInclude(deal => deal.Listing).ThenInclude(listing => listing.AttributeValues).ThenInclude(value => value.AttributeDefinition)
        .Include(transaction => transaction.Deal!).ThenInclude(deal => deal.Employee)
        .Include(transaction => transaction.Deal!).ThenInclude(deal => deal.Inquiry).ThenInclude(inquiry => inquiry.Customer);

    [HttpGet]
    public async Task<ActionResult<OwnerCommissionPageDto>> GetPage(
        [FromQuery] OwnerCommissionQueryDto request,
        CancellationToken cancellationToken)
    {
        if (request.MinAmount < 0 || request.MaxAmount < 0)
            return BadRequest(new { message = "Commission amount filters cannot be negative." });
        if (request.MinAmount.HasValue && request.MaxAmount.HasValue && request.MinAmount > request.MaxAmount)
            return BadRequest(new { message = "Minimum amount cannot exceed maximum amount." });
        if (!string.IsNullOrWhiteSpace(request.Method) &&
            !Enum.TryParse<ListingMethod>(request.Method, true, out _))
            return BadRequest(new { message = "Invalid listing method." });

        var page = Math.Max(0, request.Page);
        var pageSize = Math.Clamp(request.PageSize, 1, 30);
        var query = CommissionTransactions();
        if (!string.IsNullOrWhiteSpace(request.Method) &&
            Enum.TryParse<ListingMethod>(request.Method, true, out var method))
            query = query.Where(transaction => transaction.Deal!.Listing.Method == method);
        if (request.MinAmount.HasValue)
            query = query.Where(transaction => transaction.Amount >= request.MinAmount.Value);
        if (request.MaxAmount.HasValue)
            query = query.Where(transaction => transaction.Amount <= request.MaxAmount.Value);
        if (request.From.HasValue)
        {
            var from = DateTime.SpecifyKind(request.From.Value.Date, DateTimeKind.Utc);
            query = query.Where(transaction => transaction.CreatedAt >= from);
        }
        if (request.To.HasValue)
        {
            var to = DateTime.SpecifyKind(request.To.Value.Date.AddDays(1), DateTimeKind.Utc);
            query = query.Where(transaction => transaction.CreatedAt < to);
        }
        var search = request.Search?.Trim();
        if (!string.IsNullOrWhiteSpace(search))
        {
            var pattern = $"%{search}%";
            query = query.Where(transaction =>
                EF.Functions.ILike(transaction.Deal!.Listing.Title, pattern) ||
                EF.Functions.ILike(transaction.Deal.Listing.Provider.FullName, pattern) ||
                EF.Functions.ILike(transaction.Deal.Employee.FullName, pattern) ||
                (transaction.ReferenceNumber != null && EF.Functions.ILike(transaction.ReferenceNumber, pattern)) ||
                transaction.Deal.Listing.TaxonomyNodes.Any(node => EF.Functions.ILike(node.TaxonomyNode.Name, pattern)));
        }

        var totalCount = await query.CountAsync(cancellationToken);
        var totalAmount = await query.SumAsync(transaction => (decimal?)transaction.Amount, cancellationToken) ?? 0m;
        var transactions = await WithDetails()
            .Where(transaction => query.Select(item => item.Id).Contains(transaction.Id))
            .OrderByDescending(transaction => transaction.CreatedAt)
            .ThenByDescending(transaction => transaction.Id)
            .Skip(page * pageSize).Take(pageSize)
            .ToListAsync(cancellationToken);

        return Ok(new OwnerCommissionPageDto
        {
            Items = transactions.Select(ToListItem).ToList(),
            Page = page,
            PageSize = pageSize,
            TotalCount = totalCount,
            HasMore = (page + 1) * pageSize < totalCount,
            TotalAmount = totalAmount
        });
    }

    [HttpGet("{transactionId:long}")]
    public async Task<ActionResult<OwnerCommissionDetailDto>> GetDetail(
        long transactionId,
        CancellationToken cancellationToken)
    {
        var transaction = await WithDetails().FirstOrDefaultAsync(item => item.Id == transactionId, cancellationToken);
        if (transaction?.Deal is null) return NotFound(new { message = "Commission record was not found." });
        var deal = transaction.Deal;
        var listing = deal.Listing;
        var customer = deal.Inquiry?.Customer;
        return Ok(new OwnerCommissionDetailDto
        {
            Commission = ToListItem(transaction),
            ReferenceNumber = transaction.ReferenceNumber,
            ListingDescription = listing.Description,
            ListingPrice = listing.Price,
            PriceUnit = listing.PriceUnit,
            City = listing.Location.City,
            Area = listing.Location.Area,
            SubArea = listing.Location.SubArea,
            DealCompletedAt = deal.CompletedAt,
            DealStatus = deal.DealStatus.ToString(),
            Media = listing.Images.Select(image => new OwnerCommissionMediaDto
            {
                Url = image.ImageUrl,
                Kind = image.Kind.ToString().ToLowerInvariant(),
                IsPrimary = image.IsPrimary
            }).ToList(),
            Attributes = listing.AttributeValues.Select(attribute => new OwnerCommissionAttributeDto
            {
                Name = attribute.AttributeDefinition.Name,
                Value = attribute.Value
            }).ToList(),
            Provider = ToPerson(listing.Provider),
            Employee = ToPerson(deal.Employee),
            Customer = customer is null ? null : ToPerson(customer)
        });
    }

    private static OwnerCommissionListItemDto ToListItem(FinancialTransaction transaction)
    {
        var deal = transaction.Deal!;
        var listing = deal.Listing;
        var category = listing.TaxonomyNodes
            .Select(node => node.TaxonomyNode.Name)
            .FirstOrDefault() ?? string.Empty;
        var thumbnail = listing.Images
            .OrderByDescending(image => image.IsPrimary)
            .Where(image => image.Kind == ImageKind.Photo)
            .Select(image => image.ImageUrl)
            .FirstOrDefault();
        return new OwnerCommissionListItemDto
        {
            Id = transaction.Id,
            DealId = deal.Id,
            ListingId = listing.Id,
            ListingTitle = listing.Title,
            Category = category,
            Method = listing.Method.ToString(),
            ListingStatus = listing.ListingStatus.ToString(),
            ProviderName = listing.Provider.FullName,
            EmployeeName = deal.Employee.FullName,
            CommissionAmount = transaction.Amount,
            DealValue = deal.DealValue,
            CommissionRate = deal.CommissionRate,
            Currency = transaction.Currency,
            TransactionDate = transaction.CreatedAt,
            ThumbnailUrl = thumbnail
        };
    }

    private static OwnerCommissionPersonDto ToPerson(User user) => new()
    {
        Id = user.Id,
        FullName = user.FullName,
        PhoneNumber = user.PhoneNumber,
        Email = user.Email,
        Avatar = user.Avatar
    };
}
