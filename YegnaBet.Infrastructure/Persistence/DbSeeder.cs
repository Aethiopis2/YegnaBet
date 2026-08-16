using System.Globalization;
using YegnaBet.Domain.Entities;
using YegnaBet.Domain.Enums;

namespace YegnaBet.Infrastructure.Persistence
{
    public static class DbSeeder
    {
        private const int NUM_USERS = 100;
        private const int NUM_LISTINGS = 1000;

        private static readonly string[] categories_list =
        {
        "land",
        "house",
        "apartment",
        "cleaner",
        "electrician",
        "accountant",
        "carpenter",
        "painter",
        "mechanic"
    };

        private static readonly string[] cities_list =
        {
        "Addis Ababa",
        "Adama",
        "Hawassa",
        "Bishoftu",
        "Gondar",
        "Mekele"
    };

        private static readonly string[] areas_list =
        {
        "22",
        "Bole",
        "Piassa",
        "Merkato",
        "Arada",
        "Azezo",
        "Ayider",
        "Gulele",
        "Wessen",
        "CMC",
        "Ayat",
        "Semit",
        "Shiro Meda",
        "Torhailoch",
        "Lem Hotel"
    };

        private static readonly string[] names_list =
        {
        "Abebe",
        "Kebede",
        "Samson",
        "Samuel",
        "Tobby",
        "Melona",
        "Mar",
        "Binyam",
        "Rediet",
        "Chekol",
        "Deribew",
        "Bubu",
        "Almemayehu",
        "Kassa",
        "Mergassa",
        "Debo",
        "Tola",
        "Kirubel",
        "Admas",
        "Tolossa",
        "Tofic",
        "Muhammed",
        "Jemal",
        "Destaw",
        "Girma",
        "Meron",
        "Genet",
        "Getinet"
    };

        private static readonly string[] titles =
        {
        "Modern and clean",
        "Classic",
        "Studio",
        "Luxurious",
        "Affordable",
        "Spacious",
        "Newly renovated"
    };

        private static readonly string[] adjs =
        {
        "near",
        "close to",
        "around",
        "in",
        "across",
        "on the road to"
    };


        /// <summary>
        /// Populates the database with canned and random values for testing purposes.
        /// </summary>
        public static async Task SeedAsync(BrokerDbContext db)
        {
            List<Category> categories = SeedCategories(db);
            List<Location> locations = SeedLocations(db);
            Dictionary<UserRole, List<User>> users = SeedUsers(db);

            await db.SaveChangesAsync();

            SeedListings(db, locations, users);

            await db.SaveChangesAsync();
        }


        /// <summary>
        /// Populates the Category table.
        /// </summary>
        private static List<Category> SeedCategories(BrokerDbContext db)
        {
            if (db.Categories.Any())
                return db.Categories.ToList();

            List<Category> categories = new();

            for (int i = 0; i < categories_list.Length; i++)
            {
                string key = categories_list[i];

                var category = new Category
                {
                    Name = CultureInfo.CurrentCulture.TextInfo
                        .ToTitleCase(key) + "s",

                    Icon = $"assets/pictures/category_icons/{key}.png",

                    SortOrder = i + 1
                };

                db.Categories.Add(category);
                categories.Add(category);
            }

            return categories;
        }


        /// <summary>
        /// Populates the Location table.
        /// </summary>
        private static List<Location> SeedLocations(BrokerDbContext db)
        {
            if (db.Locations.Any())
                return db.Locations.ToList();

            List<Location> locations = new();

            int count = Math.Max(
                cities_list.Length,
                areas_list.Length);

            for (int i = 0; i < count; i++)
            {
                var location = new Location
                {
                    City = cities_list[i % cities_list.Length],
                    Area = areas_list[i % areas_list.Length]
                };

                db.Locations.Add(location);
                locations.Add(location);
            }

            return locations;
        }


        /// <summary>
        /// Populates users.
        ///
        /// Distribution:
        /// 55% customers
        /// 44% providers
        /// 1% employees
        /// </summary>
        private static Dictionary<UserRole, List<User>> SeedUsers(
            BrokerDbContext db)
        {
            if (db.Users.Any())
            {
                return db.Users
                    .AsEnumerable()
                    .GroupBy(x => x.Role)
                    .ToDictionary(
                        x => x.Key,
                        x => x.ToList());
            }

            Dictionary<UserRole, List<User>> users = new()
        {
            { UserRole.Customer, new List<User>() },
            { UserRole.Provider, new List<User>() },
            { UserRole.Employee, new List<User>() }
        };

            Random random = new(12345);

            for (int i = 0; i < NUM_USERS; i++)
            {
                int idx = i % names_list.Length;

                UserRole role =
                    i < NUM_USERS * 0.55
                        ? UserRole.Customer
                        : i < NUM_USERS * 0.99
                            ? UserRole.Provider
                            : UserRole.Employee;

                var user = new User
                {
                    FullName =
                        names_list[idx] + " " +
                        names_list[random.Next(names_list.Length)],

                    Role = role,

                    PhoneNumber =
                        "09" + i.ToString("00000000"),

                    IsVerified = true
                };

                db.Users.Add(user);
                users[role].Add(user);
            }

            return users;
        }


