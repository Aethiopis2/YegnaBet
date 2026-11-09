using YegnaBet.API.Modules.Search.Models;

namespace YegnaBet.API.Modules.Search.Abstractions;

public interface ISearchContextInterpreter
{
    IReadOnlyList<SearchConstraint> Interpret(
        IReadOnlyList<SearchToken> tokens,
        IReadOnlyList<SearchExpression> expressions);
}