namespace YegnaBet.Domain.Enums
{
    /// <summary>
    /// Repersents the financial outcome of a deal.
    /// Pending - its ongoing 
    /// Successful - deal compeleted and comission earned
    /// Failed - no comission
    /// </summary>
   public enum DealStatus
    {
        Pending,
        Successful,
        Failed
    }
}