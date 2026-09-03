using Microsoft.EntityFrameworkCore;
using YegnaBet.Domain.Enums;
using YegnaBet.Infrastructure.Persistence;

namespace YegnaBet.API.Modules.Marketplace.Services
{
    public sealed class EmployeeAssignmentInitializer
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly EmployeeAssignmentState _state;

        public EmployeeAssignmentInitializer(
            IServiceScopeFactory scopeFactory,
            EmployeeAssignmentState state)
        {
            _scopeFactory = scopeFactory;
            _state = state;
        }

        public async Task InitializeAsync(
            CancellationToken cancellationToken = default)
        {
            using var scope =
                _scopeFactory.CreateScope();

            var db = scope.ServiceProvider
                .GetRequiredService<BrokerDbContext>();

            var employees = await db.Users
                .AsNoTracking()
                .Where(u =>
                    u.Role == UserRole.Employee)
                .OrderBy(u => u.Id)
                .Select(u => new EmployeeState
                {
                    Id = u.Id,
                    Name = u.FullName,
                    Avatar = u.Avatar,
                    Phone = u.PhoneNumber,
                    Verified = u.IsVerified,
                    Available = true
                })
                .ToListAsync(cancellationToken);

            /*
             * Assign a stable round-robin position.
             */
            for (var i = 0; i < employees.Count; i++)
            {
                var employee = employees[i];

                employees[i] = new EmployeeState
                {
                    Id = employee.Id,
                    Name = employee.Name,
                    Avatar = employee.Avatar,
                    Phone = employee.Phone,
                    Verified = employee.Verified,
                    Available = employee.Available,
                    RoundRobinOrder = i
                };
            }

            _state.Initialize(employees);
        }
    }
}