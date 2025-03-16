namespace OnLineSchoolWebApi.Models
{
    public class Course
       { // Model for Course
       
        
            public int COMP_ID { get; set; }
            public int CLASS_ID { get; set; }
            public string CLASS_NAME { get; set; }
            public bool IS_ACTIVE { get; set; }
        }

        // Model for CourseRequest (used for filtering)
        public class CourseRequest
        {
            public int COMP_ID { get; set; }
            public int CLASS_ID { get; set; }
            public bool IS_ACTIVE { get; set; }
            public string CLASS_NAME { get; set; }
        }
}


