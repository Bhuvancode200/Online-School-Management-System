
using Microsoft.AspNetCore.Mvc;
using OnLineSchoolWebApi.Models;
using School.DataAccess;
using System.Data;
using System.Data.SqlClient;

namespace OnLineSchoolWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClassMessagesController : ControllerBase
    {
        private readonly DBLayer _dbLayer;

        public ClassMessagesController(DBLayer dbLayer)
        {
            _dbLayer = dbLayer;
        }

        // Fetch all messages
       // [HttpGet("GetAllMessages")]
        //public IActionResult GetAllMessages()
        //{
        //    var data = _dbLayer.GetDataUsingDataTable("Sp_GetAllClassMessages", null);
        //    var dataList = ConvertDataTableToList(data);
        //    return Ok(dataList);
        //}

        // Insert a new message
        [HttpPost("InsertMessage")]
        public IActionResult InsertMessage(ClassMessage message)
        {
            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@SenderID", SqlDbType.Int) { Value = message.SenderID },
                new SqlParameter("@Subject", SqlDbType.NVarChar) { Value = message.Subject },
                new SqlParameter("@MessageBody", SqlDbType.NVarChar) { Value = message.MessageBody },
                new SqlParameter("@Recipients", SqlDbType.NVarChar) { Value = message.Recipients },
                new SqlParameter("@Attachments", SqlDbType.NVarChar) { Value = message.Attachments ?? (object)DBNull.Value },
                new SqlParameter("@UrgencyLevel", SqlDbType.NVarChar) { Value = message.UrgencyLevel ?? (object)DBNull.Value },
                new SqlParameter("@StatusMessage", SqlDbType.NVarChar) { Value = "Pending" }
            };

            var result = _dbLayer.ExecuteNonQuery("Sp_InsertClassMessage", parameters);
            if (result > 0)
            {
                return Ok(new { message = "Message inserted successfully." });
            }
            return StatusCode(500, new { message = "An error occurred while inserting the message." });
        }

        // Update an existing message
        [HttpPost("UpdateMessage")]
        public IActionResult UpdateMessage(ClassMessage message)
        {
            if (message.MessageID == null || message.MessageID <= 0)
            {
                return BadRequest(new { message = "Invalid Message ID." });
            }

            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@MessageID", SqlDbType.Int) { Value = message.MessageID },
                new SqlParameter("@SenderID", SqlDbType.Int) { Value = message.SenderID },
                new SqlParameter("@Subject", SqlDbType.NVarChar) { Value = message.Subject },
                new SqlParameter("@MessageBody", SqlDbType.NVarChar) { Value = message.MessageBody },
                new SqlParameter("@Recipients", SqlDbType.NVarChar) { Value = message.Recipients },
                new SqlParameter("@Attachments", SqlDbType.NVarChar) { Value = message.Attachments ?? (object)DBNull.Value },
                new SqlParameter("@UrgencyLevel", SqlDbType.NVarChar) { Value = message.UrgencyLevel ?? (object)DBNull.Value },
                new SqlParameter("@StatusMessage", SqlDbType.NVarChar) { Value = message.StatusMessage }
            };

            var result = _dbLayer.ExecuteNonQuery("Sp_UpdateClassMessage", parameters);
            if (result > 0)
            {
                return Ok(new { message = "Message updated successfully." });
            }
            return StatusCode(500, new { message = "An error occurred while updating the message." });
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

