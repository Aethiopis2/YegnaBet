using YegnaBet.API.Modules.Search.Abstractions;
using YegnaBet.API.Modules.Search.Models;

namespace YegnaBet.API.Modules.Search.Parsing;

public sealed class SearchExpressionParser
    : ISearchExpressionParser
{
    public IReadOnlyList<SearchExpression> Parse(
        IReadOnlyList<SearchToken> tokens,
        IReadOnlyList<SearchNumericExpression> numbers)
    {
        var expressions =
            new List<SearchExpression>();

        for (int i = 0; i < tokens.Count; i++)
        {
            ParseTaxonomy(
                tokens,
                i,
                expressions);

            ParseTransaction(
                tokens,
                i,
                expressions);

            ParseLocation(
                tokens,
                i,
                expressions);

            ParseAttribute(
                tokens,
                i,
                numbers,
                expressions);

            ParseComparison(
                tokens,
                i,
                numbers,
                expressions);

            ParseRange(
                tokens,
                i,
                numbers,
                expressions);

            ParseNear(
                tokens,
                i,
                expressions);
        }

        return RemoveDuplicateExpressions(expressions);
    }

    private static void ParseTaxonomy(
        IReadOnlyList<SearchToken> tokens,
        int i,
        List<SearchExpression> result)
    {
        var candidate =
            FindCandidate(
                tokens[i],
                SearchTokenCandidateType.Taxonomy);

        if (candidate is null)
            return;

        result.Add(new SearchExpression
        {
            Type = SearchExpressionType.Taxonomy,
            Value = candidate,
            StartTokenIndex = i,
            EndTokenIndex = i
        });
    }

    private static void ParseTransaction(
        IReadOnlyList<SearchToken> tokens,
        int i,
        List<SearchExpression> result)
    {
        var candidate =
            FindCandidate(
                tokens[i],
                SearchTokenCandidateType.TransactionType);

        if (candidate is null)
            return;

        result.Add(new SearchExpression
        {
            Type =
                SearchExpressionType.Transaction,

            Value = candidate,

            StartTokenIndex = i,

            EndTokenIndex = i
        });
    }

    private static void ParseLocation(
        IReadOnlyList<SearchToken> tokens,
        int i,
        List<SearchExpression> result)
    {
        var location =
            FindCandidate(
                tokens[i],
                SearchTokenCandidateType.Location);

        if (location is null)
            return;

        // Standalone location is valid.
        if (i == 0 ||
            !IsOperator(tokens[i - 1], "in"))
        {
            result.Add(new SearchExpression
            {
                Type =
                    SearchExpressionType.Location,

                Value = location,

                StartTokenIndex = i,

                EndTokenIndex = i
            });

            return;
        }

        result.Add(new SearchExpression
        {
            Type =
                SearchExpressionType.Location,

            Value = location,

            StartTokenIndex = i - 1,

            EndTokenIndex = i
        });
    }

    private static void ParseAttribute(
        IReadOnlyList<SearchToken> tokens,
        int i,
        IReadOnlyList<SearchNumericExpression> numbers,
        List<SearchExpression> result)
    {
        var attribute =
            FindCandidate(
                tokens[i],
                SearchTokenCandidateType.Attribute);

        if (attribute is null)
            return;

        var number =
            FindNumericImmediatelyBefore(
                numbers,
                i);

        if (number is null)
            return;

        result.Add(new SearchExpression
        {
            Type =
                SearchExpressionType.Equality,

            Subject = attribute,

            NumericValue = number,

            StartTokenIndex =
                number.StartTokenIndex,

            EndTokenIndex = i
        });
    }

    private static void ParseComparison(
        IReadOnlyList<SearchToken> tokens,
        int i,
        IReadOnlyList<SearchNumericExpression> numbers,
        List<SearchExpression> result)
    {
        string? op =
            GetOperator(tokens[i]);

        if (op is null)
            return;

        if (!IsComparisonOperator(op))
            return;

        var number =
            FindNumericAfter(
                numbers,
                i);

        if (number is null)
            return;

        result.Add(new SearchExpression
        {
            Type =
                SearchExpressionType.Comparison,

            Operator =
                new SearchTokenCandidate
                {
                    Type =
                        SearchTokenCandidateType.Operator,

                    Value = op,

                    Confidence = 1.0
                },

            NumericValue = number,

            StartTokenIndex = i,

            EndTokenIndex =
                number.EndTokenIndex
        });
    }

    private static void ParseRange(
        IReadOnlyList<SearchToken> tokens,
        int i,
        IReadOnlyList<SearchNumericExpression> numbers,
        List<SearchExpression> result)
    {
        if (!IsOperator(tokens[i], "between"))
            return;

        var first =
            FindNumericAfter(
                numbers,
                i);

        if (first is null)
            return;

        int andIndex =
            FindOperator(
                tokens,
                "and",
                first.EndTokenIndex + 1);

        if (andIndex < 0)
            return;

        var second =
            FindNumericAfter(
                numbers,
                andIndex);

        if (second is null)
            return;

        result.Add(new SearchExpression
        {
            Type =
                SearchExpressionType.Range,

            NumericValue = first,

            SecondNumericValue = second,

            StartTokenIndex = i,

            EndTokenIndex =
                second.EndTokenIndex
        });
    }

    private static void ParseNear(
        IReadOnlyList<SearchToken> tokens,
        int i,
        List<SearchExpression> result)
    {
        string? op =
            GetOperator(tokens[i]);

        if (op is not
            ("near" or "around" or "close"))
        {
            return;
        }

        if (i + 1 >= tokens.Count)
            return;

        var location =
            FindCandidate(
                tokens[i + 1],
                SearchTokenCandidateType.Location);

        if (location is null)
            return;

        result.Add(new SearchExpression
        {
            Type = SearchExpressionType.Near,

            Value = location,

            Operator =
                new SearchTokenCandidate
                {
                    Type =
                        SearchTokenCandidateType.Operator,

                    Value = op,

                    Confidence = 1.0
                },

            StartTokenIndex = i,

            EndTokenIndex = i + 1
        });
    }

    private static SearchNumericExpression?
        FindNumericImmediatelyBefore(
            IReadOnlyList<SearchNumericExpression> numbers,
            int index)
    {
        return numbers.FirstOrDefault(x =>
            x.EndTokenIndex == index - 1);
    }

    private static SearchNumericExpression?
        FindNumericAfter(
            IReadOnlyList<SearchNumericExpression> numbers,
            int index)
    {
        return numbers.FirstOrDefault(x =>
            x.StartTokenIndex > index);
    }

    private static int FindOperator(
        IReadOnlyList<SearchToken> tokens,
        string value,
        int start)
    {
        for (int i = start; i < tokens.Count; i++)
        {
            if (IsOperator(tokens[i], value))
                return i;
        }

        return -1;
    }

    private static string? GetOperator(
        SearchToken token)
    {
        return token.Candidates
            .FirstOrDefault(x =>
                x.Type ==
                SearchTokenCandidateType.Operator)
            ?.Value;
    }

    private static bool IsOperator(
        SearchToken token,
        string value)
    {
        return string.Equals(
            GetOperator(token),
            value,
            StringComparison.OrdinalIgnoreCase);
    }

    private static bool IsComparisonOperator(
        string value)
    {
        return value is
            "under" or
            "below" or
            "less" or
            "over" or
            "above" or
            "more";
    }

    private static SearchTokenCandidate?
        FindCandidate(
            SearchToken token,
            SearchTokenCandidateType type)
    {
        return token.Candidates.FirstOrDefault(
            x => x.Type == type);
    }

    private static IReadOnlyList<SearchExpression>
        RemoveDuplicateExpressions(
            List<SearchExpression> expressions)
    {
        return expressions
            .GroupBy(x => new
            {
                x.Type,
                x.StartTokenIndex,
                x.EndTokenIndex
            })
            .Select(x => x.First())
            .ToList();
    }
}