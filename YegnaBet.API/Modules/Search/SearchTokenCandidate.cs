namespace YegnaBet.API.Modules.Search;

public sealed class SearchTokenCandidate
{
    public SearchTokenCandidateType Type { get; init; }

    /// <summary>
    /// ID of the referenced domain object, when applicable.
    ///
    /// Examples:
    /// Taxonomy     -> TaxonomyNode.Id
    /// Attribute    -> Attribute.Id
    /// Location     -> Location.Id
    /// </summary>
    public long? ReferenceId { get; init; }

    /// <summary>
    /// Canonical value represented by this candidate.
    ///
    /// Examples:
    /// "apartment"
    /// "bedrooms"
    /// "rent"
    /// "cmc"
    /// </summary>
    public string? Value { get; init; }

    /// <summary>
    /// Numeric value when this candidate represents a number.
    /// </summary>
    public decimal? NumericValue { get; init; }

    /// <summary>
    /// Confidence belongs to interpretation, not ranking.
    ///
    /// The parser may later use this when several interpretations
    /// are possible.
    /// </summary>
    public double Confidence { get; init; }
    public SearchNumberKind? NumberKind { get; init; }
}