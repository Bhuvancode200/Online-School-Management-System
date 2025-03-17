using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using School.DataAccess;
using System.Data;
using System.Data.SqlClient;
using OnLineSchoolWebApi.Models;
using System.Collections.Generic;

namespace OnLineSchoolWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CourseController : ControllerBase
    {
        private readonly DBLayer _dbLayer;

        public CourseController(DBLayer dBLayer)
        {
            _dbLayer = dBLayer;
        }

        [HttpPost("GetClass")]
        public IActionResult GetCourses(CourseRequest request)
        {
            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@COMP_ID", SqlDbType.Int) { Value = request.COMP_ID },
                new SqlParameter("@CLASS_ID", SqlDbType.Int) { Value = request.CLASS_ID },
                new SqlParameter("@IS_ACTIVE", SqlDbType.Bit) { Value = request.IS_ACTIVE },
                new SqlParameter("@CLASS_NAME", SqlDbType.NVarChar) { Value = (object)request.CLASS_NAME ?? DBNull.Value }
            };

            var data = _dbLayer.GetDataUsingDataTable("Sp_GetClasses", parameters);
            var courseList = ConvertDataTableToList(data);

            return Ok(courseList);
        }

        [HttpPost("ClassCreate")]
        public IActionResult CreateCourse(Course course)
        {
            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@COMP_ID", SqlDbType.Int) { Value = course.COMP_ID },
                new SqlParameter("@CLASS_NAME", SqlDbType.NVarChar) { Value = course.CLASS_NAME },
                new SqlParameter("@IS_ACTIVE", SqlDbType.Bit) { Value = course.IS_ACTIVE },
                new SqlParameter("@mode", SqlDbType.NVarChar) { Value = "I" } // 'I' for Insert
            };

            var result = _dbLayer.ExecuteNonQuery("InsertUpdateClass", parameters);

            if (result > 0)
            {
                return Ok(new { message = "Course added successfully." });
            }
            else
            {
                return StatusCode(500, new { message = "An error occurred while adding the course." });
            }
        }

        [HttpPost("UpdateClass")]
        public IActionResult UpdateCourse(Course course)
        {
            if (course.CLASS_ID <= 0)
            {
                return BadRequest(new { message = "Invalid Course ID." });
            }

            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@COMP_ID", SqlDbType.Int) { Value = course.COMP_ID },
                new SqlParameter("@CLASS_ID", SqlDbType.Int) { Value = course.CLASS_ID },
                new SqlParameter("@CLASS_NAME", SqlDbType.NVarChar) { Value = course.CLASS_NAME },
                new SqlParameter("@IS_ACTIVE", SqlDbType.Bit) { Value = course.IS_ACTIVE },
                new SqlParameter("@mode", SqlDbType.NVarChar) { Value = "U" } // 'U' for Update
            };

            var result = _dbLayer.ExecuteNonQuery("InsertUpdateClass", parameters);

            if (result > 0)
            {
                return Ok(new { message = "Course updated successfully." });
            }
            else
            {
                return StatusCode(500, new { message = "An error occurred while updating the course." });
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
