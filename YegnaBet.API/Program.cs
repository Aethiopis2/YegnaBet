using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;
using System.Text.Json.Serialization;
using YegnaBet.API.Modules.Authentication;
using YegnaBet.API.Modules.Brokers.Services;
using YegnaBet.API.Modules.Employee.Services;
using YegnaBet.API.Modules.Finance.Services;
using YegnaBet.API.Modules.Marketplace.Services;
using YegnaBet.API.Modules.Provider.Services;
using YegnaBet.API.Modules.Realtime;
using YegnaBet.API.Modules.Search;
using YegnaBet.API.Modules.Users.Services;
using YegnaBet.Domain.Entities;
using YegnaBet.Infrastructure.Persistence;
using YegnaBet.Infrastructure.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<BrokerDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("Default")));

builder.Services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();
builder.Services.AddScoped<CategoryService>();
builder.Services.AddScoped<MarketplaceService>();
builder.Services.AddScoped<BrokerService>();
builder.Services.AddScoped<AuditService>();
builder.Services.AddScoped<FinanceService>();
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<ProviderService>();
builder.Services.AddScoped<CustAuthService>();
builder.Services.AddScoped<IEmployeeTaxonomyService, EmployeeTaxonomyService>();

builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<IAuthService, AuthService>();

builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<ICurrentUser, CurrentUser>();

builder.Services
    .AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(
            new JsonStringEnumConverter()
            );
    });

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

builder.Services.AddSingleton<EmployeeAssignmentState>();
builder.Services.AddSingleton<EmployeeAssignmentService>();
builder.Services.AddSingleton<EmployeeAssignmentInitializer>();
builder.Services.AddHostedService<EmployeeAssignmentCleanupService>();

builder.Services.AddSingleton<ISearchTextNormalizer, SearchTextNormalizer>();
builder.Services.AddSingleton<ISearchNumberWordResolver, SearchNumberWordResolver>();
builder.Services.AddSingleton<ISearchVocabulary, InMemorySearchVocabulary>();
builder.Services.AddScoped<ISearchLexicalResolver, SearchLexicalResolver>();


builder.Services.Configure<JwtOptions>(
    builder.Configuration.GetSection("Jwt")
);

var jwtOptions = builder.Configuration
    .GetSection("Jwt")
    .Get<JwtOptions>()
    ?? throw new InvalidOperationException(
        "JWT configuration is missing."
    );

if (string.IsNullOrWhiteSpace(jwtOptions.Key))
{
    throw new InvalidOperationException(
        "JWT signing key is missing."
    );
}

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters =
            new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidIssuer = jwtOptions.Issuer,

                ValidateAudience = true,
                ValidAudience = jwtOptions.Audience,

                ValidateIssuerSigningKey = true,

                IssuerSigningKey =
                    new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(
                            jwtOptions.Key
                        )
                    ),

                ValidateLifetime = true,

                ClockSkew = TimeSpan.FromSeconds(30),

                RoleClaimType = ClaimTypes.Role,

                NameClaimType =
                    ClaimTypes.NameIdentifier
            };
    });

builder.Services.AddAuthorization();

var app = builder.Build();

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseCors("web");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

//using (var scope = app.Services.CreateScope())
//{
//    var db = scope.ServiceProvider.GetRequiredService<BrokerDbContext>();
//    var pH = scope.ServiceProvider.GetRequiredService<IPasswordHasher<User>>();
//    await DbSeeder.SeedAsync(db, pH);
//}

using (var scope = app.Services.CreateScope())
{
    var initializer =
        scope.ServiceProvider
            .GetRequiredService<
                EmployeeAssignmentInitializer>();

    await initializer.InitializeAsync();
}

app.MapHub<BrokerHub>("/hubs/broker");
app.Run();