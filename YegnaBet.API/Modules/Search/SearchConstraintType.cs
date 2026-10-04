namespace YegnaBet.API.Modules.Search;

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