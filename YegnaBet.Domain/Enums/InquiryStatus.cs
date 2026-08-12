namespace YegnaBet.Domain.Enums
{
    /// <summary>
    /// Represents the basic pipline of the broker's sales.
    /// New - customer just requested a call
    /// Called - broker made contact
    /// Visied - customer viewed the property/service or viewd video links.
    /// Completed - deal succeeded
    /// Cancelled - lead failed
    /// </summary>
    public enum InquiryStatus
    {
        New,
        Called,
        Visited,
        Negotitating,
        Completed,
        Cancelled
    }
}