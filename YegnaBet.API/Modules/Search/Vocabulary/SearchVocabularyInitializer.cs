using YegnaBet.API.Modules.Search.Models;

namespace YegnaBet.API.Modules.Search.Vocabulary;

public static class SearchVocabularyInitializer
{
    public static void Initialize(
        SearchVocabulary vocabulary)
    {
        AddTaxonomy(
            vocabulary,
            "apartment",
            SearchVocabularyIds.Apartment);

        AddTaxonomy(
            vocabulary,
            "apartments",
            SearchVocabularyIds.Apartment);

        AddTaxonomy(
            vocabulary,
            "flat",
            SearchVocabularyIds.Apartment);

        AddTaxonomy(
            vocabulary,
            "house",
            SearchVocabularyIds.House);

        AddTaxonomy(
            vocabulary,
            "houses",
            SearchVocabularyIds.House);

        AddTaxonomy(
            vocabulary,
            "home",
            SearchVocabularyIds.House);

        AddTaxonomy(
            vocabulary,
            "land",
            SearchVocabularyIds.Land);


        AddAttribute(
            vocabulary,
            "bedroom",
            SearchVocabularyIds.Bedrooms,
            "bedrooms");

        AddAttribute(
            vocabulary,
            "bedrooms",
            SearchVocabularyIds.Bedrooms,
            "bedrooms");

        AddAttribute(
            vocabulary,
            "bathroom",
            SearchVocabularyIds.Bathrooms,
            "bathrooms");

        AddAttribute(
            vocabulary,
            "bathrooms",
            SearchVocabularyIds.Bathrooms,
            "bathrooms");

        AddAttribute(
            vocabulary,
            "area",
            SearchVocabularyIds.Area,
            "area");


        AddLocation(
            vocabulary,
            "cmc",
            SearchVocabularyIds.Cmc);

        AddLocation(
            vocabulary,
            "bole",
            SearchVocabularyIds.Bole);


        AddTransaction(
            vocabulary,
            "rent",
            SearchVocabularyIds.Rent,
            "rent");

        AddTransaction(
            vocabulary,
            "rental",
            SearchVocabularyIds.Rent,
            "rent");

        AddTransaction(
            vocabulary,
            "for rent",
            SearchVocabularyIds.Rent,
            "rent");

        AddTransaction(
            vocabulary,
            "sale",
            SearchVocabularyIds.Sale,
            "sale");

        AddTransaction(
            vocabulary,
            "sell",
            SearchVocabularyIds.Sale,
            "sale");


        AddCurrency(vocabulary, "birr", "ETB");
        AddCurrency(vocabulary, "etb", "ETB");
        AddCurrency(vocabulary, "ብር", "ETB");


        AddOperator(vocabulary, "and", "and");
        AddOperator(vocabulary, "or", "or");
        AddOperator(vocabulary, "in", "in");
        AddOperator(vocabulary, "with", "with");
        AddOperator(vocabulary, "near", "near");
        AddOperator(vocabulary, "around", "around");
        AddOperator(vocabulary, "close", "close");
        AddOperator(vocabulary, "under", "under");
        AddOperator(vocabulary, "below", "below");
        AddOperator(vocabulary, "less", "less");
        AddOperator(vocabulary, "over", "over");
        AddOperator(vocabulary, "above", "above");
        AddOperator(vocabulary, "more", "more");
        AddOperator(vocabulary, "between", "between");
    }

    private static void AddTaxonomy(
        SearchVocabulary vocabulary,
        string word,
        long id)
    {
        vocabulary.Add(
            word,
            new SearchTokenCandidate
            {
                Type = SearchTokenCandidateType.Taxonomy,
                ReferenceId = id,
                Value = word,
                Confidence = 1.0
            });
    }

    private static void AddAttribute(
        SearchVocabulary vocabulary,
        string word,
        long id,
        string value)
    {
        vocabulary.Add(
            word,
            new SearchTokenCandidate
            {
                Type = SearchTokenCandidateType.Attribute,
                ReferenceId = id,
                Value = value,
                Confidence = 1.0
            });
    }

    private static void AddLocation(
        SearchVocabulary vocabulary,
        string word,
        long id)
    {
        vocabulary.Add(
            word,
            new SearchTokenCandidate
            {
                Type = SearchTokenCandidateType.Location,
                ReferenceId = id,
                Value = word,
                Confidence = 1.0
            });
    }

    private static void AddTransaction(
        SearchVocabulary vocabulary,
        string word,
        long id,
        string value)
    {
        vocabulary.Add(
            word,
            new SearchTokenCandidate
            {
                Type = SearchTokenCandidateType.TransactionType,
                ReferenceId = id,
                Value = value,
                Confidence = 1.0
            });
    }

    private static void AddCurrency(
        SearchVocabulary vocabulary,
        string word,
        string currency)
    {
        vocabulary.Add(
            word,
            new SearchTokenCandidate
            {
                Type = SearchTokenCandidateType.Currency,
                Value = currency,
                Confidence = 1.0
            });
    }

    private static void AddOperator(
        SearchVocabulary vocabulary,
        string word,
        string value)
    {
        vocabulary.Add(
            word,
            new SearchTokenCandidate
            {
                Type = SearchTokenCandidateType.Operator,
                Value = value,
                Confidence = 1.0
            });
    }
}