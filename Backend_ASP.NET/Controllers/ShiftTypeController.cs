

using Microsoft.AspNetCore.Mvc;
using School.DataAccess;
using System.Data;
using Microsoft.AspNetCore.Http;
using System.Data.SqlClient;
using System.Collections.Generic;
using OnLineSchoolWebApi.Models;

namespace OnLineSchoolWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ShiftTypeController : ControllerBase
    {
        private readonly DBLayer _dbLayer;

        public ShiftTypeController(DBLayer dBLayer)
        {
            _dbLayer = dBLayer;
        }



        [HttpPost("GetShiftTypes")]
        public IActionResult Get(ShiftType obj)
        {

            SqlParameter[] parameters = new SqlParameter[]
           {
                new SqlParameter("@compid", System.Data.SqlDbType.Int) { Value = obj.compID }
           };

            var data = _dbLayer.GetDataUsingDataTable("Sp_GetShiftTypeByCompID", parameters);


            var dataList = ConvertDataTableToList(data);


            return Ok(dataList);
        }

        [HttpPost("CreateShiftType")]
        public IActionResult LocationInsert(ShiftType obj)
        {

            SqlParameter[] parameters = new SqlParameter[]
           {

            new SqlParameter("@ShiftTypeName", SqlDbType.NVarChar) { Value = obj.ShiftTypeName},
            new SqlParameter("@compID", SqlDbType.Int) { Value = obj.compID },
            new SqlParameter("@IsActive",  SqlDbType.Bit) { Value = obj.IsActive },
            new SqlParameter("@mode", System.Data.SqlDbType.NVarChar) { Value = "I" }

           };

            var data = _dbLayer.ExecuteNonQuery("Sp_InsertUpdateShiftType", parameters);


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

        [HttpPut("UpdateShiftType")]

        public IActionResult UpdateLocationEdit(ShiftType obj)
        {
            if (obj.ShiftTypeId == null || obj.ShiftTypeId <= 0)
            {
                return BadRequest(new { message = "Invalid Location ID." });
            }

            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@ShiftTypeId", SqlDbType.Int) { Value = obj.ShiftTypeId },
                new SqlParameter("@ShiftTypeName", SqlDbType.NVarChar) { Value = obj.ShiftTypeName},
                new SqlParameter("@compID", SqlDbType.Int) { Value = obj.compID},
                new SqlParameter("@IsActive",  SqlDbType.Bit) { Value = obj.IsActive },
                new SqlParameter("@mode", SqlDbType.NChar) { Value = "U" } // 'U' for Update
            };

            var result = _dbLayer.ExecuteNonQuery("Sp_InsertUpdateShiftType", parameters);

            if (result > 0)
            {
                return Ok(new { message = "shift updated successfully." });
            }
            else
            {
                return StatusCode(500, new { message = "An error occurred while updating the shift." });
            }
        }

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
