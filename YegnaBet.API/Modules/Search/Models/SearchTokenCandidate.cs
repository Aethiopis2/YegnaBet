namespace YegnaBet.API.Modules.Search.Models;

public sealed class SearchTokenCandidate
{
    public SearchTokenCandidateType Type { get; init; }
    public long? ReferenceId { get; init; }
    public string? Value { get; init; }
    public decimal? NumericValue { get; init; }
    public double Confidence { get; init; }
    public SearchNumberKind? NumberKind { get; init; }
}