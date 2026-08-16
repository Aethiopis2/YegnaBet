namespace YegnaBet.Domain.Enums
{
    /// <summary>
    /// This defines if a Listing is available. A listing can be an object such as house or land,
    ///     or a service provided or an expert providing the service. Draft is when its on initial
    ///     states, i.e. verifications and all. Active visibile to users. Paused temporarily not visible.
    ///     Closed, permanently not visible.
    /// </summary>
    public enum ListingStatus
    {
        Draft,
        Active,
        Pending,
        Closed
    }
}