using Microsoft.AspNetCore.Mvc;
using OnLineSchoolWebApi.Models;
using School.DataAccess;
using System.Data;
using System.Data.SqlClient;



namespace OnLineSchoolWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClassController : ControllerBase
    {
        private readonly DBLayer _dbLayer;

        public ClassController(DBLayer dBLayer)
        {
            _dbLayer = dBLayer;

        }


        [HttpPost("GetClass")]
        public IActionResult Get(ClassModel obj)
        {

            SqlParameter[] parameters = new SqlParameter[]
           {
                new SqlParameter("@compid", System.Data.SqlDbType.Int) { Value = obj.COMP_ID }
           };

            var data = _dbLayer.GetDataUsingDataTable("Sp_class_detailsBY_id", parameters);


            var dataList = ConvertDataTableToList(data);


            return Ok(dataList);
        }

        [HttpPost("ClassCreate")]
        public IActionResult ClassInsert(ClassModel obj)
        {

            SqlParameter[] parameters = new SqlParameter[]
           {
        new SqlParameter("@classname", SqlDbType.NVarChar) { Value = obj.CLASS_NAME },
        new SqlParameter("@comp_id", SqlDbType.Int) { Value = obj.COMP_ID },
       // new SqlParameter("@branch_id", SqlDbType.Int) { Value = obj.BRANCH_ID },
        new SqlParameter("@is_active", SqlDbType.NVarChar) { Value = obj.IS_ACTIVE },
            new SqlParameter("@mode", System.Data.SqlDbType.NVarChar) { Value = "I" }

           };

            var data = _dbLayer.ExecuteNonQuery("InsertupdateClassModel", parameters);


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




        [HttpPost("UpdateClass")]
        public IActionResult UpdateClass(ClassModel obj)
        {
            if (obj.CLASS_ID == null || obj.CLASS_ID <= 0)
            {
                return BadRequest(new { message = "Invalid Class ID." });
            }

            SqlParameter[] parameters = new SqlParameter[]
            {
  new SqlParameter("@classid", SqlDbType.Int) { Value = obj.CLASS_ID },
  new SqlParameter("@classname", SqlDbType.NVarChar) { Value = obj.CLASS_NAME },
  new SqlParameter("@comp_id", SqlDbType.Int) { Value = obj.COMP_ID },
 // new SqlParameter("@branch_id", SqlDbType.Int) { Value = obj.BRANCH_ID },
  new SqlParameter("@is_active", SqlDbType.NVarChar) { Value = obj.IS_ACTIVE },
  new SqlParameter("@mode", SqlDbType.NChar) { Value = "U" } // 'U' for Update
            };

            var result = _dbLayer.ExecuteNonQuery("InsertupdateClassModel", parameters);

            if (result > 0)
            {
                return Ok(new { message = "Class updated successfully." });
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
