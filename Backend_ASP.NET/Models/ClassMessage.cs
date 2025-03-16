namespace OnLineSchoolWebApi.Models
{
    public class ClassMessage
    {
       public int? MessageID { get; set; } 
        public int SenderID { get; set; }
       // public DateTime DateSent { get; set; }
        public string Subject { get; set; }
        public string MessageBody { get; set; }
        public string Recipients { get; set; }
        public string Attachments { get; set; }
        public string UrgencyLevel { get; set; }
        public string StatusMessage { get; set; }
    }
}
