using Microsoft.AspNetCore.Mvc;
using OnLineSchoolWebApi.Models;
using School.DataAccess;
using System.Data;
using System.Data.SqlClient;

namespace OnLineSchoolWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeTypeController : ControllerBase
    {
        private readonly DBLayer _dbLayer;

        public EmployeeTypeController(DBLayer dBLayer)
        {
            _dbLayer = dBLayer;
        }

        [HttpPost("GetEmployeeTypes")]
        public IActionResult GetEmployeeTypes(EmployeeType obj)
        {
            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@compid", SqlDbType.Int) { Value = obj.Comp_ID }
            };

            var data = _dbLayer.GetDataUsingDataTable("Sp_EmployeeType_details_by_compid", parameters);
            var dataList = ConvertDataTableToList(data);
            return Ok(dataList);
        }

        [HttpPost("CreateEmployeeType")]
        public IActionResult CreateEmployeeType(EmployeeType employeeType)
        {
            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@EmployeeType_Name", SqlDbType.NVarChar) { Value = employeeType.EmployeeType_Name },
                new SqlParameter("@CompID", SqlDbType.Int) { Value = employeeType.Comp_ID },
                //new SqlParameter("@IsActive", SqlDbType.Bit) { Value = employeeType.IsActive },
                new SqlParameter("@IsActive", SqlDbType.Bit) { Value = (object)employeeType.IsActive ?? true },

                new SqlParameter("@Mode", SqlDbType.NVarChar) { Value = "I" }
            };

            var result = _dbLayer.ExecuteNonQuery("InsertupdateEmployeeType", parameters);

            if (result > 0)
                return Ok(new { message = "EmployeeType added successfully." });

            return StatusCode(500, new { message = "An error occurred while adding the EmployeeType." });
        }

        [HttpPost("UpdateEmployeeType")]
        public IActionResult UpdateEmployeeType(EmployeeType employeeType)
        {
            if (employeeType.EmployeeType_ID <= 0)
                return BadRequest(new { message = "Invalid EmployeeType ID." });

            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@EmployeeType_ID", SqlDbType.Int) { Value = employeeType.EmployeeType_ID },
                new SqlParameter("@EmployeeType_Name", SqlDbType.NVarChar) { Value = employeeType.EmployeeType_Name },
                new SqlParameter("@CompID", SqlDbType.Int) { Value = employeeType.Comp_ID },
                new SqlParameter("@IsActive", SqlDbType.Bit) { Value = employeeType.IsActive },
                new SqlParameter("@Mode", SqlDbType.NVarChar) { Value = "U" }
            };

            var result = _dbLayer.ExecuteNonQuery("InsertupdateEmployeeType", parameters);

            if (result > 0)
                return Ok(new { message = "EmployeeType updated successfully." });

            return StatusCode(500, new { message = "An error occurred while updating the EmployeeType." });
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
