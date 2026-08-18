using Microsoft.EntityFrameworkCore;
using YegnaBet.API.Modules.Brokers.Dtos;
using YegnaBet.API.Modules.Users.Dtos;
using YegnaBet.Infrastructure.Persistence;


namespace YegnaBet.API.Modules.Users.Services
{
    public class UserService
    {
        private readonly BrokerDbContext _db;

        public UserService(BrokerDbContext db)
        {
            _db = db;
        } // end cntr

        public async Task<UserProfileDto> Get(int uid)
        {
            return await _db.Users
                .AsNoTracking()
                .Where(x => x.Id == uid)
                .Select(x => new UserProfileDto
                {
                    Id = x.Id,
                    FullName = x.FullName,
                    Role = x.Role == 0 ? "Customer" : "Provider",
                    IsActive = x.IsActive
                })
                .FirstAsync();
        } // end Get
    } // end UserService
} // end namespace