namespace YegnaBet.API.Modules.Search.Models;

public enum SearchConstraintType
{
    Unknown,
    Taxonomy,
    Attribute,
    Location,
    Transaction,
    Price,
    Numeric,
    Range
}