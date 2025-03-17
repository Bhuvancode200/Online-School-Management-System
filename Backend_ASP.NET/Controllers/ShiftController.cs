using Microsoft.AspNetCore.Mvc;
using OnLineSchoolWebApi.Models;
using School.DataAccess;
using System.Data;
using System.Data.SqlClient;

namespace OnLineSchoolWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ShiftController : ControllerBase
    {
        private readonly DBLayer _dbLayer;

        public ShiftController(DBLayer dBLayer)
        {
            _dbLayer = dBLayer;
        }

        [HttpPost("GetShifts")]
        public IActionResult GetShifts(Shift obj)
        {
            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@compid", SqlDbType.Int) { Value = obj.compID }
            };

            var data = _dbLayer.GetDataUsingDataTable("Sp_Shift_details_by_compid", parameters);
            var dataList = ConvertDataTableToList(data);
            return Ok(dataList);
        }

        [HttpPost("CreateShift")]
        public IActionResult CreateShift(Shift shift)
        {
            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@Shift_Name", SqlDbType.NVarChar) { Value = shift.Shift_Name },
                new SqlParameter("@compID", SqlDbType.Int) { Value = shift.compID },
                new SqlParameter("@IsActive", SqlDbType.Bit) { Value = shift.Is_Active },
                new SqlParameter("@Mode", SqlDbType.NVarChar) { Value = "I" }
            };

            var result = _dbLayer.ExecuteNonQuery("InsertupdateShifts", parameters);

            if (result > 0)
                return Ok(new { message = "Shift added successfully." });

            return StatusCode(500, new { message = "An error occurred while adding the Shift." });
        }

        [HttpPost("UpdateShift")]
        public IActionResult UpdateShift(Shift shift)
        {
            if (shift.Shift_ID <= 0)
                return BadRequest(new { message = "Invalid Shift ID." });

            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@Shift_ID", SqlDbType.Int) { Value = shift.Shift_ID },
                new SqlParameter("@Shift_Name", SqlDbType.NVarChar) { Value = shift.Shift_Name },
                new SqlParameter("@compID", SqlDbType.Int) { Value = shift.compID },
                new SqlParameter("@IsActive", SqlDbType.Bit) { Value = shift.Is_Active },
                new SqlParameter("@Mode", SqlDbType.NVarChar) { Value = "U" }
            };

            var result = _dbLayer.ExecuteNonQuery("InsertupdateShifts", parameters);

            if (result > 0)
                return Ok(new { message = "Shift updated successfully." });

            return StatusCode(500, new { message = "An error occurred while updating the Shift." });
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
