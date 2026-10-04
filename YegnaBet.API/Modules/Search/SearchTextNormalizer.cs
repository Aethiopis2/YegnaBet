namespace YegnaBet.API.Modules.Search;

public sealed class SearchTextNormalizer : ISearchTextNormalizer
{
    public string Normalize(string text)
    {
        if (string.IsNullOrWhiteSpace(text))
            return string.Empty;

        return text
            .Trim()
            .ToLowerInvariant();
    }
}