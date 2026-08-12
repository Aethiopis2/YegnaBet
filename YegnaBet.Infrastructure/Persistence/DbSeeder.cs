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
        }
    }
}