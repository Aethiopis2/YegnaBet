namespace YegnaBet.API.Modules.Search;

public sealed class SearchNumericValue
{
    public decimal Value { get; init; }
    public decimal Multiplier { get; init; } = 1;
    public string? Currency { get; init; }
    public bool IsApproximate { get; init; }
}