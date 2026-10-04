namespace YegnaBet.API.Modules.Search;

public interface ISearchExpressionParser
{
    IReadOnlyList<SearchExpression> Parse(
        IReadOnlyList<SearchToken> tokens,
        IReadOnlyList<SearchNumericExpression> numbers);
}