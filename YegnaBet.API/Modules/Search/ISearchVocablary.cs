namespace YegnaBet.API.Modules.Search;

public interface ISearchVocabulary
{
    IReadOnlyList<SearchTokenCandidate> Lookup(
        string normalizedText);
}