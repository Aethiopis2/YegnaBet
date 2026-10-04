namespace YegnaBet.API.Modules.Search
{
    public enum SearchBooleanOperator
    {
        And,
        Or
    }


    public sealed class SearchConstraintGroup
    {
        public SearchBooleanOperator Operator { get; init; }
        public List<SearchConstraint> Constraints { get; } = [];
        public List<SearchConstraintGroup> Groups { get; } = [];
    }
}
