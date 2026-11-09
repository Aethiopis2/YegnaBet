using YegnaBet.API.Modules.Search.Abstractions;
using YegnaBet.API.Modules.Search.Models;

namespace YegnaBet.API.Modules.Search;

public sealed class SearchEngine : ISearchEngine
{
    private readonly ISearchTokenizer _tokenizer;
    private readonly ISearchLexicalResolver _lexicalResolver;
    private readonly ISearchNumericExpressionResolver
        _numericResolver;
    private readonly ISearchExpressionParser
        _expressionParser;
    private readonly ISearchContextInterpreter
        _contextInterpreter;
    private readonly ISearchConstraintGrouper
        _grouper;
    private readonly ISearchQueryValidator
        _validator;

    public SearchEngine(
        ISearchTokenizer tokenizer,
        ISearchLexicalResolver lexicalResolver,
        ISearchNumericExpressionResolver numericResolver,
        ISearchExpressionParser expressionParser,
        ISearchContextInterpreter contextInterpreter,
        ISearchConstraintGrouper grouper,
        ISearchQueryValidator validator)
    {
        _tokenizer = tokenizer;
        _lexicalResolver = lexicalResolver;
        _numericResolver = numericResolver;
        _expressionParser = expressionParser;
        _contextInterpreter = contextInterpreter;
        _grouper = grouper;
        _validator = validator;
    }

    public SearchQuery Parse(string text)
    {
        if (string.IsNullOrWhiteSpace(text))
        {
            return new SearchQuery
            {
                OriginalText = text ?? "",
                Status =
                    SearchInterpretationStatus.Unknown,

                FailureReason =
                    "Search text is empty."
            };
        }

        // 1. TOKENIZATION
        var tokens =
            _tokenizer.Tokenize(text);

        if (tokens.Count == 0)
        {
            return new SearchQuery
            {
                OriginalText = text,
                Status =
                    SearchInterpretationStatus.Unknown,

                FailureReason =
                    "No searchable tokens were found."
            };
        }

        // 2. LEXICAL RESOLUTION
        _lexicalResolver.Resolve(tokens);

        // 3. NUMERIC EXPRESSIONS
        var numbers =
            _numericResolver.Resolve(tokens);

        // 4. EXPRESSIONS
        var expressions =
            _expressionParser.Parse(
                tokens,
                numbers);

        // 5. SEMANTIC CONTEXT
        var constraints =
            _contextInterpreter.Interpret(
                tokens,
                expressions);

        // 6. BOOLEAN GROUPING
        var root =
            _grouper.Group(
                tokens,
                constraints);

        // 7. VALIDATION
        var status =
            _validator.Validate(root);

        if (status ==
            SearchInterpretationStatus.Unknown)
        {
            return new SearchQuery
            {
                OriginalText = text,

                Root = root,

                Status = status,

                FailureReason =
                    "I couldn't determine what you are looking for."
            };
        }

        return new SearchQuery
        {
            OriginalText = text,

            Root = root,

            Status = status
        };
    }
}