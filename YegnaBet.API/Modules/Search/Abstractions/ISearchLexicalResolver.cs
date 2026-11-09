using YegnaBet.API.Modules.Search.Models;

namespace YegnaBet.API.Modules.Search.Abstractions;

public interface ISearchLexicalResolver
{
    IReadOnlyList<SearchToken> Resolve(
        IReadOnlyList<SearchToken> tokens);
}