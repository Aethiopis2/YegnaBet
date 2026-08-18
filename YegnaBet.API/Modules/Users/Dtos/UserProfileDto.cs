using YegnaBet.Domain.Enums;

namespace YegnaBet.API.Modules.Users.Dtos
{
    public class UserProfileDto
    {
        public long Id { get; set; }
        public string Role { get; set; } = null!;
        public string FullName { get; set; } = null!;
        public bool IsActive { get; set; }
    }
}