namespace OnLineSchoolWebApi.Models
{
    public class Assessment
    {
        public int? AssessmentID { get; set; } // Nullable for insertion
        public string? AssessmentName { get; set; }
        public int CompID { get; set; }
        public bool IsActive { get; set; }
    }
}
