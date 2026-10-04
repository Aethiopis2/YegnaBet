namespace YegnaBet.API.Modules.Search;

public sealed class NormalizedToken
{
    public string Original { get; init; } = "";
    public string Normalized { get; init; } = "";
    public int Start { get; init; }
    public int Length { get; init; }
}