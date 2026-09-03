namespace YegnaBet.API.Modules.Marketplace.Services
{
    public sealed class EmployeeAssignmentState
    {
        private readonly object _lock = new(); 
        
        /* 
         * Employee profiles are kept in memory. 
         * 
         * Key = Employee/User ID 
         */
        private readonly Dictionary<long, EmployeeState> _employees = new();

        /* 
         * Default lifetime of a listing-detail assignment. 
         * 
         * If the frontend disappears without explicitly releasing 
         * the assignment, it will eventually expire automatically. 
         */
        private static readonly TimeSpan AssignmentLifetime = TimeSpan.FromMinutes(10);

        /* 
         * Cursor used for round-robin selection when employees 
         * have the same workload. 
         */
        private int _roundRobinCursor; public IReadOnlyCollection<EmployeeState> Employees
        {
            get
            {
                lock (_lock) { return _employees.Values.ToArray(); }
            }
        }

        public AssignmentSession? GetAssignment(Guid assignmentId)
        {
            lock (_lock)
            {
                RemoveExpiredAssignmentsInternal();

                foreach (var employee in _employees.Values)
                {
                    if (employee.Assignments.TryGetValue(
                        assignmentId,
                        out var assignment))
                    {
                        return assignment;
                    }
                }

                return null;
            }
        }

        /* 
         * Load/replace the employee cache. 
         */
        public void Initialize(IEnumerable<EmployeeState> employees)
        {
            lock (_lock)
            {
                _employees.Clear(); foreach (var employee in employees)
                {
                    _employees[employee.Id] = employee;
                }
                _roundRobinCursor = 0;
            }
        }

        /* * Assign the least-busy available employee. 
         *  
         * If several employees have the same workload,  
         * 
         * select them in round-robin order. 
         * 
         * Returns null if there are no available employees. 
         */
        public EmployeeAssignmentResult? Assign(
            long listingId)
        {
            lock (_lock)
            {
                RemoveExpiredAssignmentsInternal();

                var available = _employees.Values
                    .Where(x => x.Available)
                    .ToList();

                if (available.Count == 0)
                    return null;

                var minimumAssignments =
                    available.Min(
                        x => x.ActiveAssignments);

                var candidates = available
                    .Where(x =>
                        x.ActiveAssignments ==
                        minimumAssignments)
                    .OrderBy(x =>
                        x.RoundRobinOrder)
                    .ToList();

                if (candidates.Count == 0)
                    return null;

                var selected =
                    candidates[
                        _roundRobinCursor %
                        candidates.Count];

                _roundRobinCursor++;

                var now = DateTime.UtcNow;

                var assignment =
                    new AssignmentSession
                    {
                        Id = Guid.NewGuid(),

                        ListingId = listingId,

                        EmployeeId = selected.Id,

                        CreatedAt = now,

                        ExpiresAt =
                            now.AddMinutes(10)
                    };

                selected.Assignments[
                    assignment.Id] = assignment;

                selected.ActiveAssignments =
                    selected.Assignments.Count;

                selected.LastAssignedAt = now;

                return new EmployeeAssignmentResult
                {
                    AssignmentId =
                        assignment.Id,

                    Employee = selected,

                    ExpiresAt =
                        assignment.ExpiresAt
                };
            }
        }

        /* 
         * Explicitly release an assignment. 
         * 
         * Called when the frontend tells the backend that the 
         * listing-detail session has ended. 
         */
        public bool Release(Guid assignmentId)
        {
            lock (_lock)
            {
                foreach (var employee in _employees.Values)
                {
                    if (!employee.Assignments.Remove(assignmentId))
                    {
                        continue;
                    }

                    employee.ActiveAssignments = employee.Assignments.Count;
                    return true;
                }
                return false;
            }
        }

        /* 
         * Refresh/extend an active assignment. 
         * 
         * Useful if the user stays on the detail page for a 
         * long time. 
         */
        public bool Refresh(Guid assignmentId)
        {
            lock (_lock)
            {
                RemoveExpiredAssignmentsInternal(); foreach (var employee in _employees.Values)
                {
                    if (!employee.Assignments.TryGetValue(assignmentId, out var assignment))
                    {
                        continue;
                    }

                    assignment.ExpiresAt = DateTime.UtcNow.Add(AssignmentLifetime);
                    return true;
                }
                return false;
            }
        }

        /* 
         * Enable/disable an employee from receiving new 
         * assignments. 
         * 
         * Existing assignments are not removed. 
         */
        public bool SetAvailability(long employeeId, bool available)
        {
            lock (_lock)
            {
                if (!_employees.TryGetValue(employeeId, out var employee))
                {
                    return false;
                }

                employee.Available = available;
                return true;
            }
        }

        /* 
         * Remove expired assignments from every employee. 
         */
        public int RemoveExpiredAssignments()
        {
            lock (_lock)
            {
                return RemoveExpiredAssignmentsInternal();
            }
        }

        private int RemoveExpiredAssignmentsInternal()
        {
            var now = DateTime.UtcNow; var removed = 0; foreach (var employee in _employees.Values)
            {
                var expired = employee.Assignments.Where(x => x.Value.ExpiresAt <= now)
                    .Select(x => x.Key).ToList();

                foreach (var assignmentId in expired)
                {
                    if (employee.Assignments.Remove(assignmentId)) { removed++; }
                }
                employee.ActiveAssignments = employee.Assignments.Count;
            }
            return removed;
        }

        public EmployeeState? GetEmployee(long employeeId)
        {
            lock (_lock)
            {
                _employees.TryGetValue(employeeId, out var employee); return employee;
            }
        }
    }

    public sealed class EmployeeState
    {
        public long Id { get; init; }
        public string Name { get; init; } = string.Empty; public string? Avatar { get; init; }
        public string? Phone { get; init; }
        public bool Verified { get; init; } 
        
        /* 
         * Whether this employee may receive new 
         * listing-detail assignments. 
         */
        public bool Available { get; set; } = true; 
        
        /* 
         * Cached count for quick inspection. 
         * 
         * This is derived from Assignments.Count. 
         */ 
        public int ActiveAssignments { get; set; } 
        
        /* 
         * Stable ordering used by the round-robin selector. 
         */
        public int RoundRobinOrder { get; init; }
        public DateTime? LastAssignedAt { get; set; } 
        
        /* 
         * Active listing-detail sessions currently assigned 
         * to this employee. 
         */
        public Dictionary<Guid, AssignmentSession> Assignments { get; } = new();
    }

    public sealed class AssignmentSession
    {
        public Guid Id { get; init; }
        public long ListingId { get; init; }
        public long EmployeeId { get; init; }
        public DateTime CreatedAt { get; init; }
        public DateTime ExpiresAt { get; set; }
    }

    public sealed class EmployeeAssignmentResult
    {
        public Guid AssignmentId { get; init; }
        public EmployeeState Employee { get; init; } = null!; 
        public DateTime ExpiresAt { get; init; }
    }
}