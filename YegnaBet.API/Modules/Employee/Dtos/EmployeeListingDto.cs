namespace YegnaBet.API.Modules.Employee.Dtos;


public class EmployeeListingDto
{
    public long Id { get; set; }
    public string Title { get; set; } = null!;
    public string Category { get; set; } = null!;
    public string Location { get; set; } = null!;
    public decimal Price { get; set; }
    public string Image { get; set; } = null!;
    public string Status { get; set; } = null!;
    public int Views { get; set; }
    public int Enquiries { get; set; }
    public string Update { get; set; } = null!;
}