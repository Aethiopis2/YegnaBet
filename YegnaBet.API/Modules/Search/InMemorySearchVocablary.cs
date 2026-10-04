namespace YegnaBet.API.Modules.Search;

public sealed class InMemorySearchVocabulary : ISearchVocabulary
{
    private readonly Dictionary<
        string,
        List<SearchTokenCandidate>> _entries =
        new(StringComparer.OrdinalIgnoreCase);

    public IReadOnlyList<SearchTokenCandidate> Lookup(
        string normalizedText)
    {
        if (_entries.TryGetValue(normalizedText, out var candidates))
            return candidates;

        return [];
    }

    public void Add(
        string text,
        SearchTokenCandidate candidate)
    {
        string normalized = text.Trim().ToLowerInvariant();

        if (!_entries.TryGetValue(normalized, out var candidates))
        {
            candidates = [];
            _entries[normalized] = candidates;
        }

        candidates.Add(candidate);
    }

    public void Add(
        string text,
        params SearchTokenCandidate[] candidates)
    {
        foreach (var candidate in candidates)
            Add(text, candidate);
    }
}