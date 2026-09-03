using YegnaBet.Domain.Enums;

namespace YegnaBet.Domain.Entities
{
    public class User
    {
        public long Id { get; set; }
        public UserRole Role { get; set; } = UserRole.Customer;

        public string FullName { get; set; } = null!;
        public string PhoneNumber { get; set; } = null!;

        public bool IsVerified { get; set; }
        public bool IsActive { get; set; } = true;
        public string? Avatar { get; set;}

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}