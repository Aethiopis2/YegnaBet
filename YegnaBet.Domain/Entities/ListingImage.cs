using System;
using System.Collections.Generic;
using System.Text;

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

        public bool IsPrimary { get; set; }
    }
}