/**
 * @author Rediet Worku, Dr. 
 * @date 20th of August 2026, Thursday.
 */
namespace YegnaBet.Domain.Enums
{
    /// <summary>
    /// Represents how the listing is offered, i.e. for rent or sales, 
    ///     service or contract. A service is a one time job.
    /// </summary>
    public enum ListingMethod
    {
        Sales,
        Rent,
        Contract,
        Service
    } // end ListingMethod
} // end namespace