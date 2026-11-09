using YegnaBet.API.Modules.Search.Models;

namespace YegnaBet.API.Modules.Search.Abstractions;

public interface ISearchQueryValidator
{
    SearchInterpretationStatus Validate(
        SearchConstraintGroup root);
}