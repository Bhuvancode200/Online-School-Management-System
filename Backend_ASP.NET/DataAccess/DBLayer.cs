using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.SqlClient;
using System.Data;
using Microsoft.Extensions.Configuration;


namespace School.DataAccess
{
    public class DBLayer
    {

        private readonly string _ConnctionString;

        public DBLayer(IConfiguration configuration) {

            _ConnctionString = configuration.GetConnectionString("DefaultConnection");
        }
       
        public int ExecuteNonQuery(String StoredProcName, SqlParameter[] parameter)
        {
            int result = 0;
            SqlConnection con = new SqlConnection(_ConnctionString);
            con.Open();

            SqlCommand cmd = new SqlCommand();
            cmd.Connection = con;
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.CommandText = StoredProcName;

            for (int i = 0; i < parameter.Length; i++)
            {
                cmd.Parameters.Add(parameter[i]);
            }

            try
            {
                result = cmd.ExecuteNonQuery();
                con.Close();
                con.Dispose();
            }
            catch (SqlException ex)
            {
                throw ex;
            }
            finally
            {
                con.Close();
            }

            return result;
        }
        public int ExecuteNonQuery(string StoredProcName, SqlParameter parameter)
        {
            int result = 0;
            SqlConnection con = new SqlConnection(_ConnctionString);
            con.Open();

            SqlCommand cmd = new SqlCommand();
            cmd.Connection = con;
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.CommandText = StoredProcName;
            cmd.Parameters.Add(parameter);

            try
            {
                result = cmd.ExecuteNonQuery();
                con.Close();
                con.Dispose();
            }
            catch (SqlException ex)
            {

            }
            finally
            {
                con.Close();
            }

            return result;
        }
        public DataTable DropBind(string procedureName)
        {
            SqlConnection con = new SqlConnection(_ConnctionString);
            SqlCommand cmd = new SqlCommand();
            cmd.Connection = con;
            DataTable dt = new DataTable();
            con.Open();
            try
            {


                cmd.CommandType = CommandType.StoredProcedure;
                cmd.CommandText = procedureName;
                SqlDataAdapter da = new SqlDataAdapter(cmd);

                da.Fill(dt);
            }
            catch (SqlException ex)
            {
            }
            finally
            {
                con.Close();
            }
            return dt;
        }

        public DataTable DropBindWithParam(string procedureName, SqlParameter p)
        {
            SqlConnection con = new SqlConnection(_ConnctionString);
            SqlCommand cmd = new SqlCommand();
            cmd.Connection = con;
            DataTable dt = new DataTable();
            try
            {

                cmd.CommandType = CommandType.StoredProcedure;
                cmd.CommandText = procedureName;
                cmd.Parameters.Add(p);
                SqlDataAdapter da = new SqlDataAdapter(cmd);

                da.Fill(dt);
            }
            catch (SqlException ex)
            {
            }
            finally
            {
                con.Close();
            }
            return dt;
        }
        public DataTable GetDataUsingDataTable(string StoredProcName, SqlParameter[] parameter)
        {
            SqlConnection con = new SqlConnection(_ConnctionString);
            con.Open();
            SqlCommand cmd = new SqlCommand();
            cmd.Connection = con;
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.CommandText = StoredProcName;
            DataTable dt = new DataTable();

            for (int i = 0; i < parameter.Length; i++)
            {
                cmd.Parameters.Add(parameter[i]);
            }

            try
            {
                SqlDataAdapter da = new SqlDataAdapter(cmd);
                da.Fill(dt);
            }
            catch (SqlException ex)
            {
                throw ex;
            }
            finally
            {
                con.Close();
            }
            return dt;
        }
        public DataTable GetDataUsingDataTable(string StoredProcName, SqlParameter parameter)
        {
            SqlConnection con = new SqlConnection(_ConnctionString);
            con.Open();
            SqlCommand cmd = new SqlCommand();
            cmd.Connection = con;
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.CommandText = StoredProcName;
            DataTable dt = new DataTable();

            cmd.Parameters.Add(parameter);

            try
            {
                SqlDataAdapter da = new SqlDataAdapter(cmd);
                da.Fill(dt);
            }
            catch (SqlException ex)
            {
                throw ex;
            }
            finally
            {
                con.Close();
            }
            return dt;
        }

