namespace YegnaBet.API.Modules.Search.Models;

public enum SearchTokenType
{
    Unknown,
    Word,
    Number,
    Hyphen,
    Slash,
    Punctuation,
    Taxonomy,
    Attribute,
    AttributeValue,
    Location,
    Operator,
    TransactionType
}