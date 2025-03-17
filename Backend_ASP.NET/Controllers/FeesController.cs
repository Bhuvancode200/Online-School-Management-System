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
    public class FeesController : ControllerBase
    {        private readonly DBLayer _dbLayer;

        public FeesController(DBLayer dbLayer)
        {
            _dbLayer = dbLayer;
        }

        [HttpPost("GetFeesParticulars")]
        public IActionResult GetFeesParticulars(Fees obj)
        {
            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@Company_ID", SqlDbType.Int) { Value = obj.Company_ID }
            };

            var data = _dbLayer.GetDataUsingDataTable("Sp_FeesParticularsByCompID", parameters);
            var dataList = ConvertDataTableToList(data);
            return Ok(dataList);
        }

        [HttpPost("InsertFeesParticular")]
        public IActionResult InsertFeesParticular(Fees feesParticular)
        {
            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@FeesParticularName", SqlDbType.NVarChar) { Value = feesParticular.FeesParticularName },
                new SqlParameter("@Company_ID", SqlDbType.Int) { Value = feesParticular.Company_ID },
                new SqlParameter("@IsActive", SqlDbType.Bit) { Value = feesParticular.IsActive },
                new SqlParameter("@Mode", SqlDbType.NVarChar) { Value = "I" } // Insert Mode
            };

            var result = _dbLayer.ExecuteNonQuery("Sp_InsertUpdateFeesParticulars", parameters);

            if (result > 0)
            {
                return Ok(new { message = "Fees Particular inserted successfully." });
            }
            return StatusCode(500, new { message = "An error occurred while inserting the Fees Particular." });
        }

        [HttpPost("UpdateFeesParticular")]
        public IActionResult UpdateFeesParticular(Fees feesParticular)
        {
            if (feesParticular.FeesParticularID == null || feesParticular.FeesParticularID <= 0)
            {
                return BadRequest(new { message = "Invalid Fees Particular ID." });
            }

            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@FeesParticularID", SqlDbType.Int) { Value = feesParticular.FeesParticularID },
                new SqlParameter("@FeesParticularName", SqlDbType.NVarChar) { Value = feesParticular.FeesParticularName },
                new SqlParameter("@Company_ID", SqlDbType.Int) { Value = feesParticular.Company_ID},
                new SqlParameter("@IsActive", SqlDbType.Bit) { Value = feesParticular.IsActive },
                new SqlParameter("@Mode", SqlDbType.NVarChar) { Value = "U" } // Update Mode
            };

            var result = _dbLayer.ExecuteNonQuery("Sp_InsertUpdateFeesParticulars", parameters);

            if (result > 0)
            {
                return Ok(new { message = "Fees Particular updated successfully." });
            }
            return StatusCode(500, new { message = "An error occurred while updating the Fees Particular." });
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
