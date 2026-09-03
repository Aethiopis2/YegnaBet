namespace YegnaBet.API.Modules.Marketplace.Services
{
    public sealed class EmployeeAssignmentService
    {
        private readonly EmployeeAssignmentState _state;

        public EmployeeAssignmentService(
            EmployeeAssignmentState state)
        {
            _state = state;
        }

        public EmployeeAssignmentResult? Assign(long listingId)
        {
            return _state.Assign(listingId);
        }

        public AssignmentSession? GetAssignment(
            Guid assignmentId)
        {
            return _state.GetAssignment(assignmentId);
        }

        public bool Release(
            Guid assignmentId)
        {
            return _state.Release(
                assignmentId);
        }

        public bool Refresh(
            Guid assignmentId)
        {
            return _state.Refresh(
                assignmentId);
        }

        public bool SetAvailability(
            long employeeId,
            bool available)
        {
            return _state.SetAvailability(
                employeeId,
                available);
        }

        public int CleanupExpired()
        {
            return _state.RemoveExpiredAssignments();
        }
    }
}