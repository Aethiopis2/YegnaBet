using YegnaBet.API.Modules.Search.Abstractions;
using YegnaBet.API.Modules.Search.Models;

namespace YegnaBet.API.Modules.Search.Vocabulary;

public sealed class SearchVocabulary : ISearchVocabulary
{
    private readonly Dictionary<
        string,
        List<SearchTokenCandidate>> _entries =
        new(StringComparer.OrdinalIgnoreCase);

    public IReadOnlyList<SearchTokenCandidate> Lookup(
        string normalizedText)
    {
        if (_entries.TryGetValue(
                normalizedText,
                out var candidates))
        {
            return candidates;
        }

        return [];
    }

    public void Add(
        string text,
        SearchTokenCandidate candidate)
    {
        string normalized =
            text.Trim().ToLowerInvariant();

        if (!_entries.TryGetValue(
                normalized,
                out var candidates))
        {
            candidates = [];
            _entries[normalized] = candidates;
        }

        candidates.Add(candidate);
    }
}