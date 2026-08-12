using YegnaBet.Domain.Enums;

namespace YegnaBet.Domain.Entities
{
    /// <summary>
    /// A representation of a person in the system.
    /// </summary>
    public class User
    {
        public long Id { get; set; }
        public UserRole Role { get; set; } = UserRole.Customer;

        public string Fullname { get; set; } = null!;
        public string PhoneNumber { get; set; } = null!;

        public bool IsVerified { get; set; }
        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}