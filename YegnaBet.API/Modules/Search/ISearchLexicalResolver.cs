namespace YegnaBet.API.Modules.Search;

public interface ISearchLexicalResolver
{
    IReadOnlyList<SearchToken> Resolve(
        IReadOnlyList<SearchToken> tokens);
}