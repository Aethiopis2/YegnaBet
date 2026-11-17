using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using System.Text.RegularExpressions;
using YegnaBet.API.Modules.Configuration;
using YegnaBet.API.Modules.Employee.Dtos;
using YegnaBet.API.Modules.Provider.Dtos;
using YegnaBet.Domain.Entities;
using YegnaBet.Domain.Enums;
using YegnaBet.Infrastructure.Persistence;

namespace YegnaBet.API.Modules.Employee.Services;

public class EmployeeService
{
    private readonly BrokerDbContext _db;
    private readonly IWebHostEnvironment _environment;
    private readonly BusinessSettings _businessSettings;
    private readonly IPasswordHasher<User> _passwordHasher;

    public EmployeeService(BrokerDbContext db, IWebHostEnvironment environment,
        IOptions<BusinessSettings> businessSettings,
        IPasswordHasher<User> passwordHasher)
    {
        _db = db;
        _environment = environment;
        _businessSettings = businessSettings.Value;
        _passwordHasher = passwordHasher;
    } // end EmployeeService


    public async Task<EmployeeDashboardDto> GetDashboardStats(long empId)
    {
        var timezone = TimeZoneInfo.FindSystemTimeZoneById(
            OperatingSystem.IsWindows()
                ? "E. Africa Standard Time"
                : "Africa/Addis_Ababa"
        );

        var localNow = TimeZoneInfo.ConvertTimeFromUtc(
            DateTime.UtcNow,
            timezone
        );

        var today = DateOnly.FromDateTime(localNow);

        DateTime ToUtc(DateOnly date)
        {
            var localDate = DateTime.SpecifyKind(
                date.ToDateTime(TimeOnly.MinValue),
                DateTimeKind.Unspecified
            );

            return TimeZoneInfo.ConvertTimeToUtc(localDate, timezone);
        }

        var startToday = ToUtc(today);
        var startTomorrow = ToUtc(today.AddDays(1));
        var startYesterday = ToUtc(today.AddDays(-1));

        var startWeek = ToUtc(today.AddDays(-6));


        // BASE QUERY

        var inquiries = _db.Inquiries
            .AsNoTracking()
            .Where(x => x.EmployeeId == empId);


        // STATISTICS

        var newRequests = await inquiries.CountAsync(x =>
            x.CreatedAt >= startToday &&
            x.CreatedAt < startTomorrow
        );

        var previousDayRequests = await inquiries.CountAsync(x =>
            x.CreatedAt >= startYesterday &&
            x.CreatedAt < startToday
        );

        var activeRequests = await inquiries.CountAsync(x =>
            x.InquiryStatus != InquiryStatus.Cancelled &&
            x.InquiryStatus != InquiryStatus.Completed
        );

        var completedRequests = await inquiries.CountAsync(x =>
            x.InquiryStatus == InquiryStatus.Completed
        );

        var needsAttention = await inquiries.CountAsync(x =>
            x.InquiryStatus == InquiryStatus.New
        );


        // REQUEST GROWTH

        double requestGrowth = previousDayRequests == 0
            ? (newRequests > 0 ? 100 : 0)
            : (newRequests - previousDayRequests)
                * 100.0 / previousDayRequests;


        // WEEKLY ACTIVITY

        var timestamps = await inquiries
            .Where(x =>
                x.CreatedAt >= startWeek &&
                x.CreatedAt < startTomorrow
            )
            .Select(x => x.CreatedAt)
            .ToListAsync();

        var dailyCounts = timestamps
            .Select(t => TimeZoneInfo.ConvertTimeFromUtc(t, timezone))
            .GroupBy(t => DateOnly.FromDateTime(t))
            .ToDictionary(g => g.Key, g => g.Count());

        var weeklyActivity = Enumerable.Range(0, 7)
            .Select(offset =>
            {
                var date = today.AddDays(offset - 6);

                return new DailyInquiryTrendDto
                {
                    Date = date,
                    Count = dailyCounts.GetValueOrDefault(date)
                };
            })
            .ToList();


        // RECENT REQUESTS

        var recentRequests = await inquiries
            .Where(x => x.InquiryStatus != InquiryStatus.Cancelled)
            .OrderByDescending(x => x.CreatedAt)
            .Take(4)
            .Select(x => new EmployeeInquiryDto
            {
                Id = x.Id,
                ListingId = x.ListingId,
                CustomerName = x.Customer.FullName,
                ListingTitle = x.Listing.Title,
                Status = x.InquiryStatus,
                CreatedAt = x.CreatedAt
            })
            .ToListAsync();


        // ACTIVE REQUESTS

        var activeInquiryRequests = await inquiries
            .Where(x =>
                x.InquiryStatus != InquiryStatus.Cancelled &&
                x.InquiryStatus != InquiryStatus.Completed
            )
            .OrderByDescending(x => x.CreatedAt)
            .Take(4)
            .Select(x => new EmployeeInquiryDto
            {
                Id = x.Id,
                ListingId = x.ListingId,
                CustomerName = x.Customer.FullName,
                ListingTitle = x.Listing.Title,
                Status = x.InquiryStatus,
                CreatedAt = x.CreatedAt
            })
            .ToListAsync();


        // FINAL RESPONSE

        return new EmployeeDashboardDto
        {
            Stats = new EmployeeDashboardStatsDto
            {
                NewRequests = newRequests,
                ActiveRequests = activeRequests,
                CompletedRequests = completedRequests,
                NeedsAttention = needsAttention,
                RequestGrowth = Math.Round(requestGrowth, 1)
            },

            WeeklyActivities = weeklyActivity,

            RecentRequests = recentRequests,

            ActiveRequests = activeInquiryRequests
        };
    } // end GetDashboardStats


