namespace YegnaBet.API.Modules.Finance.Dtos
{
    public class CreateExpenseDto
    {
        public string Category { get; set; } = null!;
        public decimal Amount { get; set; }
        public string? Description { get; set; }
    }
}