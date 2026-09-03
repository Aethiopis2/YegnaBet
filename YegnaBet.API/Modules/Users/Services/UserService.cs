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

        public async Task<ListingEmployeeDto> GetUserById(int id)
        {
            var lst = await _db.Users
                .AsNoTracking()
                .Where(u => u.Id == id)
                .Select(u => new ListingEmployeeDto
                {
                    Id = u.Id,
                    Name = u.FullName,
                    Avatar = u.Avatar,
                    Phone = u.PhoneNumber
                })
                .ToListAsync();

            return lst.First();
        }
    } // end UserService
} // end namespace