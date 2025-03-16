
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Data.SqlClient;
using School.DataAccess;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

//Retrive connection string from appsetting.json

var connectionstring = builder.Configuration.GetConnectionString("DefaultConnection");

//Register sqlserver connction with dependency injection

builder.Services.AddScoped(_ => new SqlConnection(connectionstring));
builder.Services.AddScoped<DBLayer>();

if (builder.Environment.IsDevelopment())
{
    builder.Services.AddCors(options =>
    {
        options.AddPolicy("AllowLocalhost", policy =>
        {
            policy.WithOrigins("http://localhost:3000")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });

        //options.AddPolicy("AllowLocalhost", policy =>
        //{
        //    policy.WithOrigins("http://chand2025-001-site1.ptempurl.com")
        //          .AllowAnyHeader()
        //          .AllowAnyMethod();
        //});


        //options.AddPolicy("AllowAnyOrigin", policy =>
        //{
        //    policy.AllowAnyOrigin() // Allow any origin
        //          .AllowAnyHeader()  // Allow any header
        //          .AllowAnyMethod(); // Allow any HTTP method (GET, POST, etc.)
        //});
    });
}




var app = builder.Build();


app.UseCors("AllowLocalhost");
//app.UseCors("AllowAnyOrigin");





// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//app.UseHttpsRedirection();

//app.UseAuthorization();

app.MapControllers();

app.Run();
