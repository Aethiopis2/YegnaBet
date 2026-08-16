using YegnaBet.Domain.Enums;

namespace YegnaBet.Domain.Entities
{
    /// <summary>
    /// The Image shown
    /// </summary>
    public class ListingImage
    {
        public long Id { get; set; }

        public long ListingId { get; set; }
        public Listing Listing { get; set; } = null!;

        public string ImageUrl { get; set; } = null!;

        public ImageKind Kind { get; set; } = ImageKind.Photo;

        public bool IsPrimary { get; set; }
    }
}