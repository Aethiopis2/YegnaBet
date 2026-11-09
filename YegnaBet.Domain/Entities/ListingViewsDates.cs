namespace YegnaBet.Domain.Entities;

public sealed class ListingViewsDates
{
    public long Id { get; set; }
    public long ListingId { get; set; }
    public long UserId { get; set; }
    public DateTime ViewDate { get; set; } = DateTime.UtcNow;

    public Listing Listing { get; set; } = null!;
    public User User { get; set; } = null!;
}