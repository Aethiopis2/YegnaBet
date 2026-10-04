namespace YegnaBet.API.Modules.Search;

public sealed class SearchNumericExpressionResolver
    : ISearchNumericExpressionResolver
{
    public IReadOnlyList<SearchNumericExpression> Resolve(
        IReadOnlyList<SearchToken> tokens)
    {
        if (tokens.Count == 0)
            return [];

        var result = new List<SearchNumericExpression>();

        int i = 0;

        while (i < tokens.Count)
        {
            if (!IsNumberWordToken(tokens[i]))
            {
                if (TryGetLiteralNumber(
                        tokens[i],
                        out var literal))
                {
                    result.Add(
                        new SearchNumericExpression
                        {
                            Value = literal,
                            StartTokenIndex = i,
                            EndTokenIndex = i,
                            OriginalText = tokens[i].Text
                        });
                }

                i++;
                continue;
            }

            int start = i;

            if (!TryParseNumberWords(
                    tokens,
                    ref i,
                    out decimal value))
            {
                i = start + 1;
                continue;
            }

            result.Add(
                new SearchNumericExpression
                {
                    Value = value,
                    StartTokenIndex = start,
                    EndTokenIndex = i,
                    OriginalText = BuildOriginalText(
                        tokens,
                        start,
                        i)
                });

            i++;
        }

        return result;
    }

    private static bool TryParseNumberWords(
        IReadOnlyList<SearchToken> tokens,
        ref int index,
        out decimal result)
    {
        decimal total = 0;
        decimal current = 0;

        int start = index;

        while (index < tokens.Count)
        {
            if (!TryGetNumberCandidate(
                    tokens[index],
                    out var candidate))
            {
                break;
            }

            if (candidate.NumberKind ==
                SearchNumberKind.Value)
            {
                current += candidate.NumericValue!.Value;
            }
            else
            {
                decimal scale = candidate.NumericValue!.Value;

                if (scale == 100)
                {
                    if (current == 0)
                        current = 1;

                    current *= 100;
                }
                else
                {
                    if (current == 0)
                        current = 1;

                    total += current * scale;
                    current = 0;
                }
            }

            index++;

            // A numeric word expression only continues while the
            // following token is also numeric.
            if (index >= tokens.Count ||
                !IsNumberWordToken(tokens[index]))
            {
                break;
            }
        }

        result = total + current;

        return index > start;
    }

    private static bool IsNumberWordToken(
        SearchToken token)
    {
        return token.Candidates.Any(
            x =>
                x.Type == SearchTokenCandidateType.Number &&
                x.NumberKind.HasValue);
    }

    private static bool TryGetNumberCandidate(
        SearchToken token,
        out SearchTokenCandidate candidate)
    {
        candidate = null!;

        foreach (var item in token.Candidates)
        {
            if (item.Type ==
                    SearchTokenCandidateType.Number &&
                item.NumberKind.HasValue &&
                item.NumericValue.HasValue)
            {
                candidate = item;
                return true;
            }
        }

        return false;
    }

    private static bool TryGetLiteralNumber(
        SearchToken token,
        out decimal value)
    {
        value = 0;

        if (token.Type != SearchTokenType.Number ||
            token.NumericValue is null)
        {
            return false;
        }

        value = token.NumericValue.Value;
        return true;
    }

    private static string BuildOriginalText(
        IReadOnlyList<SearchToken> tokens,
        int start,
        int end)
    {
        return string.Join(
            " ",
            tokens
                .Skip(start)
                .Take(end - start + 1)
                .Select(x => x.Text));
    }
}