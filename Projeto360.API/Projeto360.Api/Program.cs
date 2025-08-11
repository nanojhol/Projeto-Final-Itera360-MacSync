using System.Text;
using Projeto360Final.Servicos;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Projeto360Final.Repositorio.Contexto;
using Projeto360Final.Repositorio.Interfaces;
using Projeto360Final.Repositorio.Repositorios;
using Microsoft.AspNetCore.Authentication.JwtBearer;


var builder = WebApplication.CreateBuilder(args);

// Adiciona serviços ao container
builder.Services.AddControllers();

// Habilita CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", policy =>
    {
        policy
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

// Registro do DbContext
builder.Services.AddDbContext<Projeto360FinalContexto>();

// Registro de repositórios
builder.Services.AddScoped<IUsuarioRepositorio, UsuarioRepositorio>();
builder.Services.AddScoped<IEstabelecimentoRepositorio, EstabelecimentoRepositorio>();
builder.Services.AddScoped<IMaquinaRepositorio, MaquinaRepositorio>();
builder.Services.AddScoped<IChamadoSuporteRepositorio, ChamadoSuporteRepositorio>();
builder.Services.AddScoped<IRegistroUtilizacaoRepositorio, RegistroUtilizacaoRepositorio>();
builder.Services.AddScoped<ILogDeAcaoRepositorio, LogDeAcaoRepositorio>();
builder.Services.AddScoped<ISugestaoIARepositorio, SugestaoIARepositorio>();

builder.Services.AddScoped<SugestaoIAAplicacao>();

// builder.Services.AddHttpClient<GptService>();
// builder.Services.AddHttpClient<GeminiService>();


builder.Services.AddHttpClient(); // registra IHttpClientFactory

builder.Services.AddScoped<GeminiService>(sp =>
{
    var configuration = sp.GetRequiredService<IConfiguration>();
    var apiKey = configuration["Gemini:ApiKey"];
    var httpClientFactory = sp.GetRequiredService<IHttpClientFactory>();
    var httpClient = httpClientFactory.CreateClient();
    return new GeminiService(httpClient, apiKey);
});


builder.Services.AddScoped<UsuarioAutenticacaoService>();

builder.Services.AddSingleton<JwtService>(sp =>
{
    var config = builder.Configuration;
    var secret = config["Jwt:Secret"];
    var issuer = config["Jwt:Issuer"];
    var audience = config["Jwt:Audience"];
    var expiration = int.Parse(config["Jwt:ExpirationMinutes"] ?? "60");

    return new JwtService(secret, issuer, audience, expiration);
});



builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(builder.Configuration["Jwt:Secret"])),
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        ClockSkew = TimeSpan.Zero
    };
});


builder.Services.AddTransient<SmtpEmailService>(sp =>
{
    var config = builder.Configuration.GetSection("Email");
    return new SmtpEmailService(
        config["SmtpHost"],
        int.Parse(config["SmtpPort"]),
        config["User"],
        config["Pass"],
        config["From"]
    );
});


// Swagger e endpoints
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Pipeline HTTP
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// 👇 Habilita CORS aqui (antes do UseAuthorization)
app.UseCors("CorsPolicy");

app.UseAuthorization();
app.UseAuthentication(); // <-- antes do Authorization

app.MapControllers();
app.Run();
