using YegnaBet.API.Modules.Search.Abstractions;
using YegnaBet.API.Modules.Search.Models;

namespace YegnaBet.API.Modules.Search.Parsing;

public sealed class SearchQueryValidator
    : ISearchQueryValidator
{
    public SearchInterpretationStatus Validate(
        SearchConstraintGroup root)
    {
        bool hasConstraints =
            root.Constraints.Count > 0 ||
            root.Groups.Count > 0;

        if (!hasConstraints)
            return SearchInterpretationStatus.Unknown;

        if (ContainsAmbiguous(root))
            return SearchInterpretationStatus.Ambiguous;

        if (ContainsLikely(root))
            return SearchInterpretationStatus.Likely;

        return SearchInterpretationStatus.Certain;
    }

    private static bool ContainsAmbiguous(
        SearchConstraintGroup group)
    {
        foreach (var constraint in group.Constraints)
        {
            if (constraint.Confidence < 0.5)
                return true;
        }

        foreach (var child in group.Groups)
        {
            if (ContainsAmbiguous(child))
                return true;
        }

        return false;
    }

    private static bool ContainsLikely(
        SearchConstraintGroup group)
    {
        foreach (var constraint in group.Constraints)
        {
            if (constraint.Confidence < 0.8)
                return true;
        }

        foreach (var child in group.Groups)
        {
            if (ContainsLikely(child))
                return true;
        }

        return false;
    }
}