namespace YegnaBet.API.Modules.Search;

public enum SearchExpressionType
{
    Unknown,

    Equality,
    Comparison,
    Range,

    Contains,
    Near,

    Taxonomy,
    Attribute,
    Location,
    Transaction
}