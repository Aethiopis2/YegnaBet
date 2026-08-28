using Microsoft.EntityFrameworkCore;
using System.Globalization;
using System.Text.Json.Nodes;
using YegnaBet.Domain.Entities;
using YegnaBet.Domain.Enums;

namespace YegnaBet.Infrastructure.Persistence
{
    public static class DbSeeder
    {
        private const int NUM_USERS = 100;
        private const int NUM_LISTINGS = 1000;

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
            "Lem Hotel",
            "Gurd Shola",
            "Meganaga",
            "Garment",
            "Saris"
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


        private static List<TaxonomyNode> nodes = new List<TaxonomyNode>();
        private static List<AttributeDefinition> house_attributes = new List<AttributeDefinition>();
        private static List<AttributeDefinition> land_attributes = new List<AttributeDefinition>();
        private static List<AttributeDefinition> service_attributes = new List<AttributeDefinition>();

        /// <summary>
        /// Populates the database with canned and random values for testing purposes.
        /// </summary>
        public static async Task SeedAsync(BrokerDbContext db)
        {
            await SeedRoots(db);

            List<Location> locations = SeedLocations(db);
            Dictionary<UserRole, List<User>> users = SeedUsers(db);

            await db.SaveChangesAsync();

            SeedListings(db, locations, users);

            await db.SaveChangesAsync();
        }

        private static void SetAttribute(
            Listing listing,
            AttributeDefinition attribute,
            object value)
        {
            listing.AttributeValues.Add(
                new ListingAttributeValue
                {
                    AttributeDefinition = attribute,
                    Value = JsonValue.Create(value)
                });
        }

        private static string CreateSlug(string value)
        {
            return value
                .Trim()
                .ToLowerInvariant()
                .Replace(" ", "-");
        }

        private static TaxonomyNode Node(string name)
        {
            return new TaxonomyNode
            {
                Name = name,
                Slug = CreateSlug(name),
                Description = $"{name} listings",
                IsActive = true,
                SortOrder = 0
            };
        }

        private static AttributeDefinition Attribute(
            string name,
            string key,
            AttributeDataType type,
            bool searchable = false,
            bool filterable = false,
            bool required = false)
        {
            return new AttributeDefinition
            {
                Name = name,
                Key = key,
                DataType = type,
                IsSearchable = searchable,
                IsFilterable = filterable,
                IsActive = true
            };
        }

        private static void Attach(
            TaxonomyNode node,
            AttributeDefinition attribute,
            bool required = false)
        {
            node.Attributes.Add(
                new NodeAttributeDefinition
                {
                    AttributeDefinition = attribute,
                    IsRequired = required,
                    SortOrder = node.Attributes.Count + 1
                });
        }