    public async Task<long> CreateListing(long providerId, ListingDraftDto draft)
    {
        var listingProviderId = await ResolveListingProvider(providerId, draft.Provider);
        // make sure location does not exist, and store as lower case
        string city = draft.City.ToLower();
        string area = draft.Area.ToLower();
        string? subArea = draft.SubArea?.ToLower();

        var normalizedCity = Normalize(city);
        var normalizedArea = Normalize(area);
        var normalizedSubArea = Normalize(subArea);

        var location = await _db.Locations
            .AsNoTracking()
            .FirstOrDefaultAsync(x =>
                Regex.Replace(x.City.ToLower(), @"\s+", " ").Trim() == normalizedCity &&
                Regex.Replace(x.Area.ToLower(), @"\s+", " ").Trim() == normalizedArea &&
                (subArea == null ||
                 Regex.Replace(x.SubArea!.ToLower(), @"\s+", " ").Trim() == normalizedSubArea));

        if (location == null)
        {
            // Create location
            location = new Location
            {
                City = draft.City,
                Area = draft.Area,
                SubArea = draft.SubArea,
            };

            await _db.Locations.AddAsync(location);
            await _db.SaveChangesAsync();
        } // end create new

        // Upload new photos and get the generated filenames back
        var uploadedPhotos = await UploadPhotos(draft);

        // Load taxonomy node
        var taxonomyNode = await _db.TaxonomyNode
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == draft.TaxonomyId);

        if (taxonomyNode is null)
            throw new InvalidOperationException(
                $"Taxonomy node {draft.TaxonomyId} was not found."
            );

        // Load all attribute definitions in one query
        var attributeNames = draft.Attributes
            .Select(x => x.Name)
            .Distinct()
            .ToList();

        var attributeDefinitions = await _db.AttributeDefinition
            .AsNoTracking()
            .Where(x => attributeNames.Contains(x.Name))
            .ToDictionaryAsync(x => x.Name);

