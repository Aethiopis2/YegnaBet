namespace YegnaBet.API.Modules.Search.Models;

public sealed class SearchNumericExpression
{
    public decimal Value { get; init; }
    public string? Currency { get; init; }
    public decimal Multiplier { get; init; } = 1m;
    public bool IsApproximate { get; init; }
    public int StartTokenIndex { get; init; }
    public int EndTokenIndex { get; init; }
    public string OriginalText { get; init; } = "";
}