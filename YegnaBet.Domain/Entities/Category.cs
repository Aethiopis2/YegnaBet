namespace YegnaBet.Domain.Entities
{
    /// <summary>
    /// A representation of what kind of thing/listing is offered
    /// </summary>
    public  class Category
    {
        public int Id { get; set; }

        public string Name { get; set; } = null!;
        public string? Icon {  get; set; }

        public int SortOrder { get; set; }
    }
}