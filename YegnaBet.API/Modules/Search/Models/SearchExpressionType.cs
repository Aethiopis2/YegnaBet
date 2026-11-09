namespace YegnaBet.API.Modules.Search.Models;

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