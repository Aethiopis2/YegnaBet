namespace YegnaBet.API.Modules.Search;

public interface ISearchNumericExpressionResolver
{
    IReadOnlyList<SearchNumericExpression> Resolve(
        IReadOnlyList<SearchToken> tokens);
}