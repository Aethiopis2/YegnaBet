namespace YegnaBet.API.Modules.Search;

public sealed class SearchExpression
{
    public SearchExpressionType Type { get; init; }
    public SearchTokenCandidate? Subject { get; init; }
    public SearchTokenCandidate? Value { get; init; }
    public SearchNumericExpression? NumericValue { get; init; }
    public SearchTokenCandidate? Operator { get; init; }
    public int StartTokenIndex { get; init; }
    public int EndTokenIndex { get; init; }
}