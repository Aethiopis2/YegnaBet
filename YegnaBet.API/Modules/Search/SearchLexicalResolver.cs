namespace YegnaBet.API.Modules.Search;

public sealed class SearchLexicalResolver
    : ISearchLexicalResolver
{
    private readonly ISearchTextNormalizer _normalizer;
    private readonly ISearchVocabulary _vocabulary;
    private readonly ISearchNumberWordResolver _numberWords;

    public SearchLexicalResolver(
        ISearchTextNormalizer normalizer,
        ISearchVocabulary vocabulary,
        ISearchNumberWordResolver numberWords)
    {
        _normalizer = normalizer;
        _vocabulary = vocabulary;
        _numberWords = numberWords;
    }

    public IReadOnlyList<SearchToken> Resolve(
        IReadOnlyList<SearchToken> tokens)
    {
        if (tokens.Count == 0)
            return [];

        foreach (var token in tokens)
        {
            ResolveToken(token);
        }

        return tokens;
    }

    private void ResolveToken(SearchToken token)
    {
        string normalized =
            _normalizer.Normalize(token.Text);

        if (string.IsNullOrEmpty(normalized))
            return;

        // ------------------------------------------------------------
        // 1. Existing numeric token
        //
        // Example:
        // 5
        // 50,000
        // $5K
        // ------------------------------------------------------------

        if (token.Type == SearchTokenType.Number &&
            token.NumericValue is not null)
        {
            token.Candidates.Add(
                new SearchTokenCandidate
                {
                    Type = SearchTokenCandidateType.Number,
                    Value = normalized,
                    NumericValue =
                        token.NumericValue.Value,
                    Confidence = 1.0
                });
        }

        // ------------------------------------------------------------
        // 2. Numeric word
        //
        // Example:
        // five
        // three
        // hundred
        // ------------------------------------------------------------

        if (_numberWords.TryResolve(
            normalized,
            out decimal number,
            out SearchNumberKind kind))
        {
            token.Candidates.Add(
                new SearchTokenCandidate
                {
                    Type = SearchTokenCandidateType.Number,
                    Value = normalized,
                    NumericValue = number,
                    NumberKind = kind,
                    Confidence = 1.0
                });
        }

        // ------------------------------------------------------------
        // 3. Domain vocabulary
        //
        // Example:
        // apartment
        // bedroom
        // CMC
        // rent
        // ------------------------------------------------------------

        var candidates =
            _vocabulary.Lookup(normalized);

        foreach (var candidate in candidates)
        {
            token.Candidates.Add(candidate);
        }
    }
}