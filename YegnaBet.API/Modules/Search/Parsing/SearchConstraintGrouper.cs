using YegnaBet.API.Modules.Search.Abstractions;
using YegnaBet.API.Modules.Search.Models;

namespace YegnaBet.API.Modules.Search.Parsing;

public sealed class SearchConstraintGrouper
    : ISearchConstraintGrouper
{
    public SearchConstraintGroup Group(
        IReadOnlyList<SearchToken> tokens,
        IReadOnlyList<SearchConstraint> constraints)
    {
        var root = new SearchConstraintGroup
        {
            Operator = SearchBooleanOperator.And
        };

        if (constraints.Count == 0)
            return root;

        var ordered =
            constraints
                .OrderBy(x => x.StartTokenIndex)
                .ToList();

        var consumed = new HashSet<int>();

        for (int i = 0; i < ordered.Count; i++)
        {
            if (consumed.Contains(i))
                continue;

            var current = ordered[i];

            if (i + 1 < ordered.Count)
            {
                var next = ordered[i + 1];

                if (HasOrBetween(
                        tokens,
                        current,
                        next))
                {
                    var orGroup =
                        new SearchConstraintGroup
                        {
                            Operator =
                                SearchBooleanOperator.Or
                        };

                    orGroup.Constraints.Add(current);
                    orGroup.Constraints.Add(next);

                    root.Groups.Add(orGroup);

                    consumed.Add(i);
                    consumed.Add(i + 1);

                    continue;
                }
            }

            root.Constraints.Add(current);
        }

        return root;
    }

    private static bool HasOrBetween(
        IReadOnlyList<SearchToken> tokens,
        SearchConstraint left,
        SearchConstraint right)
    {
        int start =
            left.EndTokenIndex + 1;

        int end =
            right.StartTokenIndex - 1;

        for (int i = start; i <= end; i++)
        {
            if (tokens[i].Candidates.Any(x =>
                x.Type ==
                    SearchTokenCandidateType.Operator &&
                string.Equals(
                    x.Value,
                    "or",
                    StringComparison.OrdinalIgnoreCase)))
            {
                return true;
            }
        }

        return false;
    }
}