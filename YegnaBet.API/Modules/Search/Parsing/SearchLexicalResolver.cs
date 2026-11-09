using YegnaBet.API.Modules.Search.Abstractions;
using YegnaBet.API.Modules.Search.Models;
using YegnaBet.API.Modules.Search.Vocabulary;

namespace YegnaBet.API.Modules.Search.Parsing;

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

        if (token.Type == SearchTokenType.Number &&
            token.NumericValue is not null)
        {
            token.Candidates.Add(
                new SearchTokenCandidate
                {
                    Type =
                        SearchTokenCandidateType.Number,

                    Value = normalized,

                    NumericValue =
                        token.NumericValue.Value,

                    NumberKind =
                        SearchNumberKind.Value,

                    Confidence = 1.0
                });
        }

        if (_numberWords.TryResolve(
                normalized,
                out decimal number,
                out SearchNumberKind kind))
        {
            token.Candidates.Add(
                new SearchTokenCandidate
                {
                    Type =
                        SearchTokenCandidateType.Number,

                    Value = normalized,

                    NumericValue = number,

                    NumberKind = kind,

                    Confidence = 1.0
                });
        }

        foreach (var candidate
                 in _vocabulary.Lookup(normalized))
        {
            token.Candidates.Add(candidate);
        }
    }
}