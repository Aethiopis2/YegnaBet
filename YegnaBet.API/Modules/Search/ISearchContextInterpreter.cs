namespace YegnaBet.API.Modules.Search;

public interface ISearchContextInterpreter
{
    IReadOnlyList<SearchConstraint> Interpret(
        IReadOnlyList<SearchToken> tokens,
        IReadOnlyList<SearchExpression> expressions);
}