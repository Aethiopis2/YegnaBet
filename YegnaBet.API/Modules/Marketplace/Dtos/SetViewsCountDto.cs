namespace YegnaBet.API.Modules.Marketplace.Dtos;

public sealed class SetViewsCountDto
{
    public long ListingId { get; set; }
    public long? UserId { get; set; }
}