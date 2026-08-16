namespace YegnaBet.Domain.Enums
{
    /// <summary>
    /// Represents who a user is in the system. A customer is looking for a
    ///     house or an expert. A provider owns the house or provides the service.
    ///     A broker manages inquires and earns comission. Admin manages the platform.
    /// </summary>
    public enum UserRole
    {
        Customer,
        Provider,
        Employee,
        Admin
    }
}