        // Create listing
        var listing = new Listing
        {
            Title = draft.Title,
            Description = draft.Description,
            LocationId = location.Id,
            Price = draft.Price,
            PriceUnit = draft.PriceUnit,
            Latitude = draft.Latitude,
            Longitude = draft.Longitude,

            Method = draft.Method switch
            {
                "For sale" => ListingMethod.Buy,
                "For rent" => ListingMethod.Rent,
                "Service" => ListingMethod.Service,
                _ => ListingMethod.Contract
            },

            ListingStatus = ListingStatus.Draft,
            ProviderId = listingProviderId,

            Images = uploadedPhotos
                .Select(x => new ListingImage
                {
                    ImageUrl = $"/uploads/images/{x.FileName}",
                    IsPrimary = x.IsPrimary,
                    Kind = ImageKind.Photo
                })
                .Concat(draft.Videos.Select(video => video.Url)
                    .Concat(draft.VideoUrls)
                    .Where(url => !string.IsNullOrWhiteSpace(url))
                    .Select(url => new ListingImage
                    {
                        ImageUrl = url.Trim(),
                        IsPrimary = false,
                        Kind = ImageKind.Video
                    }))
                .ToList(),

            AttributeValues = draft.Attributes
                .Select(attr =>
                {
                    if (!attributeDefinitions.TryGetValue(
                            attr.Name,
                            out var definition))
                    {
                        throw new InvalidOperationException(
                            $"Attribute definition '{attr.Name}' was not found."
                        );
                    }

                    return new ListingAttributeValue
                    {
                        AttributeDefinition = definition,
                        Value = attr.Value
                    };
                })
                .ToList()
        };

        await _db.Listings.AddAsync(listing);
        await _db.SaveChangesAsync();

