namespace YegnaBet.API.Modules.Search;

public sealed class SearchSemanticContext
    : ISearchSemanticContext
{
    public SearchConstraintType? ResolveNumericMeaning(
        IReadOnlyList<SearchToken> tokens,
        SearchExpression expression)
    {
        if (expression.NumericValue is null)
            return null;

        if (HasPriceIndicator(
                tokens,
                expression))
        {
            return SearchConstraintType.Price;
        }

        return null;
    }

    private static bool HasPriceIndicator(
        IReadOnlyList<SearchToken> tokens,
        SearchExpression expression)
    {
        int start =
            Math.Max(
                0,
                expression.StartTokenIndex - 2);

        int end =
            Math.Min(
                tokens.Count - 1,
                expression.EndTokenIndex + 2);

        for (int i = start; i <= end; i++)
        {
            foreach (var candidate in tokens[i].Candidates)
            {
                if (candidate.Type ==
                    SearchTokenCandidateType.Currency)
                {
                    return true;
                }
            }

            string text =
                tokens[i].Text.ToLowerInvariant();

            if (text is
                "price" or
                "cost" or
                "rent" or
                "rental" or
                "birr" or
                "etb" or
                "ብር")
            {
                return true;
            }
        }

        return false;
    }
}