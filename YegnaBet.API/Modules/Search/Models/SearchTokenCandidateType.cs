namespace YegnaBet.API.Modules.Search.Models;

public enum SearchTokenCandidateType
{
    Unknown,
    Number,
    Taxonomy,
    Attribute,
    AttributeValue,
    Location,
    Operator,
    TransactionType,
    Currency,
    Unit
}