using Microsoft.AspNetCore.Mvc;
using OnLineSchoolWebApi.Models;
using School.DataAccess;
using System.Data;
using System.Data.SqlClient;

namespace OnLineSchoolWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GraphController : ControllerBase
    {
        private readonly DBLayer _dbLayer;

        public GraphController(DBLayer dBLayer)
        {
            _dbLayer = dBLayer;
        }

        // 📌 API: Get Classwise Gender Count
        [HttpPost("GetClasswiseGenderCount")]
        public IActionResult GetClasswiseGenderCount([FromBody] ProfileUserData profileUserData)
        {
            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@compid", SqlDbType.Int) { Value = profileUserData.CompID }
            };

            var data = _dbLayer.GetDataUsingDataTable("GetClasswiseGenderCount", parameters);
            var dataList = ConvertDataTableToList<ClasswiseGenderCount>(data);
            return Ok(dataList);
        }

        // 📌 API: Get Classwise Student Count
        [HttpPost("GetClassWiseStudentCount")]
        public IActionResult GetClassWiseStudentCount([FromBody] ProfileUserData profileUserData)
        {
            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@compid", SqlDbType.Int) { Value = profileUserData.CompID }
            };

            var data = _dbLayer.GetDataUsingDataTable("GetClassWiseStudentCount", parameters);
            var dataList = ConvertDataTableToList<ClasswiseStudentCount>(data);
            return Ok(dataList);
        }

        // 📌 API: Get Location-wise Student List
        [HttpPost("GetLocationWiseStudentList")]
        public IActionResult GetLocationWiseStudentList([FromBody] ProfileUserData profileUserData)
        {
            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@compid", SqlDbType.Int) { Value = profileUserData.CompID }
            };

            var data = _dbLayer.GetDataUsingDataTable("GetLocationWiseStudentList", parameters);
            var dataList = ConvertDataTableToList<LocationWiseStudentList>(data);
            return Ok(dataList);
        }

        // Helper Method: Convert DataTable to List
        private List<T> ConvertDataTableToList<T>(DataTable dataTable) where T : new()
        {
            var list = new List<T>();

            foreach (DataRow row in dataTable.Rows)
            {
                T item = new T();
                foreach (DataColumn column in dataTable.Columns)
                {
                    var property = typeof(T).GetProperty(column.ColumnName);
                    if (property != null && row[column] != DBNull.Value)
                    {
                        property.SetValue(item, row[column]);
                    }
                }
                list.Add(item);
            }
            return list;
        }
    }
}