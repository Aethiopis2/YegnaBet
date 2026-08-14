using System;
using System.Collections.Generic;
using System.Text;

namespace YegnaBet.Domain.Entities
{
    public class AuditLog
    {
        public long Id { get; set; }
        public long? UserId { get; set; }

        public string EntityType { get; set; } = null!;
        public long EntityId { get; set; }

        public string Action { get; set; } = null!;

        public string? OldValues { get; set; }
        public string? NewValues { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}