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

    public class ClassFeesController : Controller
    {
        private readonly DBLayer _dbLayer;

        public ClassFeesController(DBLayer dBLayer)
        {
            _dbLayer = dBLayer;
        }

        [HttpPost("GetClassFees")]
        public IActionResult Get(Classfees obj)
        {
            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@ClassId", SqlDbType.Int) { Value = obj.ClassId },
                new SqlParameter("@CompId", SqlDbType.Int) { Value = obj.CompId }
            };
            var data = _dbLayer.GetDataUsingDataTable("Get_Classfees", parameters);
            var dataList = ConvertDataTableToList(data);
            return Ok(dataList);
        }

        [HttpPost("CreateClassFees")]
        public IActionResult CreateClassFees(Classfees obj)
        {
            SqlParameter[] parameters = PrepareSqlParameters(obj, "I"); // 'I' for INSERT

            var result = _dbLayer.ExecuteNonQuery("ClassInsertupdateFees", parameters);

            if (result > 0)
            {
                return Ok(new { message = "Class Fees Added successfully." });
            }
            return StatusCode(500, new { message = "An error occurred while adding Fees." });
        }


        [HttpPut("UpdateClassFees")]
        public IActionResult UpdateClassFees(Classfees obj)
        {
            SqlParameter[] parameters = PrepareSqlParameters(obj, "U"); // 'U' for UPDATE

            var result = _dbLayer.ExecuteNonQuery("ClassInsertupdateFees", parameters);

            if (result > 0)
            {
                return Ok(new { message = "Class Fees details updated successfully." });
            }
            return StatusCode(500, new { message = "An error occurred while updating the class Fees details." });
        }


        private SqlParameter[] PrepareSqlParameters(Classfees obj, string mode)
        {
            return new SqlParameter[]
            {
                new SqlParameter("@ClassFeesId", SqlDbType.Int) { Value = obj.ClassFeesId},
                new SqlParameter("@ClassId", SqlDbType.Int) { Value = obj.ClassId},
                new SqlParameter("@CompId", SqlDbType.Int) { Value = obj.CompId},
                new SqlParameter("@IsActive", SqlDbType.Bit) { Value = obj.IsActive},
                new SqlParameter("@FeesParticularId", SqlDbType.Int) { Value = obj.FeesParticularId},
                new SqlParameter("@FeesAmount", SqlDbType.Int) { Value = obj.FeesAmount},
                new SqlParameter("@mode", SqlDbType.NChar) { Value = mode},
            };
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
