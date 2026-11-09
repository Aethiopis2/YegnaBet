namespace YegnaBet.API.Modules.Search.Models;

public sealed class SearchConstraintGroup
{
    public SearchBooleanOperator Operator { get; init; }
    public List<SearchConstraint> Constraints { get; } = [];
    public List<SearchConstraintGroup> Groups { get; } = [];
}