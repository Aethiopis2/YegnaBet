using YegnaBet.API.Modules.Search.Abstractions;
using YegnaBet.API.Modules.Search.Models;

namespace YegnaBet.API.Modules.Search.Parsing;

public sealed class SearchContextInterpreter
    : ISearchContextInterpreter
{
    public IReadOnlyList<SearchConstraint> Interpret(
        IReadOnlyList<SearchToken> tokens,
        IReadOnlyList<SearchExpression> expressions)
    {
        var result =
            new List<SearchConstraint>();

        foreach (var expression in expressions)
        {
            switch (expression.Type)
            {
                case SearchExpressionType.Taxonomy:
                    AddTaxonomy(
                        expression,
                        result);
                    break;

                case SearchExpressionType.Transaction:
                    AddTransaction(
                        expression,
                        result);
                    break;

                case SearchExpressionType.Location:
                    AddLocation(
                        expression,
                        result);
                    break;

                case SearchExpressionType.Near:
                    AddNear(
                        expression,
                        result);
                    break;

                case SearchExpressionType.Equality:
                    AddEquality(
                        expression,
                        result);
                    break;

                case SearchExpressionType.Comparison:
                    AddComparison(
                        tokens,
                        expression,
                        result);
                    break;

                case SearchExpressionType.Range:
                    AddRange(
                        tokens,
                        expression,
                        result);
                    break;
            }
        }

        return RemoveDuplicates(result);
    }

    private static void AddTaxonomy(
        SearchExpression expression,
        List<SearchConstraint> result)
    {
        var candidate = expression.Value!;

        result.Add(new SearchConstraint
        {
            Type =
                SearchConstraintType.Taxonomy,

            ReferenceId =
                candidate.ReferenceId,

            Value =
                candidate.Value,

            Confidence =
                candidate.Confidence,

            StartTokenIndex =
                expression.StartTokenIndex,

            EndTokenIndex =
                expression.EndTokenIndex
        });
    }

    private static void AddTransaction(
        SearchExpression expression,
        List<SearchConstraint> result)
    {
        var candidate = expression.Value!;

        result.Add(new SearchConstraint
        {
            Type =
                SearchConstraintType.Transaction,

            ReferenceId =
                candidate.ReferenceId,

            Value =
                candidate.Value,

            Confidence =
                candidate.Confidence,

            StartTokenIndex =
                expression.StartTokenIndex,

            EndTokenIndex =
                expression.EndTokenIndex
        });
    }

    private static void AddLocation(
        SearchExpression expression,
        List<SearchConstraint> result)
    {
        var candidate = expression.Value!;

        result.Add(new SearchConstraint
        {
            Type =
                SearchConstraintType.Location,

            ReferenceId =
                candidate.ReferenceId,

            Value =
                candidate.Value,

            Operator =
                SearchExpressionType.Location,

            Confidence =
                candidate.Confidence,

            StartTokenIndex =
                expression.StartTokenIndex,

            EndTokenIndex =
                expression.EndTokenIndex
        });
    }

    private static void AddNear(
        SearchExpression expression,
        List<SearchConstraint> result)
    {
        var candidate = expression.Value!;

        result.Add(new SearchConstraint
        {
            Type =
                SearchConstraintType.Location,

            ReferenceId =
                candidate.ReferenceId,

            Value =
                candidate.Value,

            Operator =
                SearchExpressionType.Near,

            Confidence =
                candidate.Confidence,

            StartTokenIndex =
                expression.StartTokenIndex,

            EndTokenIndex =
                expression.EndTokenIndex
        });
    }

    private static void AddEquality(
        SearchExpression expression,
        List<SearchConstraint> result)
    {
        var attribute = expression.Subject!;
        var number = expression.NumericValue!;

        result.Add(new SearchConstraint
        {
            Type =
                SearchConstraintType.Attribute,

            ReferenceId =
                attribute.ReferenceId,

            Value =
                attribute.Value,

            NumericValue =
                number.Value,

            Currency =
                number.Currency,

            Operator =
                SearchExpressionType.Equality,

            Confidence =
                attribute.Confidence,

            StartTokenIndex =
                expression.StartTokenIndex,

            EndTokenIndex =
                expression.EndTokenIndex
        });
    }

    private static void AddComparison(
        IReadOnlyList<SearchToken> tokens,
        SearchExpression expression,
        List<SearchConstraint> result)
    {
        var number =
            expression.NumericValue!;

        bool hasCurrency =
            HasCurrencyNear(
                tokens,
                expression);

        bool hasPriceContext =
            HasPriceContext(
                tokens,
                expression);

        var type =
            hasCurrency || hasPriceContext
                ? SearchConstraintType.Price
                : SearchConstraintType.Numeric;

        double confidence =
            type == SearchConstraintType.Price
                ? 1.0
                : 0.45;

        result.Add(new SearchConstraint
        {
            Type = type,

            NumericValue =
                number.Value,

            Currency =
                FindCurrency(
                    tokens,
                    expression),

            Operator =
                SearchExpressionType.Comparison,

            Confidence = confidence,

            Status =
                confidence >= 0.8
                    ? SearchInterpretationStatus.Certain
                    : SearchInterpretationStatus.Ambiguous,

            StartTokenIndex =
                expression.StartTokenIndex,

            EndTokenIndex =
                expression.EndTokenIndex
        });
    }

    private static void AddRange(
        IReadOnlyList<SearchToken> tokens,
        SearchExpression expression,
        List<SearchConstraint> result)
    {
        bool hasCurrency =
            HasCurrencyNear(
                tokens,
                expression);

        bool hasPriceContext =
            HasPriceContext(
                tokens,
                expression);

        var type =
            hasCurrency || hasPriceContext
                ? SearchConstraintType.Price
                : SearchConstraintType.Range;

        double confidence =
            type == SearchConstraintType.Price
                ? 1.0
                : 0.45;

        result.Add(new SearchConstraint
        {
            Type = type,

            NumericValue =
                expression.NumericValue!.Value,

            SecondNumericValue =
                expression.SecondNumericValue!.Value,

            Currency =
                FindCurrency(
                    tokens,
                    expression),

            Operator =
                SearchExpressionType.Range,

            Confidence = confidence,

            Status =
                confidence >= 0.8
                    ? SearchInterpretationStatus.Certain
                    : SearchInterpretationStatus.Ambiguous,

            StartTokenIndex =
                expression.StartTokenIndex,

            EndTokenIndex =
                expression.EndTokenIndex
        });
    }

    private static bool HasCurrencyNear(
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
            if (tokens[i].Candidates.Any(x =>
                x.Type ==
                SearchTokenCandidateType.Currency))
            {
                return true;
            }
        }

        return false;
    }

    private static string? FindCurrency(
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
            var currency =
                tokens[i].Candidates.FirstOrDefault(
                    x =>
                        x.Type ==
                        SearchTokenCandidateType.Currency);

            if (currency is not null)
                return currency.Value;
        }

        return null;
    }

    private static bool HasPriceContext(
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

        string[] words =
        [
            "price",
            "cost",
            "rent",
            "rental",
            "birr",
            "etb",
            "ብር"
        ];

        for (int i = start; i <= end; i++)
        {
            if (words.Contains(
                    tokens[i].Text,
                    StringComparer.OrdinalIgnoreCase))
            {
                return true;
            }
        }

        return false;
    }

    private static IReadOnlyList<SearchConstraint>
        RemoveDuplicates(
            List<SearchConstraint> constraints)
    {
        return constraints
            .GroupBy(x => new
            {
                x.Type,
                x.ReferenceId,
                x.NumericValue,
                x.SecondNumericValue,
                x.StartTokenIndex,
                x.EndTokenIndex
            })
            .Select(x => x.First())
            .ToList();
    }
}