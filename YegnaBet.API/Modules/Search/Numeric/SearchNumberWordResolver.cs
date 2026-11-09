using YegnaBet.API.Modules.Search.Abstractions;
using YegnaBet.API.Modules.Search.Models;

namespace YegnaBet.API.Modules.Search.Numeric;

public sealed class SearchNumberWordResolver
    : ISearchNumberWordResolver
{
    private static readonly Dictionary<string, decimal>
        Units = new(StringComparer.OrdinalIgnoreCase)
        {
            ["zero"] = 0,
            ["one"] = 1,
            ["two"] = 2,
            ["three"] = 3,
            ["four"] = 4,
            ["five"] = 5,
            ["six"] = 6,
            ["seven"] = 7,
            ["eight"] = 8,
            ["nine"] = 9,
            ["ten"] = 10,
            ["eleven"] = 11,
            ["twelve"] = 12,
            ["thirteen"] = 13,
            ["fourteen"] = 14,
            ["fifteen"] = 15,
            ["sixteen"] = 16,
            ["seventeen"] = 17,
            ["eighteen"] = 18,
            ["nineteen"] = 19
        };

    private static readonly Dictionary<string, decimal>
        Tens = new(StringComparer.OrdinalIgnoreCase)
        {
            ["twenty"] = 20,
            ["thirty"] = 30,
            ["forty"] = 40,
            ["fifty"] = 50,
            ["sixty"] = 60,
            ["seventy"] = 70,
            ["eighty"] = 80,
            ["ninety"] = 90
        };

    private static readonly Dictionary<string, decimal>
        Scales = new(StringComparer.OrdinalIgnoreCase)
        {
            ["hundred"] = 100,
            ["thousand"] = 1_000,
            ["million"] = 1_000_000,
            ["billion"] = 1_000_000_000
        };

    public bool TryResolve(
        string normalizedText,
        out decimal value,
        out SearchNumberKind kind)
    {
        if (Units.TryGetValue(
                normalizedText,
                out value))
        {
            kind = SearchNumberKind.Value;
            return true;
        }

        if (Tens.TryGetValue(
                normalizedText,
                out value))
        {
            kind = SearchNumberKind.Value;
            return true;
        }

        if (Scales.TryGetValue(
                normalizedText,
                out value))
        {
            kind = SearchNumberKind.Scale;
            return true;
        }

        value = 0;
        kind = SearchNumberKind.Value;

        return false;
    }

    public bool TryResolvePhrase(
        IReadOnlyList<string> words,
        out decimal value)
    {
        value = 0;

        if (words.Count == 0)
            return false;

        decimal total = 0;
        decimal current = 0;
        bool foundNumber = false;

        foreach (var word in words)
        {
            if (Units.TryGetValue(word, out var unit))
            {
                current += unit;
                foundNumber = true;
                continue;
            }

            if (Tens.TryGetValue(word, out var ten))
            {
                current += ten;
                foundNumber = true;
                continue;
            }

            if (word.Equals(
                    "hundred",
                    StringComparison.OrdinalIgnoreCase))
            {
                if (current == 0)
                    current = 1;

                current *= 100;
                foundNumber = true;
                continue;
            }

            if (Scales.TryGetValue(
                    word,
                    out var scale) &&
                scale >= 1000)
            {
                if (current == 0)
                    current = 1;

                total += current * scale;
                current = 0;

                foundNumber = true;
                continue;
            }

            return false;
        }

        if (!foundNumber)
            return false;

        value = total + current;
        return true;
    }
}