namespace YegnaBet.API.Modules.Brokers.Dtos
{
    public class PipelineCountsDto
    {
        public int New { get; set; }
        public int Called { get; set; }
        public int Visited { get; set; }
        public int Negotiating { get; set; }
        public int Completed { get; set; }
    }
}