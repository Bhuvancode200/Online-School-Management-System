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
    public class ClassSubjectsController : ControllerBase
    {
        private readonly DBLayer _dbLayer;

        public ClassSubjectsController(DBLayer dBLayer)
        {
            _dbLayer = dBLayer;
        }

        [HttpPost("GetClassSubjects")]
        public IActionResult Get(ClassSubjectsModel obj)
        {
            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@classID", SqlDbType.Int) { Value = obj.ClassID },
                new SqlParameter("@compID", SqlDbType.Int) { Value = obj.CompID }
            };

            var data = _dbLayer.GetDataUsingDataTable("Get_MappingClassSubjects", parameters);

            var dataList = ConvertDataTableToList(data);

            return Ok(dataList);
        }

        private List<ClassSubjectsModel> ConvertDataTableToList(DataTable dataTable)
        {
            var classSubjectsList = new List<ClassSubjectsModel>();

            foreach (DataRow row in dataTable.Rows)
            {
                var classSubject = new ClassSubjectsModel
                {
                    MappingID = row["MappingID"] != DBNull.Value ? Convert.ToInt32(row["MappingID"]) : 0,
                    ClassID = row["classID"] != DBNull.Value ? Convert.ToInt32(row["classID"]) : 0,
                    SubjectID = row["Subject_ID"] != DBNull.Value ? Convert.ToInt32(row["Subject_ID"]) : 0,
                    CompID = row["Company_ID"] != DBNull.Value ? Convert.ToInt32(row["Company_ID"]) : 0,
                    IsActive = row["ISMappedToclass"].ToString() == "True" ? 1 : 0
                };
                classSubjectsList.Add(classSubject);
            }

            return classSubjectsList;
        }
    }
}
