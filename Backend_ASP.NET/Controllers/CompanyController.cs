using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using School.DataAccess;
using System.Data;
using System.Data.SqlClient;
using System.Reflection;
using OnLineSchoolWebApi.Models;



namespace OnLineSchoolWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CompanyController : ControllerBase
    {
        private readonly DBLayer _dbLayer;

        public CompanyController(DBLayer dBLayer) { 
        _dbLayer = dBLayer;
        
        }


        [HttpGet("GetCompany")] 
        public IActionResult Get()
        {

            SqlParameter[] parameters = new SqlParameter[]
           {
                new SqlParameter("@compid", System.Data.SqlDbType.Int) { Value = 1 }
           };

            var data = _dbLayer.GetDataUsingDataTable("Sp_company_detailsBY_comp_id", parameters);


            var dataList = ConvertDataTableToList(data);


            return Ok(dataList);
        }

        [HttpPost("CompanyCreate")]
        public IActionResult CompanyInsert(Company company)
        {

            SqlParameter[] parameters = new SqlParameter[]
           {
             new SqlParameter("@companyname", System.Data.SqlDbType.NVarChar) { Value = company.companyName },
             new SqlParameter("@email", System.Data.SqlDbType.NVarChar) { Value = company.Email },
             new SqlParameter("@mode", System.Data.SqlDbType.NVarChar) { Value = "I" },


               new SqlParameter("@password", System.Data.SqlDbType.NVarChar) { Value = company.Password },
               new SqlParameter("@mobile", System.Data.SqlDbType.NVarChar) { Value =company.MobileNo },
               new SqlParameter("@status", System.Data.SqlDbType.NVarChar) { Value ="Y" }

           };

            var data = _dbLayer.ExecuteNonQuery("Insertupdate_Company", parameters);


            //var dataList = ConvertDataTableToList(data);

             if (data > 0)
            {
                // Return success response as JSON
                return Ok(new { message = "Data saved successfully." });
            }
            else
            {
                // Return failure response as JSON
                return StatusCode(500, new { message = "An error occurred while saving the data." });
            }
        }


        [HttpPost("Validateuser")]
        public IActionResult CompanyValidate(CompanyLogin obj)
        {
            try
            {
                // Define SQL parameters for email and password with unique names
                SqlParameter[] parameters = new SqlParameter[]
                {
            new SqlParameter("@username", System.Data.SqlDbType.NVarChar,200) { Value = obj.Email },
            new SqlParameter("@password", System.Data.SqlDbType.NVarChar,200) { Value = obj.Password }
                };

                // Get data from the database by executing the stored procedure
                var data = _dbLayer.GetDataUsingDataTable("company_validateuser", parameters);

                // Check if data is null or empty and return a meaningful message
                if (data == null || data.Rows.Count == 0)
                {
                    return NotFound(new { message = "No data found or invalid credentials" });
                }

                // Convert the data from DataTable to a list
                var dataList = ConvertDataTableToList(data);

                // Return the data as a response with HTTP status code 200 (OK)
                return Ok(dataList);
            }
            catch (SqlException sqlEx)
            {
                // Log the SQL exception or handle it as needed
                // Return a 500 status code (Internal Server Error) with the error message
                return StatusCode(500, new { message = "An error occurred while accessing the database.", details = sqlEx.Message });
            }
            catch (Exception ex)
            {
                // Log the general exception or handle it as needed
                // Return a 500 status code (Internal Server Error) with the error message
                return StatusCode(500, new { message = "An unexpected error occurred.", details = ex.Message });
            }
        }



        [HttpPost("Editcompany")]
        public IActionResult CompanyEdit(Company company)
        {

            SqlParameter[] parameters = new SqlParameter[]
           {
             new SqlParameter("@companyname", System.Data.SqlDbType.NVarChar) { Value = company.companyName },
             new SqlParameter("@email", System.Data.SqlDbType.NVarChar) { Value = company.Email },
             new SqlParameter("@mode", System.Data.SqlDbType.NVarChar) { Value = "U" },


               new SqlParameter("@password", System.Data.SqlDbType.NVarChar) { Value = company.Password },
               new SqlParameter("@mobile", System.Data.SqlDbType.NVarChar) { Value =company.MobileNo },
               new SqlParameter("@status", System.Data.SqlDbType.NVarChar) { Value ="Y" },
               new SqlParameter("@compid", System.Data.SqlDbType.Int) { Value =company.companyID }

           };

            var data = _dbLayer.ExecuteNonQuery("Insertupdate_Company", parameters);


            //var dataList = ConvertDataTableToList(data);

            if (data > 0)
            {
                // Return success response as JSON
                return Ok(new { message = "Data saved successfully." });
            }
            else
            {
                // Return failure response as JSON
                return StatusCode(500, new { message = "An error occurred while saving the data." });
            }
        }


















        // Helper method to convert DataTable to a List of Dictionaries
        private List<Dictionary<string, object>> ConvertDataTableToList(DataTable dataTable)
        {
            var list = new List<Dictionary<string, object>>();

            foreach (DataRow row in dataTable.Rows)
            {
                var dict = new Dictionary<string, object>();
                foreach (DataColumn column in dataTable.Columns)
                {
                    dict[column.ColumnName] = row[column];
                }
                list.Add(dict);
            }

            return list;
        }










    }
}
