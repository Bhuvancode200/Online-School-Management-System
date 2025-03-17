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
    public class SubjectController : ControllerBase
    {
        private readonly DBLayer _dbLayer;

        public SubjectController(DBLayer dBLayer)
        {
            _dbLayer = dBLayer;

        }


        [HttpPost("GetSubjects")]
        public IActionResult Get(Subjects obj)
        {

            SqlParameter[] parameters = new SqlParameter[]
           {
                new SqlParameter("@compid", System.Data.SqlDbType.Int) { Value = obj.Company_ID }
           };

            var data = _dbLayer.GetDataUsingDataTable("Sp_Subject_details_by_compid", parameters);


            var dataList = ConvertDataTableToList(data);


            return Ok(dataList);
        }

        //[HttpPost("GetSubjects")]
        //public IActionResult GetSubjects(int? subjectId = null)
        //{
        //    SqlParameter[] parameters = new SqlParameter[]
        //    {
        //new SqlParameter("@Subject_ID", SqlDbType.Int) { Value = (object)subjectId ?? DBNull.Value }
        //    };

        //    var data = _dbLayer.GetDataUsingDataTable("Sp_GetSubjectsById", parameters);

        //    var dataList = ConvertDataTableToList(data);

        //    return Ok(dataList);
        //}


        [HttpPost("SubjectCreate")]
        public IActionResult SubjectInsert(Subjects subj)
        {

            SqlParameter[] parameters = new SqlParameter[]
           {
        new SqlParameter("@subject_name", SqlDbType.NVarChar) { Value = subj.Subject_Name },
        new SqlParameter("@company_id", SqlDbType.Int) { Value = subj.Company_ID },
        new SqlParameter("@is_active",  SqlDbType.Bit) { Value = subj.IsActive },
            new SqlParameter("@mode", System.Data.SqlDbType.NVarChar) { Value = "I" }

           };

            var data = _dbLayer.ExecuteNonQuery("InsertupdateSubjects", parameters);


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


        [HttpPost("UpdateSubjects")]
        public IActionResult UpdateSubjectsEdit(Subjects obj)
        {
            if (obj.Subject_ID == null || obj.Subject_ID <= 0)
            {
                return BadRequest(new { message = "Invalid Subject ID." });
            }

            SqlParameter[] parameters = new SqlParameter[]
            {
           new SqlParameter("@subject_id", SqlDbType.Int) { Value = obj.Subject_ID },
           new SqlParameter("@subject_name", SqlDbType.NVarChar) { Value = obj.Subject_Name },
           new SqlParameter("@company_id", SqlDbType.Int) { Value = obj.Company_ID },
           new SqlParameter("@is_active",  SqlDbType.Bit) { Value = obj.IsActive },
           new SqlParameter("@mode", SqlDbType.NChar) { Value = "U" } // 'U' for Update
            };

            var result = _dbLayer.ExecuteNonQuery("InsertupdateSubjects", parameters);

            if (result > 0)
            {
                return Ok(new { message = "Subject updated successfully." });
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
