namespace YegnaBet.API.Modules.Search
{
    public sealed class SearchQuery
    {
        public SearchConstraintGroup Root { get; init; } = new()
        {
            Operator = SearchBooleanOperator.And
        };

        public SearchInterpretationStatus Status { get; init; }
        public string? FailureReason { get; init; }
    }
}
