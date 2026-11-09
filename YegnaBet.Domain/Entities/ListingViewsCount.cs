namespace YegnaBet.Domain.Entities;

public sealed class ListingViewsCount
{
    public long Id { get; set; }
    public long ListingId { get; set; }
    public long UserId { get; set; }
    public int Count { get; set; } = 0;

    public Listing Listing { get; set; } = null!;
    public User User { get; set; } = null!;
}