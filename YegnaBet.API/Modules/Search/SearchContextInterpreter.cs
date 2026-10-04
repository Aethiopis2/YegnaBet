namespace YegnaBet.API.Modules.Search;

public sealed class SearchContextInterpreter
    : ISearchContextInterpreter
{
    private readonly ISearchSemanticContext _semanticContext;

    public SearchContextInterpreter(
        ISearchSemanticContext semanticContext)
    {
        _semanticContext = semanticContext;
    }

    public IReadOnlyList<SearchConstraint> Interpret(
        IReadOnlyList<SearchToken> tokens,
        IReadOnlyList<SearchExpression> expressions)
    {
        var constraints = new List<SearchConstraint>();

        foreach (var expression in expressions)
        {
            switch (expression.Type)
            {
                case SearchExpressionType.Taxonomy:
                    InterpretTaxonomy(expression, constraints);
                    break;

                case SearchExpressionType.Transaction:
                    InterpretTransaction(
                        expression,
                        constraints);
                    break;

                case SearchExpressionType.Equality:
                    InterpretEquality(
                        expression,
                        constraints);
                    break;

                case SearchExpressionType.Near:
                    InterpretNear(
                        expression,
                        constraints);
                    break;

                case SearchExpressionType.Comparison:
                    InterpretComparison(
                        tokens,
                        expression,
                        constraints);
                    break;
            }
        }

        return constraints;
    }

    private static void InterpretTaxonomy(
    SearchExpression expression,
    List<SearchConstraint> constraints)
    {
        if (expression.Value is null)
            return;

        constraints.Add(
            new SearchConstraint
            {
                Type = SearchConstraintType.Taxonomy,

                ReferenceId =
                    expression.Value.ReferenceId,

                Value =
                    expression.Value.Value,

                Confidence =
                    expression.Value.Confidence,

                StartTokenIndex =
                    expression.StartTokenIndex,

                EndTokenIndex =
                    expression.EndTokenIndex
            });
    }


    private static void InterpretEquality(
    SearchExpression expression,
    List<SearchConstraint> constraints)
    {
        if (expression.Subject is null)
            return;

        if (expression.NumericValue is not null)
        {
            constraints.Add(
                new SearchConstraint
                {
                    Type =
                        SearchConstraintType.Attribute,

                    ReferenceId =
                        expression.Subject.ReferenceId,

                    Value =
                        expression.Subject.Value,

                    NumericValue =
                        expression.NumericValue.Value,

                    Operator =
                        SearchExpressionType.Equality,

                    Confidence =
                        expression.Subject.Confidence,

                    StartTokenIndex =
                        expression.StartTokenIndex,

                    EndTokenIndex =
                        expression.EndTokenIndex
                });

            return;
        }

        if (expression.Value is not null)
        {
            constraints.Add(
                new SearchConstraint
                {
                    Type =
                        SearchConstraintType.Attribute,

                    ReferenceId =
                        expression.Subject.ReferenceId,

                    Value =
                        expression.Subject.Value,

                    Operator =
                        SearchExpressionType.Equality,

                    Confidence =
                        expression.Subject.Confidence,

                    StartTokenIndex =
                        expression.StartTokenIndex,

                    EndTokenIndex =
                        expression.EndTokenIndex
                });
        }
    }


    private static void InterpretTransaction(
    SearchExpression expression,
    List<SearchConstraint> constraints)
    {
        if (expression.Value is null)
            return;

        constraints.Add(
            new SearchConstraint
            {
                Type =
                    SearchConstraintType.Transaction,

                ReferenceId =
                    expression.Value.ReferenceId,

                Value =
                    expression.Value.Value,

                Confidence =
                    expression.Value.Confidence,

                StartTokenIndex =
                    expression.StartTokenIndex,

                EndTokenIndex =
                    expression.EndTokenIndex
            });
    }


    private static void InterpretNear(
    SearchExpression expression,
    List<SearchConstraint> constraints)
    {
        if (expression.Value is null)
            return;

        constraints.Add(
            new SearchConstraint
            {
                Type =
                    SearchConstraintType.Location,

                ReferenceId =
                    expression.Value.ReferenceId,

                Value =
                    expression.Value.Value,

                Operator =
                    SearchExpressionType.Near,

                Confidence =
                    expression.Value.Confidence,

                StartTokenIndex =
                    expression.StartTokenIndex,

                EndTokenIndex =
                    expression.EndTokenIndex
            });
    }


    private static string? FindNearbyCurrency(
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
                tokens[i]
                    .Candidates
                    .FirstOrDefault(
                        x =>
                            x.Type ==
                            SearchTokenCandidateType.Currency);

            if (currency?.Value is not null)
                return currency.Value;
        }

        return null;
    }

    private void InterpretComparison(
        IReadOnlyList<SearchToken> tokens,
        SearchExpression expression,
        List<SearchConstraint> constraints)
    {
        if (expression.NumericValue is null)
            return;

        var number =
            expression.NumericValue.Value;

        SearchConstraintType? meaning =
            _semanticContext.ResolveNumericMeaning(
                tokens,
                expression);

        string? currency =
            FindNearbyCurrency(
                tokens,
                expression);

        constraints.Add(
            new SearchConstraint
            {
                Type =
                    meaning ??
                    SearchConstraintType.Numeric,

                NumericValue =
                    number,

                Currency =
                    currency,

                Operator =
                    expression.Type,

                Confidence =
                    meaning is null
                        ? 0.5
                        : 0.9,

                StartTokenIndex =
                    expression.StartTokenIndex,

                EndTokenIndex =
                    expression.EndTokenIndex
            });
    }
}