using Microsoft.AspNetCore.Mvc;
using OnLineSchoolWebApi.Models;
using School.DataAccess;
using System.Data;
using System.Data.SqlClient;

namespace OnLineSchoolWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdmitStudentController : ControllerBase
    {
        private readonly DBLayer _dbLayer;

        public AdmitStudentController(DBLayer dBLayer)
        {
            _dbLayer = dBLayer;
        }

        // GET method to retrieve AdmitStudent data
        [HttpGet("GetAdmitStudent")]
        public IActionResult Get()
        {

            SqlParameter[] parameters = new SqlParameter[]
           {
                new SqlParameter("@classid", System.Data.SqlDbType.Int) { Value = 20 },
                new SqlParameter("@compid", System.Data.SqlDbType.Int) { Value = 24}

           };

            var data = _dbLayer.GetDataUsingDataTable("Sp_Get_AdminStudent_By_Id_com_id_class_id", parameters);


            var dataList = ConvertDataTableToList(data);


            return Ok(dataList);
        }

        // POST method to create a new AdmitStudent record
        [HttpPost("CreateAdmitStudent")]
        public IActionResult CreateAdmitStudent(AdmitStudent admitStudent)
        {
            SqlParameter[] parameters = PrepareSqlParameters(admitStudent, "I"); // 'I' for INSERT

            var result = _dbLayer.ExecuteNonQuery("INS_UPDATE_DELETE_ADMITSTUDENT", parameters);

            if (result > 0)
            {
                return Ok(new { message = "Student admitted successfully." });
            }
            return StatusCode(500, new { message = "An error occurred while admitting the student." });
        }

        // PUT method to update an existing AdmitStudent record
        [HttpPut("UpdateAdmitStudent")]
        public IActionResult UpdateAdmitStudent(AdmitStudent admitStudent)
        {
            SqlParameter[] parameters = PrepareSqlParameters(admitStudent, "U"); // 'U' for UPDATE

            var result = _dbLayer.ExecuteNonQuery("INS_UPDATE_DELETE_ADMITSTUDENT", parameters);

            if (result > 0)
            {
                return Ok(new { message = "Student details updated successfully." });
            }
            return StatusCode(500, new { message = "An error occurred while updating the student details." });
        }

        // Helper method to prepare SQL parameters
        private SqlParameter[] PrepareSqlParameters(AdmitStudent admitStudent, string mode)
        {
            return new SqlParameter[]
            {
        new SqlParameter("@studentname", SqlDbType.NVarChar) { Value = admitStudent.STUDENT_NAME },
        new SqlParameter("@Lastname", SqlDbType.NVarChar) { Value = admitStudent.STUDENT_LASTNAME },
        new SqlParameter("@address", SqlDbType.NVarChar) { Value = admitStudent.ADDRESS },
        new SqlParameter("@Phoneno", SqlDbType.NVarChar) { Value = admitStudent.PHONE_NO },
        new SqlParameter("@classid", SqlDbType.Int) { Value = admitStudent.CLASS_ID },
        new SqlParameter("@gender", SqlDbType.NVarChar) { Value = admitStudent.GENDER },
        new SqlParameter("@Dob", SqlDbType.NVarChar) { Value = admitStudent.DOB },
        new SqlParameter("@Admitid", SqlDbType.Int) { Value = admitStudent.ADMIT_STDID },
        new SqlParameter("@Fathername", SqlDbType.NVarChar) { Value = admitStudent.FATHER_NAME },
        new SqlParameter("@Status", SqlDbType.NVarChar) { Value = admitStudent.STATUS },
        new SqlParameter("@stdid", SqlDbType.Int) { Value = admitStudent.STD_ID },
        new SqlParameter("@aadarno", SqlDbType.NVarChar) { Value = admitStudent.AADAR_NO },
        new SqlParameter("@Rollno", SqlDbType.Int) { Value = admitStudent.ROLL_NO },
        new SqlParameter("@Compid", SqlDbType.Int) { Value = admitStudent.COMP_ID },
        new SqlParameter("@LocationId", SqlDbType.Int) { Value = admitStudent.LocationID },
        new SqlParameter("@mode", SqlDbType.NVarChar) { Value = mode }
            };
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
