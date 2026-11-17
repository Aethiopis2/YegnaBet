namespace YegnaBet.API.Modules.Owner.Dtos;

public sealed class OwnerCommissionQueryDto
{
    public int Page { get; set; }
    public int PageSize { get; set; } = 10;
    public string? Search { get; set; }
    public string? Method { get; set; }
    public decimal? MinAmount { get; set; }
    public decimal? MaxAmount { get; set; }
    public DateTime? From { get; set; }
    public DateTime? To { get; set; }
}
