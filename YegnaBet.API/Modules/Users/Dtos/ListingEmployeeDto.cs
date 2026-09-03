namespace YegnaBet.API.Modules.Users.Dtos
{
    public class ListingEmployeeDto
    {
        public long Id { get; set; }
        public string Name { get; set; } = null!;
        public string? Avatar {  get; set; }
        public string? Phone { get; set; }
        public int ListingCount { get; set; } = 0;
    }
}
