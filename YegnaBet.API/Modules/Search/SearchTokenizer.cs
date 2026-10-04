using System.Globalization;

namespace YegnaBet.API.Modules.Search;

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
            // ---------------------------------------------------------
            // Whitespace
            // ---------------------------------------------------------
            if (char.IsWhiteSpace(text[i]))
            {
                i++;
                continue;
            }

            int start = i;

            // ---------------------------------------------------------
            // Currency-prefixed number
            //
            // Examples:
            // $5K
            // €50,000
            // £5.5M
            // ---------------------------------------------------------
            if (IsCurrencySymbol(text[i]) &&
                HasNumericContent(text, i + 1))
            {
                tokens.Add(ReadCurrencyNumber(text, ref i, start));
                continue;
            }

            // ---------------------------------------------------------
            // Numeric expression
            //
            // Examples:
            // 5
            // 5.5
            // 50,000
            // 5K
            // 5.5M
            // ---------------------------------------------------------
            if (char.IsDigit(text[i]))
            {
                tokens.Add(ReadNumeric(text, ref i, start));
                continue;
            }

            // ---------------------------------------------------------
            // Word
            //
            // Examples:
            // apartment
            // bedroom
            // CMC
            // rent
            // five
            // ---------------------------------------------------------
            if (char.IsLetter(text[i]))
            {
                tokens.Add(ReadWord(text, ref i, start));
                continue;
            }

            // ---------------------------------------------------------
            // Structural punctuation
            // ---------------------------------------------------------
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

            // ---------------------------------------------------------
            // Everything else is preserved as punctuation.
            // ---------------------------------------------------------
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

    // ================================================================
    // WORD
    // ================================================================

    private static SearchToken ReadWord(
        string text,
        ref int index,
        int start)
    {
        while (index < text.Length &&
               char.IsLetter(text[index]))
        {
            index++;
        }

        string value = text[start..index];

        return new SearchToken
        {
            Text = value,
            Start = start,
            Length = index - start,
            Type = SearchTokenType.Word
        };
    }

    // ================================================================
    // NUMBER
    // ================================================================

    private static SearchToken ReadNumeric(
        string text,
        ref int index,
        int start)
    {
        int numberEnd = ReadNumberPart(text, index);

        string numericText = text[index..numberEnd];

        index = numberEnd;

        decimal value = ParseNumericPart(numericText);

        decimal multiplier = 1m;

        // ------------------------------------------------------------
        // Magnitude suffix
        //
        // 5K
        // 5M
        // 5B
        // ------------------------------------------------------------
        if (index < text.Length &&
            IsMagnitudeSuffix(text[index]))
        {
            multiplier = MagnitudeMultiplier(text[index]);
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

    // ================================================================
    // CURRENCY + NUMBER
    // ================================================================

    private static SearchToken ReadCurrencyNumber(
        string text,
        ref int index,
        int start)
    {
        char currencySymbol = text[index];

        string? currency = CurrencyFromSymbol(currencySymbol);

        index++;

        int numberEnd = ReadNumberPart(text, index);

        string numericText = text[index..numberEnd];

        index = numberEnd;

        decimal value = ParseNumericPart(numericText);

        decimal multiplier = 1m;

        if (index < text.Length &&
            IsMagnitudeSuffix(text[index]))
        {
            multiplier = MagnitudeMultiplier(text[index]);
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

    // ================================================================
    // NUMBER PART
    // ================================================================

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

            // --------------------------------------------------------
            // Thousands separator.
            //
            // We only consume commas when they form valid
            // thousands groups.
            // --------------------------------------------------------
            if (c == ',')
            {
                if (IsValidThousandsSeparator(text, index))
                {
                    index++;
                    continue;
                }

                break;
            }

            // --------------------------------------------------------
            // Decimal point.
            // --------------------------------------------------------
            if (c == '.' && !hasDecimalPoint)
            {
                // Must have digits after the decimal point.
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

        // Defensive fallback.
        if (!hasDigits)
            return start;

        return index;
    }

    // ================================================================
    // VALID THOUSANDS SEPARATOR
    // ================================================================

    private static bool IsValidThousandsSeparator(
        string text,
        int commaIndex)
    {
        // We require:
        //
        // 1,000
        // 10,000
        // 100,000
        // 1,000,000
        //
        // but NOT:
        //
        // 1,00
        // 1,0000
        // 1,2,3

        int digitsBefore = 0;
        int i = commaIndex - 1;

        while (i >= 0 && char.IsDigit(text[i]))
        {
            digitsBefore++;
            i--;
        }

        if (digitsBefore < 1)
            return false;

        int digitsAfter = 0;
        i = commaIndex + 1;

        while (i < text.Length && char.IsDigit(text[i]))
        {
            digitsAfter++;
            i++;
        }

        return digitsAfter == 3;
    }

    // ================================================================
    // NUMERIC PARSING
    // ================================================================

    private static decimal ParseNumericPart(string value)
    {
        string normalized = value.Replace(",", "");

        return decimal.Parse(
            normalized,
            NumberStyles.AllowDecimalPoint,
            CultureInfo.InvariantCulture);
    }

    // ================================================================
    // MAGNITUDES
    // ================================================================

    private static bool IsMagnitudeSuffix(char c)
    {
        return c is 'k' or 'K'
                  or 'm' or 'M'
                  or 'b' or 'B';
    }

    private static decimal MagnitudeMultiplier(char c)
    {
        return char.ToUpperInvariant(c) switch
        {
            'K' => 1_000m,
            'M' => 1_000_000m,
            'B' => 1_000_000_000m,
            _ => 1m
        };
    }

    // ================================================================
    // CURRENCY
    // ================================================================

    private static bool IsCurrencySymbol(char c)
    {
        return c is '$' or '€' or '£' or '¥';
    }

    private static string? CurrencyFromSymbol(char c)
    {
        return c switch
        {
            '$' => "USD",
            '€' => "EUR",
            '£' => "GBP",
            '¥' => "JPY",
            _ => null
        };
    }

    // ================================================================
    // DETECT NUMBER AFTER CURRENCY
    // ================================================================

    private static bool HasNumericContent(
        string text,
        int index)
    {
        if (index >= text.Length)
            return false;

        return char.IsDigit(text[index]);
    }
}