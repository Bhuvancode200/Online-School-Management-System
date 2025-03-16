namespace OnLineSchoolWebApi.Models
{
    public class Fees
    {
        public int? FeesParticularID { get; set; } // Nullable for insertion
        public string FeesParticularName { get; set; }
        public int Company_ID { get; set; }
        public int IsActive { get; set; } 


    }
}
                         
