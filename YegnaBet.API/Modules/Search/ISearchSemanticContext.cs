namespace YegnaBet.API.Modules.Search;

public interface ISearchSemanticContext
{
    SearchConstraintType? ResolveNumericMeaning(
        IReadOnlyList<SearchToken> tokens,
        SearchExpression expression);
}