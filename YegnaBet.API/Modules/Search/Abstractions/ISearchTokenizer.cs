using YegnaBet.API.Modules.Search.Models;

namespace YegnaBet.API.Modules.Search.Abstractions;

public interface ISearchTokenizer
{
    IReadOnlyList<SearchToken> Tokenize(string text);
}