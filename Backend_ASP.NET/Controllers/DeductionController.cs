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
    public class DeductionController : ControllerBase
    {
        private readonly DBLayer _dbLayer;

        public DeductionController(DBLayer dBLayer)
        {
            _dbLayer = dBLayer;
        }

        [HttpPost("GetDeductions")]
        public IActionResult GetDeductions(DeductionParticular obj)
        {
            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@compid", SqlDbType.Int) { Value = obj.compID}
            };

            var data = _dbLayer.GetDataUsingDataTable("Sp_GetDeductionDetailsByCompanyID", parameters);
            var dataList = ConvertDataTableToList(data);

            return Ok(dataList);
        }

        [HttpPost("DeductionCreate")]
        public IActionResult CreateDeduction(DeductionParticular deduction)
        {
            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@DeductionParticularName", SqlDbType.NVarChar) { Value = deduction.DeductionParticularName },
                new SqlParameter("@compID", SqlDbType.Int) { Value = deduction.compID },
                new SqlParameter("@IsActive", SqlDbType.Bit) { Value = deduction.IsActive },
                new SqlParameter("@mode", SqlDbType.NVarChar) { Value = "I" }
            };

            var result = _dbLayer.ExecuteNonQuery("Sp_InsertUpdateDeductionParticular", parameters);

            if (result > 0)

                return Ok(new { message = "Deduction created successfully." });



            return StatusCode(500, new { message = "Error creating deduction." });

        }

        [HttpPost("UpdateDeduction")]
        public IActionResult UpdateDeduction(DeductionParticular deduction)
        {
            if (deduction.DeductionID == null || deduction.DeductionID <= 0)
            {
                return BadRequest(new { message = "Invalid Deduction ID." });
            }

            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@DeductionID", SqlDbType.Int) { Value = deduction.DeductionID },
                new SqlParameter("@DeductionParticularName", SqlDbType.NVarChar) { Value = deduction.DeductionParticularName },
                new SqlParameter("@compID", SqlDbType.Int) { Value = deduction.compID },
                new SqlParameter("@IsActive", SqlDbType.Bit) { Value = deduction.IsActive },
                new SqlParameter("@mode", SqlDbType.NVarChar) { Value = "U" }
            };

            var result = _dbLayer.ExecuteNonQuery("Sp_InsertUpdateDeductionParticular", parameters);

            if (result > 0)
            
                return Ok(new { message = "Deduction updated successfully." });
            
            
            
                return StatusCode(500, new { message = "Error updating deduction." });
            
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