namespace YegnaBet.API.Modules.Search.Models;

public sealed class SearchQuery
{
    public string OriginalText { get; init; } = "";
    public SearchConstraintGroup Root { get; init; } = new()
    {
        Operator = SearchBooleanOperator.And
    };
    public SearchInterpretationStatus Status { get; init; }
    public string? FailureReason { get; init; }
}