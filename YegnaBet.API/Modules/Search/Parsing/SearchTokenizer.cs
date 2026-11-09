using System.Globalization;
using YegnaBet.API.Modules.Search.Abstractions;
using YegnaBet.API.Modules.Search.Models;

namespace YegnaBet.API.Modules.Search.Parsing;

public sealed class SearchTokenizer : ISearchTokenizer
{
    public IReadOnlyList<SearchToken> Tokenize(string text)
    {
        if (string.IsNullOrWhiteSpace(text))
            return [];

        var tokens = new List<SearchToken>();

        int i = 0;

        while (i < text.Length)
        {
            if (char.IsWhiteSpace(text[i]))
            {
                i++;
                continue;
            }

            int start = i;

            if (IsCurrencySymbol(text[i]) &&
                HasNumericContent(text, i + 1))
            {
                tokens.Add(
                    ReadCurrencyNumber(
                        text,
                        ref i,
                        start));

                continue;
            }

            if (char.IsDigit(text[i]))
            {
                tokens.Add(
                    ReadNumeric(
                        text,
                        ref i,
                        start));

                continue;
            }

            if (char.IsLetter(text[i]))
            {
                tokens.Add(
                    ReadWord(
                        text,
                        ref i,
                        start));

                continue;
            }

            if (text[i] == '-')
            {
                tokens.Add(new SearchToken
                {
                    Text = "-",
                    Start = i,
                    Length = 1,
                    Type = SearchTokenType.Hyphen
                });

                i++;
                continue;
            }

            if (text[i] == '/')
            {
                tokens.Add(new SearchToken
                {
                    Text = "/",
                    Start = i,
                    Length = 1,
                    Type = SearchTokenType.Slash
                });

                i++;
                continue;
            }

            tokens.Add(new SearchToken
            {
                Text = text[i].ToString(),
                Start = i,
                Length = 1,
                Type = SearchTokenType.Punctuation
            });

            i++;
        }

        return tokens;
    }

    private static SearchToken ReadWord(
        string text,
        ref int index,
        int start)
    {
        while (
            index < text.Length &&
            char.IsLetter(text[index]))
        {
            index++;
        }

        return new SearchToken
        {
            Text = text[start..index],
            Start = start,
            Length = index - start,
            Type = SearchTokenType.Word
        };
    }

    private static SearchToken ReadNumeric(
        string text,
        ref int index,
        int start)
    {
        int numberEnd =
            ReadNumberPart(text, index);

        string numericText =
            text[index..numberEnd];

        index = numberEnd;

        decimal value =
            ParseNumericPart(numericText);

        decimal multiplier = 1m;

        if (index < text.Length &&
            IsMagnitudeSuffix(text[index]))
        {
            multiplier =
                MagnitudeMultiplier(text[index]);

            index++;
        }

        return new SearchToken
        {
            Text = text[start..index],
            Start = start,
            Length = index - start,
            Type = SearchTokenType.Number,
            NumericValue = new SearchNumericValue
            {
                Value = value * multiplier,
                Multiplier = multiplier,
                Currency = null,
                IsApproximate = false
            }
        };
    }

    private static SearchToken ReadCurrencyNumber(
        string text,
        ref int index,
        int start)
    {
        char symbol = text[index];

        string? currency =
            CurrencyFromSymbol(symbol);

        index++;

        int numberEnd =
            ReadNumberPart(text, index);

        string numericText =
            text[index..numberEnd];

        index = numberEnd;

        decimal value =
            ParseNumericPart(numericText);

        decimal multiplier = 1m;

        if (index < text.Length &&
            IsMagnitudeSuffix(text[index]))
        {
            multiplier =
                MagnitudeMultiplier(text[index]);

            index++;
        }

        return new SearchToken
        {
            Text = text[start..index],
            Start = start,
            Length = index - start,
            Type = SearchTokenType.Number,
            NumericValue = new SearchNumericValue
            {
                Value = value * multiplier,
                Multiplier = multiplier,
                Currency = currency,
                IsApproximate = false
            }
        };
    }

    private static int ReadNumberPart(
        string text,
        int index)
    {
        int start = index;

        bool hasDecimalPoint = false;
        bool hasDigits = false;

        while (index < text.Length)
        {
            char c = text[index];

            if (char.IsDigit(c))
            {
                hasDigits = true;
                index++;
                continue;
            }

            if (c == ',')
            {
                if (IsValidThousandsSeparator(
                        text,
                        index))
                {
                    index++;
                    continue;
                }

                break;
            }

            if (c == '.' &&
                !hasDecimalPoint)
            {
                if (index + 1 < text.Length &&
                    char.IsDigit(text[index + 1]))
                {
                    hasDecimalPoint = true;
                    index++;
                    continue;
                }

                break;
            }

            break;
        }

        return hasDigits
            ? index
            : start;
    }

    private static bool IsValidThousandsSeparator(
        string text,
        int commaIndex)
    {
        int digitsBefore = 0;

        int i = commaIndex - 1;

        while (
            i >= 0 &&
            char.IsDigit(text[i]))
        {
            digitsBefore++;
            i--;
        }

        if (digitsBefore < 1)
            return false;

        int digitsAfter = 0;

        i = commaIndex + 1;

        while (
            i < text.Length &&
            char.IsDigit(text[i]))
        {
            digitsAfter++;
            i++;
        }

        return digitsAfter == 3;
    }

    private static decimal ParseNumericPart(
        string value)
    {
        string normalized =
            value.Replace(",", "");

        return decimal.Parse(
            normalized,
            NumberStyles.AllowDecimalPoint,
            CultureInfo.InvariantCulture);
    }

    private static bool IsMagnitudeSuffix(char c) =>
        c is 'k' or 'K' or
        'm' or 'M' or
        'b' or 'B';

    private static decimal MagnitudeMultiplier(char c) =>
        char.ToUpperInvariant(c) switch
        {
            'K' => 1_000m,
            'M' => 1_000_000m,
            'B' => 1_000_000_000m,
            _ => 1m
        };

    private static bool IsCurrencySymbol(char c) =>
        c is '$' or '€' or '£' or '¥';

    private static string? CurrencyFromSymbol(char c) =>
        c switch
        {
            '$' => "USD",
            '€' => "EUR",
            '£' => "GBP",
            '¥' => "JPY",
            _ => null
        };

    private static bool HasNumericContent(
        string text,
        int index) =>
        index < text.Length &&
        char.IsDigit(text[index]);
}