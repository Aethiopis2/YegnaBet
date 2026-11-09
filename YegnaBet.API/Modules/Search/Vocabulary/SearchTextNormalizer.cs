namespace YegnaBet.API.Modules.Search.Vocabulary;

public interface ISearchTextNormalizer
{
    string Normalize(string text);
}

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