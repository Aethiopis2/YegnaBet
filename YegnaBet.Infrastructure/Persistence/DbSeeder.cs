using Microsoft.EntityFrameworkCore;
using System.Globalization;
using System.Text.Json;
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

        private static readonly string[] farm =
        {
            "Spacious agricultural land with fertile soil, reliable road access, and excellent potential for crop farming or livestock.",
            "Well-positioned farmland with open space, productive soil, and convenient access to nearby communities and markets.",
            "Prime farming property suitable for vegetables, grains, fruit cultivation, or mixed agricultural use.",
            "Peaceful rural farm with generous land area, natural surroundings, and strong potential for long-term agricultural investment.",
            "Productive farmland offering ample cultivation space and easy access for farming equipment and transport.",
            "Established farm property with fertile grounds and room for expansion, ideal for commercial or family agriculture.",
            "Affordable agricultural property in a promising farming area, suitable for investors looking to build a productive land portfolio.",
            "Large open farm with excellent cultivation potential, good accessibility, and plenty of room for future development.",
            "Versatile agricultural property suitable for farming, livestock, greenhouse projects, or other rural business opportunities.",
            "Investment-ready farmland offering generous space, peaceful surroundings, and strong potential for agricultural development."
        };

        private static readonly string[] villa =
        {
            "Elegant family villa offering spacious rooms, modern finishes, and a comfortable setting designed for quality living.",
            "Beautifully maintained villa with generous living areas, private outdoor space, and a refined residential atmosphere.",
            "Modern luxury villa combining stylish architecture, practical living spaces, and a peaceful neighborhood setting.",
            "Spacious villa ideal for families seeking comfort, privacy, and easy access to essential services and amenities.",
            "Well-designed family home featuring bright interiors, quality finishes, and ample space for everyday living.",
            "Premium residential villa with attractive surroundings, spacious bedrooms, and excellent potential for comfortable family living.",
            "Tastefully designed villa offering privacy, convenience, and generous indoor and outdoor spaces for the whole family.",
            "Move-in-ready villa with modern features, comfortable rooms, and a welcoming environment in a desirable location.",
            "Contemporary villa with an excellent balance of space, comfort, privacy, and accessibility.",
            "Exceptional family property offering elegant living spaces, a peaceful environment, and strong long-term residential value."
        };

        private static readonly string[] apartment =
        {
            "Comfortable modern apartment with well-planned rooms, convenient access, and everything needed for practical city living.",
            "Bright and spacious apartment ideal for families, professionals, or investors looking for a convenient residential property.",
            "Well-maintained apartment offering comfortable bedrooms, a functional layout, and easy access to nearby amenities.",
            "Modern apartment in a convenient setting, combining affordability, comfort, and excellent everyday accessibility.",
            "Stylish residential apartment with generous living space and a practical layout suited to modern urban lifestyles.",
            "Clean and welcoming apartment offering a comfortable home environment with convenient access to transport and services.",
            "Well-positioned apartment ideal for both personal residence and rental investment, with excellent potential for long-term value.",
            "Spacious apartment featuring practical living areas, good natural light, and a convenient neighborhood location.",
            "Affordable and comfortable apartment suitable for individuals, couples, or small families looking for a well-connected home.",
            "Move-in-ready apartment offering a smart layout, comfortable living spaces, and a convenient urban lifestyle."
        };

        private static readonly string[] shop =
        {
            "Prime commercial shop with excellent business potential, convenient access, and a layout suitable for a wide range of businesses.",
            "Well-positioned retail space ideal for a grocery, boutique, electronics store, pharmacy, or other customer-focused business.",
            "Spacious commercial property offering strong visibility and convenient access for entrepreneurs looking to grow their business.",
            "Ready-to-use shop in a busy commercial setting, suitable for retail, services, or small-scale business operations.",
            "Affordable business space with a practical layout and excellent potential for attracting regular customers.",
            "Strategically located shop offering a strong opportunity for retailers and entrepreneurs seeking a convenient commercial base.",
            "Well-maintained commercial space suitable for retail, office services, salon, café, or other customer-facing businesses.",
            "Flexible shop property with good accessibility and enough space to establish and grow a successful local business.",
            "Promising commercial property for entrepreneurs seeking a practical location with strong business potential.",
            "Excellent shop opportunity offering convenience, visibility, and a flexible space suitable for a variety of commercial activities."
        };

        private static readonly string[] office =
        {
            "Professional office space with a practical layout, comfortable working environment, and convenient access for clients and staff.",
            "Modern office property suitable for companies, consultants, agencies, and growing businesses looking for a professional workspace.",
            "Well-maintained office with flexible rooms and a business-friendly environment designed for productive daily operations.",
            "Spacious commercial office offering comfortable work areas, good accessibility, and room for future business growth.",
            "Bright and practical office space ideal for startups, professional services, NGOs, or established businesses.",
            "Conveniently located office with a professional atmosphere and flexible configuration for different business needs.",
            "Ready-to-use office property offering a comfortable working environment and excellent accessibility for customers and employees.",
            "Well-planned office space suitable for teams that need a clean, organized, and professional place to work.",
            "Affordable business office combining practicality, accessibility, and a welcoming environment for clients and staff.",
            "Premium office opportunity offering flexible workspace, professional surroundings, and strong potential for business operations."
        };

        private static readonly string[] accountant =
        {
            "Experienced accounting professional providing reliable bookkeeping, financial reporting, and business accounting support.",
            "Trusted accountant offering practical financial management, tax preparation, reporting, and bookkeeping services for businesses.",
            "Professional accounting expertise for businesses and individuals seeking accurate records, organized finances, and dependable support.",
            "Reliable accounting specialist helping businesses maintain accurate books, manage expenses, and understand their financial position.",
            "Skilled accountant offering bookkeeping, financial statements, payroll support, and general accounting services.",
            "Business-focused accounting professional providing accurate financial records and practical guidance for better financial decisions.",
            "Dependable accountant experienced in organizing financial records, preparing reports, and supporting day-to-day business accounting.",
            "Professional financial services designed to help small and growing businesses keep their accounts accurate and up to date.",
            "Detail-oriented accountant offering bookkeeping and financial reporting support tailored to the needs of local businesses.",
            "Reliable accounting expertise for entrepreneurs who want organized records, clear reports, and better control over their finances."
        };

        private static readonly string[] services =
        {
            "Reliable electrical professional offering installation, maintenance, troubleshooting, and general electrical repair services.",
            "Skilled plumber providing dependable installation, repair, maintenance, and emergency plumbing support for homes and businesses.",
            "Experienced carpenter offering quality furniture, cabinetry, doors, repairs, and custom woodwork tailored to customer needs.",
            "Professional painter providing interior and exterior painting services with careful preparation and quality finishing.",
            "Trusted cleaning specialist offering thorough residential and commercial cleaning services with flexible scheduling.",
            "Experienced mechanic providing vehicle inspection, maintenance, diagnostics, and repair services for everyday drivers.",
            "Professional construction worker offering reliable masonry, renovation, finishing, and general building services.",
            "Skilled technician providing dependable installation, maintenance, and repair solutions for homes, offices, and businesses.",
            "Experienced moving and relocation specialist helping customers transport household and business items safely and efficiently.",
            "Reliable home maintenance professional offering practical repair, installation, renovation, and general property improvement services."
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
                    Value = JsonSerializer.Serialize(value)
                });
        }

        private static string CreateSlug(string value)
        {
            return value
                .Trim()
                .ToLowerInvariant()
                .Replace(" ", "-");
        }

        private static TaxonomyNode Node(string name, long id)
        {
            return new TaxonomyNode
            {
                Name = name,
                Slug = CreateSlug(name),
                Description = $"{name} listings",
                TaxonomyId = id,
                IsActive = true,
                Image = $"/assets/images/categories/{name}.jpg",
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
            await db.SaveChangesAsync();

            taxonomy = db.Taxonomy.First();

            // now hit listing categories
            var listing = Node("Listing", taxonomy.Id);
            var property = Node("Property", taxonomy.Id);
            var house = Node("House", taxonomy.Id);
            var apartment = Node("Apartment", taxonomy.Id);
            var villa = Node("Villa", taxonomy.Id);
            var office = Node("Office", taxonomy.Id);
            var shop = Node("Shop", taxonomy.Id);
            var land = Node("Land", taxonomy.Id);
            var farm = Node("Farm", taxonomy.Id);

            var service = Node("Service", taxonomy.Id);
            var certified = Node("Certified", taxonomy.Id);
            var accountant = Node("Accountant", taxonomy.Id);
            var lawyer = Node("Lawyer", taxonomy.Id);
            var other = Node("Other", taxonomy.Id);
            var cleaner = Node("Cleaner", taxonomy.Id);
            var painter = Node("Painter", taxonomy.Id);

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

                    IsVerified = true,
                    Avatar = $"/assets/images/avatar/{i % 10}.jpg"
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

                    TrustScore = 70 + random.Next(31),
                    IsVerified = i % 10 == 0 ? false : true,
                    IsFeatured = i % 30 == 0 ? true : false,

                    TaxonomyNodes =
                    [
                        new ListingTaxonomyNode
                        {
                            TaxonomyNode = category
                        }
                    ]
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
                    listing.Description = farm[i % farm.Length];

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
                                $"/assets/images/lands/{1 + (i % 10)}.jpg"
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
                    listing.Description = villa[i  % villa.Length];

                    listing.Method =
                        i % 2 == 0
                            ? ListingMethod.Sales
                            : ListingMethod.Rent;

                    listing.Images = new List<ListingImage>
                    {
                        new ListingImage
                        {
                            ImageUrl =
                                $"/assets/images/houses/{1 + (i % 10)}.jpg"
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
                    listing.Description = apartment[i % apartment.Length];

                    listing.Method =
                        i % 2 == 0
                            ? ListingMethod.Sales
                            : ListingMethod.Rent;

                    listing.Images = new List<ListingImage>
                    {
                        new ListingImage
                        {
                            ImageUrl =
                                $"/assets/images/apartments/{1 + (i % 10)}.jpg"
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
                    listing.Description = shop[i  % shop.Length];

                    listing.Method =
                        i % 2 == 0
                            ? ListingMethod.Sales
                            : ListingMethod.Rent;

                    listing.Images = new List<ListingImage>
                    {
                        new ListingImage
                        {
                            ImageUrl =
                                $"/assets/images/shops/{1 + (i % 10)}.jpg"
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
                    listing.Description = office[i  % office.Length];

                    listing.Method =
                        i % 2 == 0
                            ? ListingMethod.Sales
                            : ListingMethod.Rent;

                    listing.Images = new List<ListingImage>
                    {
                        new ListingImage
                        {
                            ImageUrl =
                                $"/assets/images/apartments/{1 + (i % 10)}.jpg"
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
                    listing.Description = accountant[i % accountant.Length];

                    listing.Method = ListingMethod.Service;

                    listing.Images = new List<ListingImage>
                    {
                        new ListingImage
                        {
                            ImageUrl =
                                $"/assets/images/avatars/{1 + (i % 10)}.jpg"
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
                    listing.Description = services[i % services.Length];

                    listing.Method =
                        i % 2 == 0
                            ? ListingMethod.Contract
                            : ListingMethod.Service;

                    listing.Images = new List<ListingImage>
                    {
                        new ListingImage
                        {
                            ImageUrl =
                                $"/assets/images/avatars/{1 + (i % 10)}.jpg"
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