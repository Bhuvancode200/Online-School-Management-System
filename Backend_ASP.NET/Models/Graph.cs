using System.ComponentModel.DataAnnotations;

namespace OnLineSchoolWebApi.Models
{
    public class ClasswiseGenderCount
    {
        [Required]
        public string ClassName { get; set; }

        [Required]
        public int BoysCount { get; set; }

        [Required]
        public int GirlsCount { get; set; }
    }

    public class ClasswiseStudentCount
    {
        [Required]
        public string ClassNameWiseCount { get; set; }

        [Required]
        public string StudentNames { get; set; }
    }

    public class LocationWiseStudentList
    {
        [Required]
        public string LocationName { get; set; }

        [Required]
        public int StudentCount { get; set; }

        [Required]
        public string LocationWithCount { get; set; }
    }

    public class ProfileUserData
    {
        [Required]
        public int CompID { get; set; }
    }
}