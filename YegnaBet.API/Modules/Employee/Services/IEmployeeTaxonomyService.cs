using YegnaBet.API.Modules.Employee.Dtos;

namespace YegnaBet.API.Modules.Employee.Services
{
    public interface IEmployeeTaxonomyService
    {
        Task<List<EmployeeTaxonomyNodeDto>> getTree(long taxonomyId, 
            CancellationToken cancellation = default);
        Task updateNode(long nodeId, UpdateTaxonomyNodeRequest request,
            CancellationToken cancellationToken = default);
        Task<EmployeeTaxonomyNodeDto> createNode(long taxonomyId, CreateTaxonomyNodeRequest request,
            CancellationToken cancellationToken = default);
    }
}