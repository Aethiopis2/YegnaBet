namespace YegnaBet.API.Modules.Users.Dtos
{
    public sealed class UserProfileDto
    {
        public long Id { get; set; }
        public string FullName { get; set; } = null!;
        public string PhoneNumber { get; set; } = null!;
        public string Role { get; set; } = null!;
        public string? Email { get; set; }
        public string? AvatarUrl { get; set; }
        public string? Country { get; set; }
        public string? City { get; set; }
        public string? Area { get; set; }
        public string? SubArea { get; set; }
        public bool Verified { get; set; }
    }
}