        ///APPARAO
        ///
        public DataTable BindData(string StoredProcedure)
        {
            DataTable dt = new DataTable();
            SqlConnection con = new SqlConnection(_ConnctionString);
            SqlCommand cmd = new SqlCommand();
            try
            {

                cmd.Connection = con;
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.CommandText = StoredProcedure;
                SqlDataAdapter da = new SqlDataAdapter(cmd);

                da.Fill(dt);

                return dt;
            }
            catch (Exception ex)
            {
                return dt;
            }
            finally
            {
                con.Close();
            }
        }
        //Delete Record using Single parameter change
        public int DeleteDetais(string storedprocedure, SqlParameter[] p)
        {
            int j = 0;
            SqlConnection con = new SqlConnection(_ConnctionString);
            con.Open();

            SqlCommand cmd = new SqlCommand();
            cmd.Connection = con;
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.CommandText = storedprocedure;
            for (int i = 0; i < p.Length; i++)
            {
                cmd.Parameters.Add(p[i]);
            }
            j = cmd.ExecuteNonQuery();
            con.Close();
            return j;
        }
        //Get Details Using  Parameter
        public DataTable GetData(string StoredProcedure, SqlParameter[] p)
        {
            SqlConnection con = new SqlConnection(_ConnctionString);
            SqlCommand cmd = new SqlCommand();
            DataTable dt = new DataTable();
            try
            {
                cmd.Connection = con;
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.CommandText = StoredProcedure;
                for (int i = 0; i < p.Length; i++)
                {
                    cmd.Parameters.Add(p[i]);
                }
                SqlDataAdapter da = new SqlDataAdapter(cmd);

                da.Fill(dt);

            }
            catch (Exception ex)
            {
                //return dt;
            }
            finally
            {
                con.Close();
            }
            return dt;
        }
        //VIJAY
        public int GetNumberOfRecordsCount(string StoredProcName, SqlParameter[] parameter)
        {
            int res = 0;
            SqlConnection con = new SqlConnection(_ConnctionString);
            con.Open();
            try
            {

                SqlCommand cmd = new SqlCommand();
                cmd.Connection = con;
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.CommandText = StoredProcName;
                for (int i = 0; i < parameter.Length; i++)
                {
                    cmd.Parameters.Add(parameter[i]);
                }

                res = Convert.ToInt32(cmd.ExecuteScalar());
            }
            catch (SqlException ex)
            {
                //throw ex;
            }
            finally
            {
                con.Close();
            }
            return res;
        }
        public int GetNumberOfRecordsCount(string StoredProcName, SqlParameter parameter)
        {
            int res = 0;
            SqlConnection con = new SqlConnection(_ConnctionString);
            con.Open();
            try
            {

                SqlCommand cmd = new SqlCommand();
                cmd.Connection = con;
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.CommandText = StoredProcName;

                cmd.Parameters.Add(parameter);
                res = Convert.ToInt32(cmd.ExecuteScalar());
            }
            catch (SqlException ex)
            {
                //throw ex;
            }
            finally
            {
                con.Close();
            }
            return res;
        }



        //Swetha



        public int SearchRecord(string procedurename, SqlParameter[] param)
        {
            SqlConnection con = new SqlConnection(_ConnctionString);
            con.Open();
            int res = 0;
            SqlCommand cmd = new SqlCommand();
            cmd.Connection = con;
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.CommandText = procedurename;
            for (int i = 0; i < param.Length; i++)
            {
                cmd.Parameters.Add(param[i]);
            }

            try
            {
                res = (int)cmd.ExecuteScalar();

            }
            catch (SqlException ex)
            {
                //throw ex;
            }
            finally
            {
                con.Close();
            }
            return res;

        }
        //kalyan

        public DataTable GetAllEvents1()
        {
            SqlConnection sqlcon = new SqlConnection(_ConnctionString);

            sqlcon.Open();
            SqlCommand sqlcmd = new SqlCommand();
            sqlcmd.Connection = sqlcon;
            sqlcmd.CommandText = "SP_GetAllEvents";
            sqlcmd.CommandType = CommandType.StoredProcedure;
            SqlDataAdapter sqlda = new SqlDataAdapter(sqlcmd);
            DataTable dt = new DataTable();
            sqlda.Fill(dt);
            return dt;
        }
        public SqlDataReader GetImage(string eventPK)
        {
            SqlDataReader dr;
            SqlConnection sqlcon = new SqlConnection(_ConnctionString);
            sqlcon.Open();
            SqlCommand cmd = new SqlCommand();
            cmd.CommandText = "SP_GetImage";
            cmd.CommandType = System.Data.CommandType.StoredProcedure;

            cmd.Connection = sqlcon;
            cmd.Parameters.AddWithValue("@eventPK", eventPK);
            try
            {
                dr = cmd.ExecuteReader();

            }
            catch (SqlException ex)
            {
                throw ex;
            }
            finally
            {
                //sqlcon.Close();
            }

            return dr;
        }

        public void ExecuteNonQueryinsupdate(String StoredProcName, SqlParameter[] parameter)
        {
            int result = 0;
            SqlConnection con = new SqlConnection(_ConnctionString);
            con.Open();

            SqlCommand cmd = new SqlCommand();
            cmd.Connection = con;
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.CommandText = StoredProcName;

            for (int i = 0; i < parameter.Length; i++)
            {
                cmd.Parameters.Add(parameter[i]);
            }

            try
            {
                result = cmd.ExecuteNonQuery();
                con.Close();
                con.Dispose();
            }
            catch (SqlException ex)
            {
                throw ex;
            }
            finally
            {
                con.Close();
            }

            
        }
    }
}