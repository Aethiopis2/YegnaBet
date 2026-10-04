namespace YegnaBet.Domain.Entities
{
    public sealed class UserEx
    {
        public long UserId { get; set; }
        public long LocationId { get; set; }
        
        public User User { get; set; } = null!;
        public Location Location { get; set; } = null!;
    }
}