        private static async Task SeedRoots(BrokerDbContext db)
        {
            if (await db.Taxonomy.AnyAsync(x => x.Name == "Listing Types"))
                return;

            var taxonomy = new Taxonomy
            {
                Name = "Listing Types",
                Description = "Classifications of listings for YegnaBet",
                IsActive = true,
            };


            db.Taxonomy.Add(taxonomy);

            // now hit listing categories
            var listing = Node("Listing");

            var property = Node("Property");
            var house = Node("House");
            var apartment = Node("Apartment");
            var villa = Node("Villa");
            var office = Node("Office");
            var shop = Node("Shop");
            var land = Node("Land");
            var farm = Node("Farm");

            var service = Node("Service");
            var certified = Node("Certified");
            var accountant = Node("Accountant");
            var lawyer = Node("Lawyer");
            var other = Node("Other");
            var cleaner = Node("Cleaner");
            var painter = Node("Painter");

            // add nodes 
            nodes.AddRange([
                apartment, villa, office, shop, farm,
                accountant, cleaner, painter
            ]);

            // make attributes
            var area = Attribute(
                "Area",
                "area",
                AttributeDataType.Decimal,
                filterable: true,
                required: true);

            var bedrooms = Attribute(
                "Bedrooms",
                "bedrooms",
                AttributeDataType.Integer,
                filterable: true,
                required: true);

            var bathrooms = Attribute(
                "Bathrooms",
                "bathrooms",
                AttributeDataType.Integer,
                filterable: true);

            var furnished = Attribute(
                "Furnished",
                "furnished",
                AttributeDataType.Boolean,
                filterable: true);

            var parking = Attribute(
                "Parking",
                "parking",
                AttributeDataType.Boolean,
                filterable: true);

            var floors = Attribute(
                "Floors",
                "floors",
                AttributeDataType.Integer,
                filterable: true);

            var compound_size = Attribute(
                "Compound_Size",
                "compound_size",
                AttributeDataType.Decimal,
                filterable: true);

            var land_type = Attribute(
                "Land Type",
                "land_type",
                AttributeDataType.Choice,
                searchable: true,
                filterable: true,
                required: true);

            var title_deed = Attribute(
                "Title Deed",
                "title_deed",
                AttributeDataType.Boolean,
                filterable: true);

            var road = Attribute(
                "Road Access",
                "road_access",
                AttributeDataType.Boolean,
                filterable: true);

            var rooms = Attribute(
                "Rooms",
                "rooms",
                AttributeDataType.Integer,
                filterable: true);

            var experience = Attribute(
                "Experience",
                "experience",
                AttributeDataType.Integer,
                filterable: true);

            var water = Attribute(
                "Water Access",
                "water_access",
                AttributeDataType.Boolean,
                filterable: true);

            var electricity = Attribute(
                "Electricity",
                "electricity",
                AttributeDataType.Boolean,
                filterable: true);

            var mcertified = Attribute(
                "Certified",
                "certified",
                AttributeDataType.Boolean,
                filterable: true);

            var specialization = Attribute(
                "Specialization",
                "specialization",
                AttributeDataType.Choice,
                searchable: true,
                filterable: true);

            var licensed = Attribute(
                "Licensed",
                "licensed",
                AttributeDataType.Boolean,
                filterable: true);

            // add attributes for listing initialization
            house_attributes.AddRange([
                area, furnished, compound_size, bedrooms, rooms, bathrooms, parking
            ]);
            land_attributes.AddRange([
                area, land_type, title_deed, road, electricity, water
            ]);
            service_attributes.AddRange([experience, licensed, specialization, mcertified]);

            Attach(house, area);
            Attach(house, rooms);
            Attach(house, bathrooms);
            Attach(house, bedrooms);
            Attach(house, compound_size);

            Attach(villa, area);
            Attach(villa, bathrooms);
            Attach(villa, bedrooms);
            Attach(villa, compound_size);

            Attach(apartment, area);
            Attach(apartment, floors);
            Attach(apartment, bathrooms);
            Attach(apartment, bedrooms);

            Attach(office, area);
            Attach(office, rooms);
            Attach(office, parking);
            Attach(office, floors);

            Attach(shop, road);
            Attach(shop, area);
            Attach(shop, parking);

            Attach(land, area);
            Attach(land, land_type);
            Attach(land, electricity);
            Attach(land, water);
            Attach(land, road);

            Attach(farm, area);
            Attach(farm, electricity);
            Attach(farm, water);
            Attach(farm, road);
            Attach(accountant, experience);
            Attach(accountant, licensed);
            Attach(accountant, mcertified);

            Attach(lawyer, experience);
            Attach(lawyer, licensed);
            Attach(lawyer, mcertified);

            Attach(cleaner, experience);
            Attach(painter, experience);

            house.Children.Add(villa);
            house.Children.Add(apartment);
            house.Children.Add(office);
            house.Children.Add(shop);

            land.Children.Add(farm);
            property.Children.Add(house);
            property.Children.Add(land);

            certified.Children.Add(accountant);
            certified.Children.Add(lawyer);
            other.Children.Add(cleaner);
            other.Children.Add(painter);
            service.Children.Add(certified);
            service.Children.Add(other);

            listing.Children.Add(property);
            listing.Children.Add(service);
            taxonomy.Nodes.Add(listing);
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

            var providers = users[UserRole.Provider];

            var employees = users[UserRole.Employee];

            if (providers.Count == 0 || employees.Count == 0)
                throw new InvalidOperationException(
                    "SeedListings requires at least one provider and one employee.");

            Random random = new(54321);

            for (int i = 0; i < NUM_LISTINGS; i++)
            {
                Location location =
                    locations[random.Next() % locations.Count];

                User provider =
                    providers[random.Next() % providers.Count];

                User employee =
                    employees[i % employees.Count];

                // get a category
                var category = nodes[random.Next() % nodes.Count];

                var listing = new Listing
                {
                    Location = location,

                    ProviderId = provider.Id,
                    Provider = provider,

                    ListingStatus = ListingStatus.Active,

                    Price = GeneratePrice(category.Slug, random),
                    PriceUnit = GetPriceUnit(category.Slug),

                    TrustScore = 70 + random.Next(31)
                };


                // ----------------------------------------------------
                // LAND
                // ----------------------------------------------------

                if (category.Slug == "farm")
                {
                    listing.Title =
                        "Farming land " +
                        adjs[i % adjs.Length] + " " +
                        location.Area;

                    listing.Method =
                        i % 2 == 0
                            ? ListingMethod.Sales
                            : ListingMethod.Contract;
                    listing.ListingStatus = ListingStatus.Active;

                    listing.Images = new List<ListingImage>
                    {
                        new ListingImage
                        {
                            ImageUrl =
                                $"assets/images/lands/{1 + (i % 10)}.jpg"
                        }
                    };

                    for (int j = random.Next(0, land_attributes.Count); j < land_attributes.Count; j++)
                    {
                        var attribute = land_attributes[j];
                        if (attribute.Key == "area") SetAttribute(listing, attribute, 5000f + random.NextDouble() * 10_000);
                        else if (attribute.Key == "electricity" || attribute.Key == "water" || attribute.Key == "road_access" || attribute.Key == "title_deed")
                            SetAttribute(listing, attribute, true);
                        else if (attribute.Key == "land_type") SetAttribute(listing, attribute, "{type:farm}");
                    }
                }


                // ----------------------------------------------------
                // HOUSE
                // ----------------------------------------------------

                else if (category.Slug == "villa")
                {
                    listing.Title =
                        titles[i % titles.Length] +
                        " villa " +
                        adjs[i % adjs.Length] + " " +
                        location.Area;

                    listing.Method =
                        i % 2 == 0
                            ? ListingMethod.Sales
                            : ListingMethod.Rent;

                    listing.Images = new List<ListingImage>
                    {
                        new ListingImage
                        {
                            ImageUrl =
                                $"assets/images/houses/{1 + (i % 10)}.jpg"
                        }
                    };

                    for (int j = random.Next(0, house_attributes.Count); j < house_attributes.Count; j++)
                    {
                        var attribute = house_attributes[j];
                        if (attribute.Key == "area") SetAttribute(listing, attribute, 5000f + random.NextDouble() * 10_000);
                        else if (attribute.Key == "furnished" || attribute.Key == "parking")
                            SetAttribute(listing, attribute, true);
                        else if (attribute.Key == "bedrooms" || attribute.Key == "rooms") SetAttribute(listing, attribute, random.Next(3, 9));
                        else if (attribute.Key == "bathrooms") SetAttribute(listing, attribute, random.Next(1, 4));
                        else if (attribute.Key == "compound_size") SetAttribute(listing, attribute, 15.0f + random.NextDouble() * 100);
                    }
                }


                // ----------------------------------------------------
                // APARTMENT
                // ----------------------------------------------------

                else if (category.Slug == "apartment")
                {
                    listing.Title =
                        titles[i % titles.Length] +
                        " apartment " +
                        adjs[i % adjs.Length] + " " +
                        location.Area;

                    listing.Method =
                        i % 2 == 0
                            ? ListingMethod.Sales
                            : ListingMethod.Rent;

                    listing.Images = new List<ListingImage>
                    {
                        new ListingImage
                        {
                            ImageUrl =
                                $"assets/images/apartments/{1 + (i % 10)}.jpg"
                        }
                    };

                    for (int j = random.Next(0, house_attributes.Count); j < house_attributes.Count; j++)
                    {
                        var attribute = house_attributes[j];
                        if (attribute.Key == "area") SetAttribute(listing, attribute, 5000f + random.NextDouble() * 10_000);
                        else if (attribute.Key == "furnished")
                            SetAttribute(listing, attribute, true);
                        else if (attribute.Key == "bedrooms" || attribute.Key == "rooms") SetAttribute(listing, attribute, random.Next(3, 9));
                        else if (attribute.Key == "bathrooms") SetAttribute(listing, attribute, random.Next(1, 4));
                    }
                }


                // ----------------------------------------------------
                // Shop
                // ----------------------------------------------------

                else if (category.Slug == "shop")
                {
                    listing.Title =
                        titles[i % titles.Length] +
                        " shop " +
                        adjs[i % adjs.Length] + " " +
                        location.Area;

                    listing.Method =
                        i % 2 == 0
                            ? ListingMethod.Sales
                            : ListingMethod.Rent;

                    listing.Images = new List<ListingImage>
                    {
                        new ListingImage
                        {
                            ImageUrl =
                                $"assets/images/shops/{1 + (i % 10)}.jpg"
                        }
                    };

                    for (int j = random.Next(0, house_attributes.Count); j < house_attributes.Count; j++)
                    {
                        var attribute = house_attributes[j];
                        if (attribute.Key == "area") SetAttribute(listing, attribute, 5000f + random.NextDouble() * 10_000);
                        else if (attribute.Key == "furnished")
                            SetAttribute(listing, attribute, true);
                        else if (attribute.Key == "rooms") SetAttribute(listing, attribute, random.Next(1, 3));
                    }
                }


                // ----------------------------------------------------
                // OFFICE
                // ----------------------------------------------------

                else if (category.Slug == "office")
                {
                    listing.Title =
                        titles[i % titles.Length] +
                        " office " +
                        adjs[i % adjs.Length] + " " +
                        location.Area;

                    listing.Method =
                        i % 2 == 0
                            ? ListingMethod.Sales
                            : ListingMethod.Rent;

                    listing.Images = new List<ListingImage>
                    {
                        new ListingImage
                        {
                            ImageUrl =
                                $"assets/images/apartments/{1 + (i % 10)}.jpg"
                        }
                    };

                    for (int j = random.Next(0, house_attributes.Count); j < house_attributes.Count; j++)
                    {
                        var attribute = house_attributes[j];
                        if (attribute.Key == "area") SetAttribute(listing, attribute, 5000f + random.NextDouble() * 10_000);
                        else if (attribute.Key == "parking")
                            SetAttribute(listing, attribute, true);
                        else if (attribute.Key == "rooms") SetAttribute(listing, attribute, random.Next(3, 20));
                        else if (attribute.Key == "compound_size") SetAttribute(listing, attribute, 15.0f + random.NextDouble() * 100);
                    }
                }


                // accountant
                else if (category.Slug == "accountant")
                {
                    listing.Title =
                        category.Name.TrimEnd('s') +
                        " " +
                        adjs[i % adjs.Length] + " " +
                        location.Area;

                    listing.Method = ListingMethod.Service;

                    listing.Images = new List<ListingImage>
                    {
                        new ListingImage
                        {
                            ImageUrl =
                                $"assets/images/avatars/{1 + (i % 10)}.jpg"
                        }
                    };

                    for (int j = random.Next(0, service_attributes.Count); j < service_attributes.Count; j++)
                    {
                        var attribute = service_attributes[j];
                        if (attribute.Key == "experience") SetAttribute(listing, attribute, random.Next(1, 10));
                        else if (attribute.Key == "certified" || attribute.Key == "licensed")
                            SetAttribute(listing, attribute, true);
                    }
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

                    listing.Method =
                        i % 2 == 0
                            ? ListingMethod.Contract
                            : ListingMethod.Service;

                    listing.Images = new List<ListingImage>
                    {
                        new ListingImage
                        {
                            ImageUrl =
                                $"assets/images/avatars/{1 + (i % 10)}.jpg"
                        }
                    };

                    for (int j = 0; j < service_attributes.Count; j++)
                    {
                        var attribute = service_attributes[j];
                        if (attribute.Key == "experience")
                        {
                            SetAttribute(listing, attribute, random.Next(1, 10));
                            break;
                        }
                    }
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
                "farm" =>
                    random.Next(500_000, 20_000_000),

                "villa" =>
                    random.Next(15_000, 80_000),

                "apartment" =>
                    random.Next(10_000, 60_000),

                "cleaner" =>
                    random.Next(1_000, 5_000),

                "office" =>
                    random.Next(40_000, 300_000),

                "shop" =>
                    random.Next(100_000, 1000_000),

                "accountant" =>
                    random.Next(2_000, 30_000),

                "lawyer" =>
                    random.Next(30_000, 55_000),

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
                "villa" => "month",
                "apartment" => "month",
                "shop" => "month",
                "farm" => "month",

                "cleaner" => "service",
                "electrician" => "service",
                "accountant" => "service",
                "office" => "month",
                "painter" => "service",
                "mechanic" => "service",

                _ => "service"
            };
        }
    }
} // end namespace