namespace YegnaBet.API.Modules.Owner.Dtos;

public sealed class OwnerRecordsQueryDto
{
    public string Type { get; set; } = "listings";
    public string? Status { get; set; }
    public string? Search { get; set; }
    public string? Period { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; } = 10;
    public long? ProviderId { get; set; }
}
