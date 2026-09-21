using Microsoft.EntityFrameworkCore;
using System.Runtime.InteropServices;
using System.Text.Json;
using YegnaBet.API.Modules.Provider.Dtos;
using YegnaBet.Domain.Entities;
using YegnaBet.Domain.Enums;
using YegnaBet.Infrastructure.Persistence;

namespace YegnaBet.API.Modules.Provider.Services
{
    public class ProviderService
    {
        private readonly BrokerDbContext _db;

        private readonly IWebHostEnvironment _environment;

        private Random random = new Random();

        public ProviderService(BrokerDbContext db, IWebHostEnvironment environment)
        {
            _db = db;
            _environment = environment;
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
        }

        public async Task<long> CreateListing(ListingDraftDto draft)
        {
            // Create location
            var location = new Location
            {
                City = draft.City,
                Area = draft.Area,
                SubArea = draft.SubArea,
            };

            await _db.Locations.AddAsync(location);
            await _db.SaveChangesAsync();

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
                ProviderId = draft.ProviderId,

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
        }

        public async Task<long> UpdateListing(long id, ListingDraftDto draft)
        {
            var listing = await _db.Listings
                .Include(x => x.Images)
                .Include(x => x.AttributeValues)
                    .ThenInclude(x => x.AttributeDefinition)
                .Include(x => x.TaxonomyNodes)
                .Include(x => x.Location)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (listing is null)
                throw new InvalidOperationException(
                    $"Listing {id} was not found."
                );

            // ---------------------------------------------------------
            // 1. Scalar fields
            // ---------------------------------------------------------

            if (listing.Title != draft.Title)
                listing.Title = draft.Title;

            if (listing.Description != draft.Description)
                listing.Description = draft.Description;

            if (listing.Price != draft.Price)
                listing.Price = draft.Price;

            if (listing.PriceUnit != draft.PriceUnit)
                listing.PriceUnit = draft.PriceUnit;

            if (draft.Latitude != null && listing.Latitude != draft.Latitude)
                listing.Latitude = draft.Latitude;

            if (draft.Longitude != null && listing.Longitude != draft.Longitude)
                listing.Longitude = draft.Longitude;

            var method = draft.Method switch
            {
                "For sale" => ListingMethod.Buy,
                "For rent" => ListingMethod.Rent,
                "Service" => ListingMethod.Service,
                _ => ListingMethod.Contract
            };

            if (listing.Method != method)
                listing.Method = method;


            // ---------------------------------------------------------
            // 2. Location
            // ---------------------------------------------------------

            if (listing.Location is null)
            {
                listing.Location = new Location
                {
                    City = draft.City,
                    Area = draft.Area,
                    SubArea = draft.SubArea
                };
            }
            else
            {
                if (listing.Location.City != draft.City)
                    listing.Location.City = draft.City;

                if (listing.Location.Area != draft.Area)
                    listing.Location.Area = draft.Area;

                if (listing.Location.SubArea != draft.SubArea)
                    listing.Location.SubArea = draft.SubArea;
            }


            // ---------------------------------------------------------
            // 3. Taxonomy
            // ---------------------------------------------------------

            var currentTaxonomy = listing.TaxonomyNodes
                .FirstOrDefault();

            var currentTaxonomyId = currentTaxonomy?.TaxonomyNodeId;

            if (currentTaxonomyId != draft.TaxonomyId)
            {
                var taxonomyNode = await _db.TaxonomyNode
                    .AsNoTracking()
                    .FirstOrDefaultAsync(x => x.Id == draft.TaxonomyId);

                if (taxonomyNode is null)
                    throw new InvalidOperationException(
                        $"Taxonomy node {draft.TaxonomyId} was not found."
                    );

                listing.TaxonomyNodes.Clear();

                listing.TaxonomyNodes.Add(
                    new ListingTaxonomyNode
                    {
                        TaxonomyNode = taxonomyNode
                    }
                );
            }


            // ---------------------------------------------------------
            // 4. Attributes
            // ---------------------------------------------------------

            var attributeNames = draft.Attributes
                .Select(x => x.Name)
                .Distinct()
                .ToList();

            var definitions = await _db.AttributeDefinition
                .AsNoTracking()
                .Where(x => attributeNames.Contains(x.Name))
                .ToDictionaryAsync(x => x.Name);

            var incomingAttributes = draft.Attributes
                .ToDictionary(x => x.Name, x => x.Value);

            // Remove attributes no longer present
            var attributesToRemove = listing.AttributeValues
                .Where(x => !incomingAttributes.ContainsKey(
                    x.AttributeDefinition.Name))
                .ToList();

            foreach (var attribute in attributesToRemove)
            {
                listing.AttributeValues.Remove(attribute);
            }

            // Update existing / add new
            foreach (var attribute in incomingAttributes)
            {
                if (!definitions.TryGetValue(
                        attribute.Key,
                        out var definition))
                {
                    throw new InvalidOperationException(
                        $"Attribute definition '{attribute.Key}' was not found."
                    );
                }

                var existing = listing.AttributeValues
                    .FirstOrDefault(x =>
                        x.AttributeDefinitionId == definition.Id);

                if (existing is not null)
                {
                    if (existing.Value != attribute.Value)
                        existing.Value = attribute.Value;
                }
                else
                {
                    listing.AttributeValues.Add(
                        new ListingAttributeValue
                        {
                            AttributeDefinition = definition,
                            Value = attribute.Value
                        }
                    );
                }
            }


            // ---------------------------------------------------------
            // 5. Photos
            // ---------------------------------------------------------

            var incomingExistingPhotoIds = draft.Photos
                .Where(x => x.Id.HasValue)
                .Select(x => x.Id!.Value)
                .ToHashSet();

            // Existing photos omitted from the draft = deleted
            var photosToRemove = listing.Images
                .Where(x =>
                    x.Kind == ImageKind.Photo &&
                    !incomingExistingPhotoIds.Contains(x.Id))
                .ToList();

            foreach (var photo in photosToRemove)
            {
                // Delete physical file
                DeleteListingImage(photo.ImageUrl);

                listing.Images.Remove(photo);
            }

            // Upload new photos
            var newPhotos = await UploadPhotos(draft);

            foreach (var photo in newPhotos)
            {
                listing.Images.Add(
                    new ListingImage
                    {
                        ImageUrl = $"/uploads/images/{photo.FileName}",
                        IsPrimary = photo.IsPrimary,
                        Kind = ImageKind.Photo
                    }
                );
            }

            // Update IsPrimary for existing photos
            foreach (var existingPhoto in listing.Images)
            {
                var draftPhoto = draft.Photos
                    .FirstOrDefault(x => x.Id == existingPhoto.Id);

                if (draftPhoto is not null)
                {
                    existingPhoto.IsPrimary = draftPhoto.IsPrimary;
                }
            }


            // ---------------------------------------------------------
            // 6. Save everything
            // ---------------------------------------------------------

            await _db.SaveChangesAsync();

            return listing.Id;
        }

        private void DeleteListingImage(string? imageUrl)
        {
            if (string.IsNullOrWhiteSpace(imageUrl))
                return;

            var relativePath = imageUrl
                .TrimStart('/')
                .Replace('/', Path.DirectorySeparatorChar);

            var filePath = Path.Combine(
                _environment.WebRootPath,
                relativePath
            );

            if (File.Exists(filePath))
                File.Delete(filePath);
        }


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
        }
    }
}