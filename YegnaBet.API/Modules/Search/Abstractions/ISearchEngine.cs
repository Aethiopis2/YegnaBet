using YegnaBet.API.Modules.Search.Models;

namespace YegnaBet.API.Modules.Search.Abstractions;

public interface ISearchEngine
{
    SearchQuery Parse(string text);
}