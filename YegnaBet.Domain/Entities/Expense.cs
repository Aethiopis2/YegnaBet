using System;
using System.Collections.Generic;
using System.Text;

namespace YegnaBet.Domain.Entities
{
    public class Expense
    {
        public long Id { get; set; }
        public string Category { get; set; } = null!;
        public decimal Amount { get; set; }
        public string? Description { get; set; }

        public DateTime IncurredAt { get; set; } = DateTime.UtcNow.Date;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}