namespace YegnaBet.API.Modules.Search;

public interface ISearchNumberWordResolver
{
    bool TryResolve(
        string normalizedText,
        out decimal value,
        out SearchNumberKind kind);
}