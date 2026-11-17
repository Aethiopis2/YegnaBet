using Microsoft.EntityFrameworkCore;
using YegnaBet.API.Modules.Employee.Dtos;
using YegnaBet.Domain.Entities;
using YegnaBet.Domain.Enums;
using YegnaBet.Infrastructure.Persistence;

namespace YegnaBet.API.Modules.Employee.Services;

public sealed class EmployeeDealService(BrokerDbContext db)
{
    private const string CommissionTransactionType = "commission_earned";

    public async Task<EmployeeDealPageDto> GetPage(
        long employeeId,
        EmployeeDealQueryDto request,
        CancellationToken cancellationToken)
    {
        var page = Math.Max(request.Page, 0);
        var pageSize = Math.Clamp(request.PageSize, 1, 30);
        var query = db.Deals.AsNoTracking().Where(deal => deal.EmployeeId == employeeId);

        if (request.Status.HasValue)
            query = query.Where(deal => deal.DealStatus == request.Status.Value);

        var search = request.Search?.Trim();
        if (!string.IsNullOrWhiteSpace(search))
        {
            var pattern = $"%{search}%";
            query = query.Where(deal =>
                EF.Functions.ILike(deal.Listing.Title, pattern) ||
                EF.Functions.ILike(deal.Inquiry.Customer.FullName, pattern) ||
                EF.Functions.ILike(deal.Inquiry.Customer.PhoneNumber, pattern));
        }

        var count = await query.CountAsync(cancellationToken);
        var rows = await query
            .OrderBy(deal => deal.DealStatus == DealStatus.Pending ? 0 : deal.DealStatus == DealStatus.Successful ? 1 : 2)
            .ThenByDescending(deal => deal.CompletedAt)
            .ThenByDescending(deal => deal.Inquiry.CreatedAt)
            .Skip(page * pageSize)
            .Take(pageSize + 1)
            .Select(deal => new EmployeeDealDto
            {
                Id = deal.Id,
                InquiryId = deal.InquiryId,
                ListingId = deal.ListingId,
                ListingTitle = deal.Listing.Title,
                ListingLocation = deal.Listing.Location.City + ", " + deal.Listing.Location.Area,
                CustomerName = deal.Inquiry.Customer.FullName,
                CustomerPhone = deal.Inquiry.Customer.PhoneNumber,
                DealValue = deal.DealValue,
                CommissionRate = deal.CommissionRate,
                CommissionAmount = deal.CommissionAmount,
                Status = deal.DealStatus,
                CompletedAt = deal.CompletedAt
            })
            .ToListAsync(cancellationToken);

        var hasMore = rows.Count > pageSize;
        if (hasMore) rows.RemoveAt(rows.Count - 1);

        return new EmployeeDealPageDto
        {
            Items = rows,
            Page = page,
            PageSize = pageSize,
            HasMore = hasMore,
            TotalCount = count
        };
    }

    public async Task<EmployeeDealDto> Update(
        long employeeId,
        long dealId,
        UpdateEmployeeDealRequest request,
        CancellationToken cancellationToken)
    {
        if (!Enum.IsDefined(request.Status))
            throw new ArgumentOutOfRangeException(nameof(request.Status), "Invalid deal status.");
        if (request.DealValue <= 0)
            throw new ArgumentOutOfRangeException(nameof(request.DealValue), "Negotiated price must be greater than zero.");
        if (request.CommissionRate < 0 || request.CommissionRate > 100)
            throw new ArgumentOutOfRangeException(nameof(request.CommissionRate), "Commission rate must be between 0 and 100.");

        var deal = await db.Deals
            .Include(item => item.Inquiry)
            .Include(item => item.Listing)
            .FirstOrDefaultAsync(item => item.Id == dealId && item.EmployeeId == employeeId,
                cancellationToken)
            ?? throw new KeyNotFoundException("Deal was not found.");

        if (deal.DealStatus == DealStatus.Successful && request.Status != DealStatus.Successful)
            throw new InvalidOperationException("A completed deal cannot be moved back to an in-progress state.");

        var wasSuccessful = deal.DealStatus == DealStatus.Successful;
        deal.DealValue = request.DealValue;
        deal.CommissionRate = request.CommissionRate;
        deal.CommissionAmount = Math.Round(request.DealValue * request.CommissionRate / 100m,
            2, MidpointRounding.AwayFromZero);
        deal.DealStatus = request.Status;

        if (request.Status == DealStatus.Successful)
        {
            deal.CompletedAt ??= DateTime.UtcNow;
            if (!wasSuccessful)
            {
                deal.Listing.SuccessfulDeals += 1;
                deal.Listing.TrustScore = Math.Min(100m, deal.Listing.TrustScore + 1m);
            }
            await UpsertCommissionTransaction(deal, cancellationToken);
            deal.Inquiry.InquiryStatus = InquiryStatus.Completed;
        }
        else
        {
            deal.CompletedAt = null;
            if (deal.DealStatus == DealStatus.Pending)
                deal.Inquiry.InquiryStatus = InquiryStatus.Negotiating;
            else if (deal.DealStatus == DealStatus.Failed)
                deal.Inquiry.InquiryStatus = InquiryStatus.Cancelled;
        }

        await db.SaveChangesAsync(cancellationToken);
        return await GetOne(dealId, employeeId, cancellationToken);
    }

    public async Task Remove(long employeeId, long dealId, CancellationToken cancellationToken)
    {
        var deal = await db.Deals
            .Include(item => item.Inquiry)
            .FirstOrDefaultAsync(item => item.Id == dealId && item.EmployeeId == employeeId,
                cancellationToken)
            ?? throw new KeyNotFoundException("Deal was not found.");

        if (deal.DealStatus == DealStatus.Successful)
            throw new InvalidOperationException("Completed deals are kept with their financial records.");

        db.Deals.Remove(deal);
        if (deal.Inquiry.InquiryStatus == InquiryStatus.Negotiating)
            deal.Inquiry.InquiryStatus = InquiryStatus.New;
        await db.SaveChangesAsync(cancellationToken);
    }

    private async Task UpsertCommissionTransaction(Deal deal, CancellationToken cancellationToken)
    {
        var transaction = await db.FinancialTransactions.FirstOrDefaultAsync(item => item.DealId == deal.Id,
            cancellationToken);
        if (transaction is null)
        {
            db.FinancialTransactions.Add(new FinancialTransaction
            {
                Deal = deal,
                TransactionType = CommissionTransactionType,
                Amount = deal.CommissionAmount,
                Currency = "ETB"
            });
            return;
        }

        transaction.TransactionType = CommissionTransactionType;
        transaction.Amount = deal.CommissionAmount;
    }

    private async Task<EmployeeDealDto> GetOne(long dealId, long employeeId, CancellationToken cancellationToken)
    {
        return await db.Deals.AsNoTracking()
            .Where(deal => deal.Id == dealId && deal.EmployeeId == employeeId)
            .Select(deal => new EmployeeDealDto
            {
                Id = deal.Id,
                InquiryId = deal.InquiryId,
                ListingId = deal.ListingId,
                ListingTitle = deal.Listing.Title,
                ListingLocation = deal.Listing.Location.City + ", " + deal.Listing.Location.Area,
                CustomerName = deal.Inquiry.Customer.FullName,
                CustomerPhone = deal.Inquiry.Customer.PhoneNumber,
                DealValue = deal.DealValue,
                CommissionRate = deal.CommissionRate,
                CommissionAmount = deal.CommissionAmount,
                Status = deal.DealStatus,
                CompletedAt = deal.CompletedAt
            })
            .FirstAsync(cancellationToken);
    }
}
