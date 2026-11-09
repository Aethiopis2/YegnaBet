using Microsoft.AspNetCore.Mvc;
using YegnaBet.API.Modules.Search.Abstractions;
using YegnaBet.API.Modules.Search.Models;

namespace YegnaBet.API.Modules.Search;

[ApiController]
[Route("api/search")]
public sealed class SearchController : ControllerBase
{
    private readonly ISearchEngine _searchEngine;

    public SearchController(
        ISearchEngine searchEngine)
    {
        _searchEngine = searchEngine;
    }

    [HttpGet]
    public ActionResult<SearchQuery> Search(
        [FromQuery] string q)
    {
        var result =
            _searchEngine.Parse(q);

        return Ok(result);
    }
}