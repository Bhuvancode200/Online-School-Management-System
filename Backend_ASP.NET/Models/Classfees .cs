namespace OnLineSchoolWebApi.Models
{
    public class Classfees
    {
        public int ClassFeesId { get; set; }
        public int ClassId { get; set; }
        public int FeesParticularId { get; set; }
        public decimal FeesAmount { get; set; }
        public int CompId { get; set; }
        public int IsActive { get; set; }
    }
}
