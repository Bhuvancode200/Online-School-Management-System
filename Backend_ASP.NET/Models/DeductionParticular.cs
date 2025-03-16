namespace OnLineSchoolWebApi.Models
{
    public class DeductionParticular
    {
        public int DeductionID { get; set; }            // Primary Key
        public required string DeductionParticularName { get; set; } // Name of the Deduction Particular
        public int compID { get; set; }                    // Company ID
        public int IsActive { get; set; }                  // Active Status (1 for Active, 0 for Inactive)
    }
}
