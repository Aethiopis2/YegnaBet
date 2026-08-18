using Microsoft.EntityFrameworkCore;
using YegnaBet.API.Modules.Brokers.Services;
using YegnaBet.API.Modules.Finance.Services;
using YegnaBet.API.Modules.Marketplace.Services;
using YegnaBet.API.Modules.Realtime;
using YegnaBet.API.Modules.Users.Services;
using YegnaBet.Infrastructure.Persistence;
using YegnaBet.Infrastructure.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<BrokerDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("Default")));

builder.Services.AddScoped<MarketplaceService>();
builder.Services.AddScoped<BrokerService>();
builder.Services.AddScoped<AuditService>();
builder.Services.AddScoped<FinanceService>();
builder.Services.AddScoped<UserService>();
builder.Services.AddControllers();
builder.Services.AddSignalR();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("web", policy =>
        policy.WithOrigins("http://localhost:5173")
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials());
});

var app = builder.Build();

//app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseCors("web");

app.UseAuthorization();

app.MapControllers();

//using (var scope = app.Services.CreateScope())
//{
//    var db = scope.ServiceProvider.GetRequiredService<BrokerDbContext>();
//    await DbSeeder.SeedAsync(db);
//}

app.MapHub<BrokerHub>("/hubs/broker");
app.Run();