        return listing.Id;
    } // end CreateListing


    public async Task<List<EmployeeRequestDto>> GetEmployeeRequest(long userId)
    {
        var requests = await _db.Inquiries
            .AsNoTracking()
            .Where(x => x.EmployeeId == userId)
            .Select(r => new EmployeeRequestDto
            {
                Id = r.Id,
                CreatedAt = r.CreatedAt.ToLongDateString(),
                Customer = new CustomerSm
                {
                    Id = r.CustomerId,
                    Name = r.Customer.FullName,
                    PhoneNumber = r.Customer.PhoneNumber,
                    Email = r.Customer.Email,
                },
                Listing = new ListingSm
                {
                    Id = r.ListingId,
                    Title = r.Listing.Title,
                    Category = r.Listing.TaxonomyNodes
                        .Select(node => node.TaxonomyNode.Name)
                        .FirstOrDefault() ?? string.Empty,
                    Location = r.Listing.Location.City + ", " + r.Listing.Location.Area,
                    Price = r.Listing.Price,
                    ImageUrl = r.Listing.Images.Select(image => image.ImageUrl).FirstOrDefault(),
                },
                Status = r.InquiryStatus
            })
            .ToListAsync();

        return requests;
    } // end GetEmployeeRequest


    public async Task<EmployeeRequestDto> UpdateInquiryState(long employeeId, long inquiryId, InquiryStatus status,
        decimal? dealValue)
    {
        var inquiry = await _db.Inquiries
            .Include(x => x.Listing)
            .FirstOrDefaultAsync(x => x.Id == inquiryId && x.EmployeeId == employeeId);

        if (inquiry == null)
            throw new BadHttpRequestException("Inquiry not found");

        var deal = await _db.Deals.FirstOrDefaultAsync(x => x.InquiryId == inquiry.Id);
        var wasSuccessful = deal?.DealStatus == DealStatus.Successful;
        if (wasSuccessful && status != InquiryStatus.Completed)
            throw new InvalidOperationException("A completed deal cannot be moved back to an in-progress inquiry state.");

        if (status == InquiryStatus.Negotiating)
        {
            if (deal is null)
            {
                var initialValue = dealValue.GetValueOrDefault() > 0
                    ? dealValue.GetValueOrDefault()
                    : inquiry.Listing.Price.GetValueOrDefault();
                var rate = _businessSettings.CommissionPercentage;
                if (rate < 0 || rate > 100)
                    throw new InvalidOperationException("Invalid business commission configuration.");

                deal = new Deal
                {
                    InquiryId = inquiry.Id,
                    ListingId = inquiry.ListingId,
                    EmployeeId = inquiry.EmployeeId,
                    DealValue = initialValue,
                    CommissionRate = rate,
                    CommissionAmount = Math.Round(initialValue * rate / 100m, 2, MidpointRounding.AwayFromZero),
                    DealStatus = DealStatus.Pending
                };
                _db.Deals.Add(deal);
            }
            else if (deal.DealStatus != DealStatus.Successful)
            {
                deal.DealStatus = DealStatus.Pending;
                if (dealValue.GetValueOrDefault() > 0) deal.DealValue = dealValue.GetValueOrDefault();
                deal.CommissionAmount = Math.Round(deal.DealValue * deal.CommissionRate / 100m,
                    2, MidpointRounding.AwayFromZero);
            }
        }
        else if (status == InquiryStatus.Completed && inquiry.InquiryStatus != InquiryStatus.Completed)
        {
            var negotiatedPrice = dealValue.GetValueOrDefault() > 0
                ? dealValue.GetValueOrDefault()
                : deal is not null && deal.DealValue > 0
                    ? deal.DealValue
                    : inquiry.Listing.Price.GetValueOrDefault();
            if (negotiatedPrice <= 0)
                throw new BadHttpRequestException("Enter a negotiated price greater than zero before completing the deal.");

            var commissionRate = deal?.CommissionRate ?? _businessSettings.CommissionPercentage;
            if (commissionRate < 0 || commissionRate > 100)
                throw new InvalidOperationException("Invalid business commission configuration.");

            if (deal is null)
            {
                deal = new Deal
                {
                    InquiryId = inquiry.Id,
                    ListingId = inquiry.ListingId,
                    EmployeeId = inquiry.EmployeeId
                };
                _db.Deals.Add(deal);
            }

            deal.DealValue = negotiatedPrice;
            deal.CommissionRate = commissionRate;
            deal.CommissionAmount = Math.Round(negotiatedPrice * commissionRate / 100m,
                2, MidpointRounding.AwayFromZero);
            deal.DealStatus = DealStatus.Successful;
            deal.CompletedAt = DateTime.UtcNow;

            if (!wasSuccessful)
            {
                inquiry.Listing.SuccessfulDeals += 1;
                inquiry.Listing.TrustScore = Math.Min(100m, inquiry.Listing.TrustScore + 1m);
            }

            var transaction = deal.Id > 0
                ? await _db.FinancialTransactions.FirstOrDefaultAsync(x => x.DealId == deal.Id)
                : null;
            if (transaction is null)
            {
                _db.FinancialTransactions.Add(new FinancialTransaction
                {
                    Deal = deal,
                    TransactionType = "commission_earned",
                    Amount = deal.CommissionAmount,
                    Currency = "ETB"
                });
            }
            else
            {
                transaction.TransactionType = "commission_earned";
                transaction.Amount = deal.CommissionAmount;
            }
        }
        else if (status == InquiryStatus.Cancelled && deal?.DealStatus == DealStatus.Pending)
        {
            deal.DealStatus = DealStatus.Failed;
        }

        inquiry.InquiryStatus = status;

        await _db.SaveChangesAsync();
;
        return await _db.Inquiries
            .AsNoTracking()
            .Where(x => x.Id == inquiryId)
            .Select(r => new EmployeeRequestDto
            {
                Id = r.Id,
                CreatedAt = r.CreatedAt.ToLongDateString(),
                Customer = new CustomerSm
                {
                    Id = r.CustomerId,
                    Name = r.Customer.FullName,
                    PhoneNumber = r.Customer.PhoneNumber,
                    Email = r.Customer.Email,
                },
                Listing = new ListingSm
                {
                    Id = r.ListingId,
                    Title = r.Listing.Title,
                    Category = r.Listing.TaxonomyNodes.First().TaxonomyNode.Name,
                    Location = r.Listing.Location.City + ", " + r.Listing.Location.Area,
                    Price = r.Listing.Price,
                    ImageUrl = r.Listing.Images.First().ImageUrl,
                },
                Status = r.InquiryStatus
            })
            .FirstAsync();
    } // end UpdateInquiry


    public async Task<List<ProviderTaxonomyDto>> GetTaxonomyShortAsync(CancellationToken cancellationToken = default)
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
    } // end EmployeeTaxonomyShort


    public async Task<object> GetNodeAttributes(long nodeId)
    {
        var attrbs = await _db.TaxonomyNode
            .AsNoTracking()
            .Where(n => n.Id == nodeId)
            .SelectMany(n => n.Attributes)
            .Select(a => new ProviderTaxonomyNodeAttributeDto
            {
                Id = a.AttributeDefinition.Id,
                Key = a.AttributeDefinition.Name.ToLower(),
                Label = a.AttributeDefinition.Name,
                Type = a.AttributeDefinition.DataType.ToString()
            })
            .ToListAsync();

        return attrbs;
    } // end GetNodeAttributes




    private async Task<List<(string FileName, bool IsPrimary)>> UploadPhotos(
            ListingDraftDto dto)
    {
        var uploadDirectory = Path.Combine(
            _environment.WebRootPath,
            "uploads",
            "images"
        );

        Directory.CreateDirectory(uploadDirectory);

        var uploadedPhotos = new List<(string FileName, bool IsPrimary)>();

        foreach (var photo in dto.Photos)
        {
            // Existing photos / photos without a new file are skipped.
            if (photo.File is null || photo.File.Length == 0)
                continue;

            var extension = Path.GetExtension(photo.File.FileName);

            var fileName = $"{Guid.NewGuid():N}{extension}";

            var filePath = Path.Combine(
                uploadDirectory,
                fileName
            );

            await using var stream = new FileStream(
                filePath,
                FileMode.Create
            );

            await photo.File.CopyToAsync(stream);

            uploadedPhotos.Add(
                (fileName, photo.IsPrimary)
            );
        }

        return uploadedPhotos;
    } // end UploadPhotos


    private async Task<long> ResolveListingProvider(long employeeId, ListingProviderDraftDto? providerDraft)
    {
        if (providerDraft is null) return employeeId;
        if (providerDraft.ProviderId.HasValue)
        {
            var existing = await _db.Users.FirstOrDefaultAsync(user =>
                user.Id == providerDraft.ProviderId.Value && user.Role == UserRole.Provider && user.IsActive);
            if (existing is null) throw new ArgumentException("The selected provider account was not found or is inactive.");
            return existing.Id;
        }

        var fullName = providerDraft.FullName?.Trim();
        var phone = providerDraft.PhoneNumber?.Trim();
        var email = providerDraft.Email?.Trim().ToLowerInvariant();
        var password = providerDraft.Password;
        if (string.IsNullOrWhiteSpace(fullName) || string.IsNullOrWhiteSpace(phone) ||
            string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password))
            throw new ArgumentException("Provider name, phone, email, and password are required.");
        if (password.Length < 6) throw new ArgumentException("Provider password must be at least 6 characters.");
        if (await _db.Users.AnyAsync(user => user.PhoneNumber == phone ||
            (user.Email != null && user.Email.ToLower() == email)))
            throw new ArgumentException("A user with that phone number or email already exists. Select the existing provider instead.");

        var provider = new User
        {
            Role = UserRole.Provider,
            FullName = fullName,
            PhoneNumber = phone,
            Email = email,
            IsActive = true,
            IsVerified = false,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        provider.PasswordHash = _passwordHasher.HashPassword(provider, password);
        _db.Users.Add(provider);
        await _db.SaveChangesAsync();
        return provider.Id;
    }
    private static string Normalize(string? value)
    {
        return string.Join(" ",
            (value ?? string.Empty)
                .Split(' ', StringSplitOptions.RemoveEmptyEntries))
            .ToLowerInvariant();
    }

}
