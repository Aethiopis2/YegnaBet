namespace YegnaBet.API.Modules.Owner.Dtos;

public sealed class OwnerRecordsPageDto
{
    public List<OwnerListingsDto> Items { get; set; } = [];
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalCount { get; set; }
    public bool HasMore { get; set; }
}
