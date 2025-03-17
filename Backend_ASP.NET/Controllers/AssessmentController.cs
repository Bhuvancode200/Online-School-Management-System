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
public class AssessmentController : ControllerBase
{
private readonly DBLayer _dbLayer;

public AssessmentController(DBLayer dbLayer)
{
_dbLayer = dbLayer;
}

[HttpPost("GetAssessments")]
public IActionResult GetAssessments(Assessment obj)
{
SqlParameter[] parameters = new SqlParameter[]
{
new SqlParameter("@CompID", SqlDbType.Int) { Value = obj.CompID }
};

var data = _dbLayer.GetDataUsingDataTable("Sp_AssessmentsByCompID", parameters);
var dataList = ConvertDataTableToList(data);
return Ok(dataList);
}

[HttpPost("InsertAssessment")]
public IActionResult InsertAssessment(Assessment assessment)
{
SqlParameter[] parameters = new SqlParameter[]
{
new SqlParameter("@AssessmentName", SqlDbType.NVarChar) { Value = assessment.AssessmentName },
new SqlParameter("@CompID", SqlDbType.Int) { Value = assessment.CompID },
new SqlParameter("@IsActive", SqlDbType.Bit) { Value = assessment.IsActive },
new SqlParameter("@Mode", SqlDbType.NVarChar) { Value = "I" } // Insert Mode
};

var result = _dbLayer.ExecuteNonQuery("Sp_InsertUpdateAssessments", parameters);

if (result > 0)
{
return Ok(new { message = "Assessment inserted successfully." });
}
else
{
return StatusCode(500, new { message = "An error occurred while inserting the Assessment." });
}
}


[HttpPost("UpdateAssessment")]
public IActionResult UpdateAssessment(Assessment assessment)
{
if (assessment.AssessmentID == null || assessment.AssessmentID <= 0)
{
return BadRequest(new { message = "Invalid Assessment ID." });
}

SqlParameter[] parameters = new SqlParameter[]
{
new SqlParameter("@AssessmentID", SqlDbType.Int) { Value = assessment.AssessmentID },
new SqlParameter("@AssessmentName", SqlDbType.NVarChar) { Value = assessment.AssessmentName },
new SqlParameter("@CompID", SqlDbType.Int) { Value = assessment.CompID },
new SqlParameter("@IsActive", SqlDbType.Bit) { Value = assessment.IsActive },
new SqlParameter("@Mode", SqlDbType.NVarChar) { Value = "U" } // Update Mode
};

var result = _dbLayer.ExecuteNonQuery("Sp_InsertUpdateAssessments", parameters);

if (result > 0)
{
return Ok(new { message = "Assessment updated successfully." });
}
else
{
return StatusCode(500, new { message = "An error occurred while updating the Assessment." });
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