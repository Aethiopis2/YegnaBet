using YegnaBet.API.Modules.Search.Models;

namespace YegnaBet.API.Modules.Search.Abstractions;

public interface ISearchConstraintGrouper
{
    SearchConstraintGroup Group(
        IReadOnlyList<SearchToken> tokens,
        IReadOnlyList<SearchConstraint> constraints);
}