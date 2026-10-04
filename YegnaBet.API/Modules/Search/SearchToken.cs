namespace YegnaBet.API.Modules.Search;

public sealed class SearchToken
{
    public string Text { get; init; } = "";
    public int Start { get; init; }
    public int Length { get; init; }
    public SearchTokenType Type { get; set; }
    public SearchNumericValue? NumericValue { get; set; }
    public List<SearchTokenCandidate> Candidates { get; } = [];
}