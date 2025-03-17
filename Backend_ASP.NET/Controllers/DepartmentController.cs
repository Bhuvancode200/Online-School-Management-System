using Microsoft.AspNetCore.Mvc;
using OnLineSchoolWebApi.Models;
using School.DataAccess;
using System.Data;
using System.Data.SqlClient;

namespace OnLineSchoolWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DepartmentController : ControllerBase
    {
        private readonly DBLayer _dbLayer;

        public DepartmentController(DBLayer dBLayer)
        {
            _dbLayer = dBLayer;
        }

        [HttpPost("GetDepartments")]
        public IActionResult GetDepartments(Department obj)
        {
            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@compid", SqlDbType.Int) { Value = obj.compID }
            };

            var data = _dbLayer.GetDataUsingDataTable("Sp_Department_details_by_compid", parameters);
            var dataList = ConvertDataTableToList(data);
            return Ok(dataList);
        }

        [HttpPost("CreateDepartment")]
        public IActionResult CreateDepartment(Department department)
        {
            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@Department_Name", SqlDbType.NVarChar) { Value = department.Department_Name },
                new SqlParameter("@compID", SqlDbType.Int) { Value = department.compID },
                new SqlParameter("@IsActive", SqlDbType.Bit) { Value = department.Is_Active },
                new SqlParameter("@Mode", SqlDbType.NVarChar) { Value = "I" }
            };

            var result = _dbLayer.ExecuteNonQuery("InsertupdateDepartments", parameters);

            if (result > 0)
                return Ok(new { message = "Department added successfully." });

            return StatusCode(500, new { message = "An error occurred while adding the Department." });
        }

        [HttpPost("UpdateDepartment")]
        public IActionResult UpdateDepartment(Department department)
        {
            if (department.Department_ID <= 0)
                return BadRequest(new { message = "Invalid Department ID." });

            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@Department_ID", SqlDbType.Int) { Value = department.Department_ID },
                new SqlParameter("@Department_Name", SqlDbType.NVarChar) { Value = department.Department_Name },
                new SqlParameter("@compID", SqlDbType.Int) { Value = department.compID },
                new SqlParameter("@IsActive", SqlDbType.Bit) { Value = department.Is_Active },
                new SqlParameter("@Mode", SqlDbType.NVarChar) { Value = "U" }
            };

            var result = _dbLayer.ExecuteNonQuery("InsertupdateDepartments", parameters);

            if (result > 0)
                return Ok(new { message = "Department updated successfully." });

            return StatusCode(500, new { message = "An error occurred while updating the Department." });
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
