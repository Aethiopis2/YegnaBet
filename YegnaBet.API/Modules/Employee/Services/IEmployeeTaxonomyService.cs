using YegnaBet.API.Modules.Employee.Dtos;

namespace YegnaBet.API.Modules.Employee.Services
{
    public interface IEmployeeTaxonomyService
    {
        Task<List<EmployeeTaxonomyNodeDto>> GetTree(long taxonomyId, 
            CancellationToken cancellation = default);
        Task UpdateNode(long nodeId, UpdateTaxonomyNodeRequest request,
            CancellationToken cancellationToken = default);
        Task<EmployeeTaxonomyNodeDto> CreateNode(long taxonomyId, CreateTaxonomyNodeRequest request,
            CancellationToken cancellationToken = default);
        Task MoveNode(long nodeId, MoveTaxonomyNodeRequest request,
            CancellationToken cancellationToken = default);


        // attributes
        Task<List<EmployeeTaxonomyAttributeDto>> GetAttributes(long nodeId,
            CancellationToken cancellationToken = default);
        Task<EmployeeTaxonomyAttributeDto> CreateAttribute(long nodeId,
            CreateTaxonomyAttributeRequest request,
            CancellationToken cancellationToken = default);
        Task UpdateAttribute(long nodeId, long attributeId,
            UpdateTaxonomyAttributeRequest request,
            CancellationToken cancellationToken = default);
        Task DeleteAttribute(long nodeId, long attributeId,
            CancellationToken cancellationToken = default);
    }
}