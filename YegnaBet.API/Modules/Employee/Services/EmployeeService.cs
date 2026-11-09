using Microsoft.EntityFrameworkCore;
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

    public EmployeeService(BrokerDbContext db, IWebHostEnvironment environment)
    {
        _db = db;
        _environment = environment;
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
        // make sure location does not exist, and store as lower case
        string city = draft.City.ToLower();
        string area = draft.Area.ToLower();
        string? subArea = draft.SubArea?.ToLower();

        var location = _db.Locations
            .AsNoTracking()
            .FirstOrDefault(x => x.City == city && x.Area == area && x.SubArea == subArea);

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
            ProviderId = providerId,

            Images = uploadedPhotos
                .Select(x => new ListingImage
                {
                    ImageUrl = $"/uploads/listings/{x.FileName}",
                    IsPrimary = x.IsPrimary,
                    Kind = ImageKind.Photo
                })
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
                    Category = r.Listing.TaxonomyNodes.First().TaxonomyNode.Name,
                    Location = r.Listing.Location.City + ", " + r.Listing.Location.Area,
                    Price = r.Listing.Price,
                    ImageUrl = r.Listing.Images.First().ImageUrl,
                },
                Status = r.InquiryStatus
            })
            .ToListAsync();

        return requests;
    } // end GetEmployeeRequest


    public async Task<EmployeeRequestDto> UpdateInquiryState(long inquiryId, InquiryStatus status)
    {
        var inquiry = await _db.Inquiries
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == inquiryId);

        if (inquiry == null)
            throw new BadHttpRequestException("Inquiry not found");

        inquiry.InquiryStatus = status;
        _db.Inquiries.Update(inquiry);

        await _db.SaveChangesAsync();
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

}