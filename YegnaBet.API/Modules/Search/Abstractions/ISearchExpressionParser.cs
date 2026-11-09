using YegnaBet.API.Modules.Search.Models;

namespace YegnaBet.API.Modules.Search.Abstractions;

public interface ISearchExpressionParser
{
    IReadOnlyList<SearchExpression> Parse(
        IReadOnlyList<SearchToken> tokens,
        IReadOnlyList<SearchNumericExpression> numbers);
}