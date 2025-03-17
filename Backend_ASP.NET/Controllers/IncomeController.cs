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
    public class IncomeController : ControllerBase
    {
        private readonly DBLayer _dbLayer;

        public IncomeController(DBLayer dBLayer)
        {
            _dbLayer = dBLayer;
        }

        [HttpPost("GetIncomes")]
        public IActionResult GetIncomes(IncomeParticular obj)
        {
            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@compid", SqlDbType.Int) { Value = obj.compID }
            };

            var data = _dbLayer.GetDataUsingDataTable("Sp_GetIncomeDetailsByCompanyID", parameters);
            var dataList = ConvertDataTableToList(data);

            return Ok(dataList);
        }

        [HttpPost("IncomeCreate")]
        public IActionResult CreateIncome(IncomeParticular income)
        {
            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@IncomeParticularName", SqlDbType.NVarChar) { Value = income.IncomeParticularName },
                new SqlParameter("@compID", SqlDbType.Int) { Value = income.compID },
                new SqlParameter("@IsActive", SqlDbType.Bit) { Value = income.IsActive },
                new SqlParameter("@mode", SqlDbType.NVarChar) { Value = "I" }
            };

            var result = _dbLayer.ExecuteNonQuery("Sp_InsertUpdateIncomeParticular", parameters);

            if (result > 0)
                return Ok(new { message = "Income created successfully." });

            return StatusCode(500, new { message = "Error creating income." });
        }

        [HttpPost("UpdateIncome")]
        public IActionResult UpdateIncome(IncomeParticular income)
        {
            if (income.IncomeID == null || income.IncomeID <= 0)
                return BadRequest(new { message = "Invalid Income ID." });

            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@IncomeID", SqlDbType.Int) { Value = income.IncomeID },
                new SqlParameter("@IncomeParticularName", SqlDbType.NVarChar) { Value = income.IncomeParticularName },
                new SqlParameter("@compID", SqlDbType.Int) { Value = income.compID },
                new SqlParameter("@IsActive", SqlDbType.Bit) { Value = income.IsActive },
                new SqlParameter("@mode", SqlDbType.NVarChar) { Value = "U" }
            };

            var result = _dbLayer.ExecuteNonQuery("Sp_InsertUpdateIncomeParticular", parameters);

            if (result > 0)
                return Ok(new { message = "Income updated successfully." });

            return StatusCode(500, new { message = "Error updating income." });
        }

        private static List<Dictionary<string, object>> ConvertDataTableToList(DataTable dataTable)
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
