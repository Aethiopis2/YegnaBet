using YegnaBet.API.Modules.Search.Models;

namespace YegnaBet.API.Modules.Search.Abstractions;

public interface ISearchNumericExpressionResolver
{
    IReadOnlyList<SearchNumericExpression> Resolve(
        IReadOnlyList<SearchToken> tokens);
}