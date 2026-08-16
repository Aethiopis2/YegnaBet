namespace YegnaBet.Domain.Enums
{
    /// <summary>
    /// Represents how the listing is offered, i.e. for rent or sales, service or contract.
    /// Sales - a house, land, apartment, etc. and is for sales 
    /// Rent - rent purposes
    /// Contract - On a contract basis s.a. for house labors etc
    /// Service - Plumbing, electrical, repairs, etc.
    /// </summary>
    public enum ListingKind
    {
        Sales,
        Rent,
        Contract,
        Service
    }
}