namespace YegnaBet.API.Modules.Marketplace.Dtos
{
    public sealed class AddUpdateSavedListingDto
    {
        public long UserId { get; set; }
        public long ListingId { get; set; }
        public bool Saved { get; set; }
    }
}