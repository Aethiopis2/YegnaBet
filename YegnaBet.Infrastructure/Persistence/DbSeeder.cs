using YegnaBet.Domain.Entities;
using YegnaBet.Domain.Enums;

namespace YegnaBet.Infrastructure.Persistence
{
    public static class DbSeeder
    {
        public static async Task SeedAsync(BrokerDbContext db) 
        { 
            if (db.Categories.Any()) return; 
            
            db.Categories.AddRange(
                new Category { Name = "Houses", SortOrder = 1 }, 
                new Category { Name = "Apartments", SortOrder = 2 }, 
                new Category { Name = "Cleaners", SortOrder = 3 }, 
                new Category { Name = "Accountants", SortOrder = 4 }); 
            
            db.Locations.AddRange(
                new Location { City = "Addis Ababa", Area = "Bole" }, 
                new Location { City = "Addis Ababa", Area = "CMC" }, 
                new Location { City = "Addis Ababa", Area = "Ayat" }); 
            
            db.Users.Add(
                new User { Fullname = "Yegna Bet Broker", PhoneNumber = "0911000000", Role = UserRole.Broker, IsVerified = true }); 
            
            await db.SaveChangesAsync();

            var broker = db.Users.First(); 
            
            var bole = db.Locations.First(x => x.Area == "Bole"); 
            var cmc = db.Locations.First(x => x.Area == "CMC"); 
            
            var houses = db.Categories.First(x => x.Name == "Houses"); 
            var apartments = db.Categories.First(x => x.Name == "Apartments"); 
            
            var provider = new User { 
                Fullname = "Abebe Kebede", 
                PhoneNumber = "0910000000", 
                Role = UserRole.Provider, 
                IsVerified = true 
            }; 
            
            db.Users.Add(provider); 
            await db.SaveChangesAsync(); 
            
            db.Listings.AddRange(
                new Listing { 
                    ProviderId = provider.Id, 
                    BrokerId = broker.Id, 
                    CategoryId = houses.Id, 
                    LocationId = bole.Id, 
                    Kind = ListingKind.Property, 
                    Title = "Modern 2 Bedroom House", 
                    Description = "Clean and modern house near Bole.", 
                    Price = 45000, 
                    PriceUnit = "month", 
                    ListingStatus = ListingStatus.Active, 
                    IsVerified = true, TrustScore = 92 
                }, 
                new Listing { 
                    ProviderId = provider.Id, 
                    BrokerId = broker.Id, 
                    CategoryId = apartments.Id, 
                    LocationId = cmc.Id, 
                    Kind = ListingKind.Property, 
                    Title = "Affordable Studio Apartment", 
                    Description = "Affordable studio apartment in CMC.", 
                    Price = 18000, 
                    PriceUnit = "month", 
                    ListingStatus = ListingStatus.Active, 
                    IsVerified = true, TrustScore = 88 
                }); 
            await db.SaveChangesAsync();
        }
    }
}