using Microsoft.EntityFrameworkCore;
using YegnaBet.Infrastructure.Persistence;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<BrokerDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("Default")));

builder.Services.AddControllers();


var app = builder.Build();

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

//using (var scope = app.Services.CreateScope()) 
//{ 
//    var db = scope.ServiceProvider.GetRequiredService<BrokerDbContext>(); 
//    await DbSeeder.SeedAsync(db); 
//}

app.Run();