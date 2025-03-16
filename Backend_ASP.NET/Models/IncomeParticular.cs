namespace OnLineSchoolWebApi.Models
{
    public class IncomeParticular
    {
        public int IncomeID { get; set; }               // Primary Key
        public required string IncomeParticularName { get; set; } // Name of the Income Particular
        public int compID { get; set; }                 // Company ID
        public int IsActive { get; set; }               // Active Status (1 for Active, 0 for Inactive)
    }
}
