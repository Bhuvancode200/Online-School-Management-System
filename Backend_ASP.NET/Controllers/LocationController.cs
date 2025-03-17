using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OnLineSchoolWebApi.Models;
using School.DataAccess;
using System.Data.SqlClient;
using System.Data;

namespace OnLineSchoolWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LocationController : ControllerBase
    {
        private readonly DBLayer _dbLayer;

        public LocationController(DBLayer dBLayer)
        {
            _dbLayer = dBLayer;

        }


        [HttpPost("GetLocations")]
        public IActionResult Get(Location obj)
        {

            SqlParameter[] parameters = new SqlParameter[]
           {
                new("@compid", System.Data.SqlDbType.Int) { Value = obj.Company_ID }//         new SqlParameter("@compid", SqlDbType.Int) { Value = obj.Comp_ID }
           };

            var data = _dbLayer.GetDataUsingDataTable("Sp_Location_details_by_compid", parameters);


            var dataList = ConvertDataTableToList(data);


            return Ok(dataList);
        }

        [HttpPost("LocationCreate")]
        public IActionResult LocationInsert(Location subj)
        {

            SqlParameter[] parameters = new SqlParameter[]
           {
            new SqlParameter("@location_name", SqlDbType.NVarChar) { Value = subj.Location_Name },
            new SqlParameter("@company_id", SqlDbType.Int) { Value = subj.Company_ID },
            new SqlParameter("@is_active",  SqlDbType.Bit) { Value = subj.IsActive },
            new SqlParameter("@mode", System.Data.SqlDbType.NVarChar) { Value = "I" }

           };

            var data = _dbLayer.ExecuteNonQuery("InsertupdateLocation", parameters);


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


        [HttpPost("UpdateLocation")]
        public IActionResult UpdateLocationEdit(Location obj)
        {
            if (obj.Location_ID == null || obj.Location_ID <= 0)
            {
                return BadRequest(new { message = "Invalid Location ID." });
            }

            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@location_id", SqlDbType.Int) { Value = obj.Location_ID },
                new SqlParameter("@location_name", SqlDbType.NVarChar) { Value = obj.Location_Name },
                new SqlParameter("@company_id", SqlDbType.Int) { Value = obj.Company_ID },
                new SqlParameter("@is_active",  SqlDbType.Bit) { Value = obj.IsActive },
                new SqlParameter("@mode", SqlDbType.NChar) { Value = "U" } // 'U' for Update
            };

            var result = _dbLayer.ExecuteNonQuery("InsertupdateLocation", parameters);

            if (result > 0)
            {
                return Ok(new { message = "Location updated successfully." });
            }
            else
            {
                return StatusCode(500, new { message = "An error occurred while updating the class." });
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