        /// <summary>
        /// Creates realistic demo listings.
        /// </summary>
        private static void SeedListings(
            BrokerDbContext db,
            List<Location> locations,
            Dictionary<UserRole, List<User>> users)
        {
            if (db.Listings.Any())
                return;

            var categories = db.Categories.ToList();

            var providers = users[UserRole.Provider];

            var employees = users[UserRole.Employee];

            if (providers.Count == 0 || employees.Count == 0)
                throw new InvalidOperationException(
                    "SeedListings requires at least one provider and one employee.");

            Random random = new(54321);

            for (int i = 0; i < NUM_LISTINGS; i++)
            {
                int categoryIndex = i % categories.Count;

                Category category = categories[categoryIndex];

                string categoryKey =
                    categories_list[categoryIndex];

                Location location =
                    locations[i % locations.Count];

                User provider =
                    providers[i % providers.Count];

                User employee =
                    employees[i % employees.Count];

                var listing = new Listing
                {
                    Location = location,

                    ProviderId = provider.Id,
                    Provider = provider,

                    EmployeeId = employee.Id,
                    Employee = employee,

                    ListingStatus = ListingStatus.Active,

                    CategoryId = category.Id,
                    Category = category,

                    Price = GeneratePrice(categoryKey, random),

                    PriceUnit = GetPriceUnit(categoryKey),

                    IsVerified = random.NextDouble() < 0.35,

                    TrustScore = 70 + random.Next(31)
                };


                // ----------------------------------------------------
                // LAND
                // ----------------------------------------------------

                if (categoryKey == "land")
                {
                    listing.Title =
                        "Land " +
                        adjs[i % adjs.Length] + " " +
                        location.Area;

                    listing.Kind =
                        i % 2 == 0
                            ? ListingKind.Sales
                            : ListingKind.Rent;

                    listing.Images = new List<ListingImage>
                {
                    new ListingImage
                    {
                        ImageUrl =
                            $"assets/pictures/lands/{1 + (i % 10)}.jpg"
                    }
                };
                }


                // ----------------------------------------------------
                // HOUSE
                // ----------------------------------------------------

                else if (categoryKey == "house")
                {
                    listing.Title =
                        titles[i % titles.Length] +
                        " house " +
                        adjs[i % adjs.Length] + " " +
                        location.Area;

                    listing.Kind =
                        i % 2 == 0
                            ? ListingKind.Sales
                            : ListingKind.Rent;

                    listing.Images = new List<ListingImage>
                {
                    new ListingImage
                    {
                        ImageUrl =
                            $"assets/pictures/houses/{1 + (i % 10)}.jpg"
                    }
                };
                }


                // ----------------------------------------------------
                // APARTMENT
                // ----------------------------------------------------

                else if (categoryKey == "apartment")
                {
                    listing.Title =
                        titles[i % titles.Length] +
                        " apartment " +
                        adjs[i % adjs.Length] + " " +
                        location.Area;

                    listing.Kind =
                        i % 2 == 0
                            ? ListingKind.Sales
                            : ListingKind.Rent;

                    listing.Images = new List<ListingImage>
                {
                    new ListingImage
                    {
                        ImageUrl =
                            $"assets/pictures/apartments/{1 + (i % 10)}.jpg"
                    }
                };
                }


                // ----------------------------------------------------
                // SERVICES / CONTRACT WORK
                // ----------------------------------------------------

                else
                {
                    listing.Title =
                        category.Name.TrimEnd('s') +
                        " " +
                        adjs[i % adjs.Length] + " " +
                        location.Area;

                    listing.Kind =
                        i % 2 == 0
                            ? ListingKind.Contract
                            : ListingKind.Service;

                    listing.Images = new List<ListingImage>
                {
                    new ListingImage
                    {
                        ImageUrl =
                            $"assets/pictures/avatars/{1 + (i % 10)}.jpg"
                    }
                };
                }

                db.Listings.Add(listing);
            }
        }


        /// <summary>
        /// Generates realistic prices based on listing category.
        /// </summary>
        private static decimal GeneratePrice(
            string category,
            Random random)
        {
            return category switch
            {
                "land" =>
                    random.Next(500_000, 20_000_000),

                "house" =>
                    random.Next(15_000, 80_000),

                "apartment" =>
                    random.Next(10_000, 60_000),

                "cleaner" =>
                    random.Next(1_000, 5_000),

                "electrician" =>
                    random.Next(500, 10_000),

                "accountant" =>
                    random.Next(2_000, 30_000),

                "carpenter" =>
                    random.Next(1_000, 15_000),

                "painter" =>
                    random.Next(1_000, 20_000),

                "mechanic" =>
                    random.Next(500, 20_000),

                _ =>
                    random.Next(1_000, 50_000)
            };
        }


        /// <summary>
        /// Determines the appropriate price unit.
        /// </summary>
        private static string GetPriceUnit(string category)
        {
            return category switch
            {
                "house" => "month",
                "apartment" => "month",

                "land" => "total",

                "cleaner" => "service",
                "electrician" => "service",
                "accountant" => "service",
                "carpenter" => "service",
                "painter" => "service",
                "mechanic" => "service",

                _ => "service"
            };
        }
    }
} // end namespace