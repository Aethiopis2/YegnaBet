namespace YegnaBet.API.Modules.Search.Models;

public sealed class SearchConstraint
{
    public SearchConstraintType Type { get; init; }
    public long? ReferenceId { get; init; }
    public string? Value { get; init; }
    public decimal? NumericValue { get; init; }
    public decimal? SecondNumericValue { get; init; }
    public string? Currency { get; init; }
    public SearchExpressionType Operator { get; init; }
    public double Confidence { get; init; } = 1.0;
    public SearchInterpretationStatus Status { get; init; }
        = SearchInterpretationStatus.Certain;
    public int StartTokenIndex { get; init; }
    public int EndTokenIndex { get; init; }
}