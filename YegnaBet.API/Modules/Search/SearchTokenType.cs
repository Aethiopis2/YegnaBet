namespace YegnaBet.API.Modules.Search;

public enum SearchTokenType
{
    Unknown,

    // Lexical tokens
    Word,
    Number,

    // Structural tokens
    Hyphen,
    Slash,
    Punctuation,

    // Reserved for later semantic stages
    Taxonomy,
    Attribute,
    AttributeValue,
    Location,
    Operator,
    TransactionType
}