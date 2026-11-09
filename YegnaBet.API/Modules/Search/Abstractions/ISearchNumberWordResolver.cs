using YegnaBet.API.Modules.Search.Models;

namespace YegnaBet.API.Modules.Search.Abstractions;

public interface ISearchNumberWordResolver
{
    bool TryResolve(
        string normalizedText,
        out decimal value,
        out SearchNumberKind kind);
    public bool TryResolvePhrase(
        IReadOnlyList<string> words,
        out decimal value);
}