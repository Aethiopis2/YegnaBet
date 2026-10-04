namespace YegnaBet.Domain.Entities;

public sealed class SavedListings
{
    public long Id { get; set; }
    public long ListingId { get; set; }
    public long UserId { get; set; }
    public bool IsDeleted { get; set; } = false;

    public Listing Listing { get; set; } = null!;
    public User User { get; set; } = null!;
}