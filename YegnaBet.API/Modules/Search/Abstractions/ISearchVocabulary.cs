using YegnaBet.API.Modules.Search.Models;

namespace YegnaBet.API.Modules.Search.Abstractions;

public interface ISearchVocabulary
{
    IReadOnlyList<SearchTokenCandidate> Lookup(string normalizedText);
    void Add(string text, SearchTokenCandidate candidate);
}