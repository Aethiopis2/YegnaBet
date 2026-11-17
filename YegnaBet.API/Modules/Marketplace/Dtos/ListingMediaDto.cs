namespace YegnaBet.API.Modules.Marketplace.Dtos;

public sealed class ListingMediaDto
{
    public string Url { get; set; } = "";
    public string Kind { get; set; } = "photo";
    public bool IsPrimary { get; set; }
}
