using Microsoft.EntityFrameworkCore;
using YegnaBet.API.Modules.Authentication.Dtos;
using YegnaBet.API.Modules.Users.Dtos;
using YegnaBet.Infrastructure.Persistence;

namespace YegnaBet.API.Modules.Marketplace.Services
{
    public class CustAuthService
    {
        private readonly BrokerDbContext _db;

        public CustAuthService(BrokerDbContext db)
        {
            _db = db;
        } // end CustAuthService

        public async Task<UserProfileDto> GetMe(long userId)
        {
            var user = await _db.UsersEx
                .AsNoTracking()
                .Where(x => x.UserId == userId)
                .Select(u => new UserProfileDto
                {
                    Id = u.UserId,
                    FullName = u.User.FullName,
                    PhoneNumber = u.User.PhoneNumber,
                    Role = u.User.Role.ToString(),
                    Email = u.User.Email,
                    AvatarUrl = u.User.Avatar,
                    Country = u.Location.Country,
                    City = u.Location.City,
                    Area = u.Location.Area,
                    SubArea = u.Location.SubArea,
                    Verified = u.User.IsVerified
                })
                .FirstOrDefaultAsync();

            if (user != null)
                return user;

            throw new KeyNotFoundException($"Provider with id {userId} was not found.");
        } // end GetMe
    } // end CustAuthService
} // end namespace