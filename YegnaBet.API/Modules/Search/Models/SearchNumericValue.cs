namespace YegnaBet.API.Modules.Search.Models;

public sealed class SearchNumericValue
{
    public decimal Value { get; init; }
    public decimal Multiplier { get; init; } = 1m;
    public string? Currency { get; init; }
    public bool IsApproximate { get; init; }
}