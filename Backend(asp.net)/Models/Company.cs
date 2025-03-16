using System.Data;

namespace OnLineSchoolWebApi.Models
{
    public class Company
    {
        public int    companyID { get; set; }
        public string companyName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
       public string MobileNo { get; set; }
        public string Status { get; set; }
        //public string CompanyImage { get; set; }
        public string Address { get; set; }

    }


    public class CompanyLogin
    {
        public int   companyID { get; set; }
        public string companyName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string MobileNo { get; set; }
        public string Status { get; set; }

    }
}
