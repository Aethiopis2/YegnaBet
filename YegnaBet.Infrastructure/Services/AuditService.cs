using YegnaBet.Infrastructure.Persistence;
using YegnaBet.Domain.Entities;

namespace YegnaBet.Infrastructure.Services
{
    public class AuditService
    {
        private BrokerDbContext _db;

        public AuditService(BrokerDbContext db)
        {
            _db = db;
        }

        public async Task LogAsync(string entityType, long entityId, string action,
            string? oldValues = null, string? newValues = null, long? userId = null)
        {
            _db.AuditLogs.Add(new AuditLog
            {
                UserId = userId,
                EntityType = entityType,
                EntityId = entityId,
                Action = action,
                OldValues = oldValues,
                NewValues = newValues
            });

            await _db.SaveChangesAsync();
        }
    }
}