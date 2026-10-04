namespace YegnaBet.API.Modules.Search;

public interface ISearchTokenizer
{
    IReadOnlyList<SearchToken> Tokenize(string text);
}