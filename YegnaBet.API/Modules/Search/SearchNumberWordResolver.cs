namespace YegnaBet.API.Modules.Search;

public sealed class SearchNumberWordResolver
    : ISearchNumberWordResolver
{
    private static readonly Dictionary<
        string,
        (decimal Value, SearchNumberKind Kind)>
        Numbers =
            new(StringComparer.OrdinalIgnoreCase)
            {
                ["zero"] = (0, SearchNumberKind.Value),
                ["one"] = (1, SearchNumberKind.Value),
                ["two"] = (2, SearchNumberKind.Value),
                ["three"] = (3, SearchNumberKind.Value),
                ["four"] = (4, SearchNumberKind.Value),
                ["five"] = (5, SearchNumberKind.Value),
                ["six"] = (6, SearchNumberKind.Value),
                ["seven"] = (7, SearchNumberKind.Value),
                ["eight"] = (8, SearchNumberKind.Value),
                ["nine"] = (9, SearchNumberKind.Value),
                ["ten"] = (10, SearchNumberKind.Value),

                ["eleven"] = (11, SearchNumberKind.Value),
                ["twelve"] = (12, SearchNumberKind.Value),
                ["thirteen"] = (13, SearchNumberKind.Value),
                ["fourteen"] = (14, SearchNumberKind.Value),
                ["fifteen"] = (15, SearchNumberKind.Value),
                ["sixteen"] = (16, SearchNumberKind.Value),
                ["seventeen"] = (17, SearchNumberKind.Value),
                ["eighteen"] = (18, SearchNumberKind.Value),
                ["nineteen"] = (19, SearchNumberKind.Value),

                ["twenty"] = (20, SearchNumberKind.Value),
                ["thirty"] = (30, SearchNumberKind.Value),
                ["forty"] = (40, SearchNumberKind.Value),
                ["fifty"] = (50, SearchNumberKind.Value),
                ["sixty"] = (60, SearchNumberKind.Value),
                ["seventy"] = (70, SearchNumberKind.Value),
                ["eighty"] = (80, SearchNumberKind.Value),
                ["ninety"] = (90, SearchNumberKind.Value),

                ["hundred"] =
                    (100, SearchNumberKind.Scale),

                ["thousand"] =
                    (1_000, SearchNumberKind.Scale),

                ["million"] =
                    (1_000_000, SearchNumberKind.Scale),

                ["billion"] =
                    (1_000_000_000, SearchNumberKind.Scale)
            };

    public bool TryResolve(
        string normalizedText,
        out decimal value,
        out SearchNumberKind kind)
    {
        if (Numbers.TryGetValue(
                normalizedText,
                out var result))
        {
            value = result.Value;
            kind = result.Kind;
            return true;
        }

        value = 0;
        kind = SearchNumberKind.Value;

        return false;
    }
}