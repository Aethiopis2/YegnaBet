using YegnaBet.API.Modules.Search.Abstractions;
using YegnaBet.API.Modules.Search.Models;
using YegnaBet.API.Modules.Search.Vocabulary;

namespace YegnaBet.API.Modules.Search.Numeric;

public sealed class SearchNumericExpressionResolver
    : ISearchNumericExpressionResolver
{
    private readonly ISearchNumberWordResolver _numberWords;

    public SearchNumericExpressionResolver(
        ISearchNumberWordResolver numberWords)
    {
        _numberWords = numberWords;
    }

    public IReadOnlyList<SearchNumericExpression> Resolve(
        IReadOnlyList<SearchToken> tokens)
    {
        var result =
            new List<SearchNumericExpression>();

        int i = 0;

        while (i < tokens.Count)
        {
            var token = tokens[i];

            if (token.NumericValue is not null)
            {
                result.Add(
                    new SearchNumericExpression
                    {
                        Value =
                            token.NumericValue.Value,

                        Currency =
                            token.NumericValue.Currency,

                        Multiplier =
                            token.NumericValue.Multiplier,

                        IsApproximate =
                            token.NumericValue.IsApproximate,

                        StartTokenIndex = i,
                        EndTokenIndex = i,

                        OriginalText = token.Text
                    });

                i++;
                continue;
            }

            if (!HasNumberCandidate(token))
            {
                i++;
                continue;
            }

            int start = i;

            var words = new List<string>();

            while (i < tokens.Count)
            {
                if (!IsNumberWord(tokens[i]))
                    break;

                words.Add(
                    tokens[i].Text.ToLowerInvariant());

                i++;
            }

            if (words.Count == 0)
                continue;

            if (_numberWords.TryResolvePhrase(
                    words,
                    out decimal value))
            {
                result.Add(
                    new SearchNumericExpression
                    {
                        Value = value,

                        StartTokenIndex = start,

                        EndTokenIndex = i - 1,

                        OriginalText =
                            string.Join(
                                " ",
                                words)
                    });

                continue;
            }

            i = start + 1;
        }

        return result;
    }

    private static bool HasNumberCandidate(
        SearchToken token)
    {
        return token.Candidates.Any(x =>
            x.Type ==
            SearchTokenCandidateType.Number);
    }

    private static bool IsNumberWord(
        SearchToken token)
    {
        return token.Candidates.Any(x =>
            x.Type ==
                SearchTokenCandidateType.Number &&
            x.NumberKind is not null);
    }
}