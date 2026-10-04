namespace YegnaBet.API.Modules.Search;

public sealed class SearchExpressionParser
    : ISearchExpressionParser
{
    public IReadOnlyList<SearchExpression> Parse(
        IReadOnlyList<SearchToken> tokens,
        IReadOnlyList<SearchNumericExpression> numbers)
    {
        if (tokens.Count == 0)
            return [];

        var expressions = new List<SearchExpression>();

        ParseTaxonomy(
            tokens,
            expressions);

        ParseTransactions(
            tokens,
            expressions);

        ParseNumericAttributes(
            tokens,
            numbers,
            expressions);

        ParseLocationExpressions(
            tokens,
            expressions);

        ParseNumericComparisons(
            tokens,
            numbers,
            expressions);

        return expressions;
    }

    private static void ParseTaxonomy(
        IReadOnlyList<SearchToken> tokens,
        List<SearchExpression> expressions)
    {
        for (int i = 0; i < tokens.Count; i++)
        {
            var candidate =
                tokens[i].Candidates.FirstOrDefault(
                    x =>
                        x.Type ==
                        SearchTokenCandidateType.Taxonomy);

            if (candidate is null)
                continue;

            expressions.Add(
                new SearchExpression
                {
                    Type = SearchExpressionType.Taxonomy,
                    Value = candidate,
                    StartTokenIndex = i,
                    EndTokenIndex = i
                });
        }
    }

    private static void ParseTransactions(
        IReadOnlyList<SearchToken> tokens,
        List<SearchExpression> expressions)
    {
        for (int i = 0; i < tokens.Count; i++)
        {
            var candidate =
                tokens[i].Candidates.FirstOrDefault(
                    x =>
                        x.Type ==
                        SearchTokenCandidateType.TransactionType);

            if (candidate is null)
                continue;

            expressions.Add(
                new SearchExpression
                {
                    Type = SearchExpressionType.Transaction,
                    Value = candidate,
                    StartTokenIndex = i,
                    EndTokenIndex = i
                });
        }
    }

    private static void ParseNumericAttributes(
        IReadOnlyList<SearchToken> tokens,
        IReadOnlyList<SearchNumericExpression> numbers,
        List<SearchExpression> expressions)
    {
        foreach (var number in numbers)
        {
            int attributeIndex =
                number.EndTokenIndex + 1;

            if (attributeIndex >= tokens.Count)
                continue;

            var attribute =
                tokens[attributeIndex]
                    .Candidates
                    .FirstOrDefault(
                        x =>
                            x.Type ==
                            SearchTokenCandidateType.Attribute);

            if (attribute is null)
                continue;

            expressions.Add(
                new SearchExpression
                {
                    Type = SearchExpressionType.Equality,

                    Subject = attribute,

                    NumericValue = number,

                    StartTokenIndex =
                        number.StartTokenIndex,

                    EndTokenIndex =
                        attributeIndex
                });
        }
    }

    private static void ParseLocationExpressions(
        IReadOnlyList<SearchToken> tokens,
        List<SearchExpression> expressions)
    {
        for (int i = 0; i < tokens.Count - 1; i++)
        {
            var op =
                tokens[i].Candidates.FirstOrDefault(
                    x =>
                        x.Type ==
                        SearchTokenCandidateType.Operator);

            if (op is null)
                continue;

            var location =
                tokens[i + 1]
                    .Candidates
                    .FirstOrDefault(
                        x =>
                            x.Type ==
                            SearchTokenCandidateType.Location);

            if (location is null)
                continue;

            if (!IsNearOperator(op))
                continue;

            expressions.Add(
                new SearchExpression
                {
                    Type = SearchExpressionType.Near,

                    Operator = op,

                    Value = location,

                    StartTokenIndex = i,
                    EndTokenIndex = i + 1
                });
        }
    }

    private static void ParseNumericComparisons(
        IReadOnlyList<SearchToken> tokens,
        IReadOnlyList<SearchNumericExpression> numbers,
        List<SearchExpression> expressions)
    {
        foreach (var number in numbers)
        {
            int operatorIndex =
                number.StartTokenIndex - 1;

            if (operatorIndex < 0)
                continue;

            var op =
                tokens[operatorIndex]
                    .Candidates
                    .FirstOrDefault(
                        x =>
                            x.Type ==
                            SearchTokenCandidateType.Operator);

            if (op is null)
                continue;

            if (!IsComparisonOperator(op))
                continue;

            expressions.Add(
                new SearchExpression
                {
                    Type = SearchExpressionType.Comparison,

                    Operator = op,

                    NumericValue = number,

                    StartTokenIndex = operatorIndex,

                    EndTokenIndex =
                        number.EndTokenIndex
                });
        }
    }

    private static bool IsNearOperator(
        SearchTokenCandidate candidate)
    {
        return candidate.Value?.ToLowerInvariant() switch
        {
            "near" => true,
            "around" => true,
            "close" => true,
            _ => false
        };
    }

    private static bool IsComparisonOperator(
        SearchTokenCandidate candidate)
    {
        return candidate.Value?.ToLowerInvariant() switch
        {
            "under" => true,
            "below" => true,
            "above" => true,
            "over" => true,
            _ => false
        };
    }

    private static bool IsOperator(
        SearchToken token,
        string value)
    {
        return token.Candidates.Any(x =>
            x.Type == SearchTokenCandidateType.Operator &&
            string.Equals(x.Value, value, StringComparison.OrdinalIgnoreCase));
    }

    private static SearchTokenCandidate? FindCandidate(
        SearchToken token,
        SearchTokenCandidateType type)
    {
        return token.Candidates.FirstOrDefault(x => x.Type == type);
    }
}