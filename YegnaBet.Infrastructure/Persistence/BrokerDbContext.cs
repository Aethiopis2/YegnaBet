using Microsoft.EntityFrameworkCore;
using YegnaBet.Domain.Entities;

namespace YegnaBet.Infrastructure.Persistence
{
    public class BrokerDbContext : DbContext
    {
        public BrokerDbContext(DbContextOptions<BrokerDbContext> options) 
            : base(options)
        { 
        }

        public DbSet<User> Users => Set<User>();
        public DbSet<Location> Locations => Set<Location>();
        public DbSet<Listing> Listings => Set<Listing>();
        public DbSet<ListingImage> ListingImages => Set<ListingImage>();
        public DbSet<Inquiry> Inquiries => Set<Inquiry>();
        public DbSet<Deal> Deals => Set<Deal>();
        public DbSet<FinancialTransaction> FinancialTransactions => Set<FinancialTransaction>();
        public DbSet<Expense> Expenses => Set<Expense>();
        public DbSet<AuditLog> AuditLogs => Set<AuditLog>();
        public DbSet<Taxonomy> Taxonomy => Set<Taxonomy>();
        public DbSet<TaxonomyNode> TaxonomyNode => Set<TaxonomyNode>();
        public DbSet<AttributeDefinition> AttributeDeinition => Set<AttributeDefinition>();


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.HasDefaultSchema("public");
            modelBuilder.Entity<Taxonomy>(entity =>
            {
                entity.ToTable("Taxonomies");

                entity.HasKey(x => x.Id);

                entity.Property(x => x.Name)
                    .HasMaxLength(150)
                    .IsRequired();

                entity.Property(x => x.Description)
                    .HasMaxLength(1000);
            });

            modelBuilder.Entity<TaxonomyNode>(entity =>
            {
                entity.ToTable("TaxonomyNodes");

                entity.HasKey(x => x.Id);

                entity.Property(x => x.Name)
                    .HasMaxLength(150)
                    .IsRequired();

                entity.HasIndex(x => new
                {
                    x.TaxonomyId,
                    x.ParentId,
                    x.Name
                })
                .IsUnique();

                entity.HasOne(x => x.Taxonomy)
                    .WithMany(x => x.Nodes)
                    .HasForeignKey(x => x.TaxonomyId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(x => x.Parent)
                    .WithMany(x => x.Children)
                    .HasForeignKey(x => x.ParentId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<AttributeDefinition>(entity =>
            {
                entity.ToTable("AttributeDefinitions");

                entity.HasKey(x => x.Id);

                entity.Property(x => x.Name)
                    .HasMaxLength(150)
                    .IsRequired();

                entity.Property(x => x.Key)
                    .HasMaxLength(150)
                    .IsRequired();

                entity.HasIndex(x => x.Key)
                    .IsUnique();

                entity.Property(x => x.DataType)
                    .HasConversion<string>()
                    .HasMaxLength(30);

                entity.Property(x => x.Options)
                    .HasColumnType("jsonb");
            });

            modelBuilder.Entity<NodeAttributeDefinition>(entity =>
            {
                entity.ToTable("NodeAttributeDefinitions");

                entity.HasKey(x => new
                {
                    x.TaxonomyNodeId,
                    x.AttributeDefinitionId
                });

                entity.HasOne(x => x.TaxonomyNode)
                    .WithMany(x => x.Attributes)
                    .HasForeignKey(x => x.TaxonomyNodeId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(x => x.AttributeDefinition)
                    .WithMany(x => x.Nodes)
                    .HasForeignKey(x => x.AttributeDefinitionId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<ListingTaxonomyNode>(entity =>
            {
                entity.ToTable("ListingTaxonomyNodes");

                entity.HasKey(x => new
                {
                    x.ListingId,
                    x.TaxonomyNodeId
                });

                entity.HasOne(x => x.Listing)
                    .WithMany(x => x.TaxonomyNodes)
                    .HasForeignKey(x => x.ListingId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(x => x.TaxonomyNode)
                    .WithMany(x => x.Listings)
                    .HasForeignKey(x => x.TaxonomyNodeId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<ListingAttributeValue>(entity =>
            {
                entity.ToTable("ListingAttributeValues");

                entity.HasKey(x => new
                {
                    x.ListingId,
                    x.AttributeDefinitionId
                });

                entity.Property(x => x.Value)
                    .HasColumnType("jsonb");

                entity.HasOne(x => x.Listing)
                    .WithMany(x => x.AttributeValues)
                    .HasForeignKey(x => x.ListingId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(x => x.AttributeDefinition)
                    .WithMany(x => x.Values)
                    .HasForeignKey(x => x.AttributeDefinitionId)
                    .OnDelete(DeleteBehavior.Restrict);
            });


        modelBuilder.Entity<User>()
                .HasIndex(x => x.PhoneNumber)
                .IsUnique();

            modelBuilder.Entity<Listing>()
                .HasOne(x => x.Provider)
                .WithMany()
                .HasForeignKey(x => x.ProviderId)
                .OnDelete(DeleteBehavior.Restrict); 
            

            
            modelBuilder.Entity<Listing>()
                .Property(x => x.TrustScore)
                .HasPrecision(5, 2); 
            
            modelBuilder.Entity<Listing>()
                .Property(x => x.Price)
                .HasPrecision(12, 2); 
            
            modelBuilder.Entity<Deal>()
                .Property(x => x.DealValue)
                .HasPrecision(12, 2); 
            
            modelBuilder.Entity<Deal>()
                .Property(x => x.CommissionRate)
                .HasPrecision(5, 2); 
            
            modelBuilder.Entity<Deal>()
                .Property(x => x.CommissionAmount)
                .HasPrecision(12, 2); 
            
            modelBuilder.Entity<FinancialTransaction>()
                .Property(x => x.Amount)
                .HasPrecision(12, 2);

            modelBuilder.Entity<Listing>()
                .HasIndex(x => x.ListingStatus); 

            modelBuilder.Entity<Listing>()
                .HasIndex(x => x.LocationId); 
            
            modelBuilder.Entity<Inquiry>()
                .HasIndex(x => x.InquiryStatus);

            modelBuilder.Entity<Expense>()
                .Property(x => x.Amount)
                .HasPrecision(12, 2);
        }
    }
}