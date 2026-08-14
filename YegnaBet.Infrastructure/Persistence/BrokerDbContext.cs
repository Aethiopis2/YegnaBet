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
        public DbSet<Category> Categories => Set<Category>();
        public DbSet<Location> Locations => Set<Location>();
        public DbSet<Listing> Listings => Set<Listing>();
        public DbSet<ListingImage> ListingImages => Set<ListingImage>();
        public DbSet<Inquiry> Inquiries => Set<Inquiry>();
        public DbSet<Deal> Deals => Set<Deal>();
        public DbSet<FinancialTransaction> FinancialTransactions => Set<FinancialTransaction>();
        public DbSet<Expense> Expenses => Set<Expense>();
        public DbSet<AuditLog> AuditLogs => Set<AuditLog>();


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasDefaultSchema("public");

            modelBuilder.Entity<User>()
                .HasIndex(x => x.PhoneNumber)
                .IsUnique();

            modelBuilder.Entity<Listing>()
                .HasOne(x => x.Provider)
                .WithMany()
                .HasForeignKey(x => x.ProviderId)
                .OnDelete(DeleteBehavior.Restrict); 
            
            modelBuilder.Entity<Listing>()
                .HasOne(x => x.Broker)
                .WithMany()
                .HasForeignKey(x => x.BrokerId)
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
                .HasIndex(x => x.CategoryId);

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