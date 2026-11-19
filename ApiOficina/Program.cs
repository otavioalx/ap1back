using Microsoft.EntityFrameworkCore;
using ApiOficina.Data;
using ApiOficina.Models;
using ApiOficina.Dtos;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<ApiDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

app.UseExceptionHandler(errorApp =>
{
    errorApp.Run(async context =>
    {
        context.Response.StatusCode = StatusCodes.Status500InternalServerError;
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsJsonAsync(new { mensagem = "Ocorreu um erro interno. Tente novamente mais tarde." });
    });
});

app.UseDefaultFiles();
app.UseStaticFiles();

app.MapGet("/", () => "API da Oficina esta no ar");

app.MapGet("/api/motos", async (ApiDbContext db) =>
{
    var motos = await db.Motos.ToListAsync();
    return Results.Ok(motos);
});

app.MapGet("/api/motos/{id:int}", async (int id, ApiDbContext db) =>
{
    var moto = await db.Motos.FindAsync(id);
    if (moto is null)
    {
        return Results.NotFound();
    }
    return Results.Ok(moto);
});

app.MapPost("/api/motos", async (MotoEntradaDto dados, ApiDbContext db) =>
{
    var moto = new MotoEntity
    {
        Marca = dados.Marca,
        Modelo = dados.Modelo,
        Ano = dados.Ano,
        Cor = dados.Cor
    };
    db.Motos.Add(moto);
    await db.SaveChangesAsync();
    return Results.Created($"/api/motos/{moto.Id}", moto);
});

app.MapPut("/api/motos/{id:int}", async (int id, MotoEntradaDto dados, ApiDbContext db) =>
{
    var moto = await db.Motos.FindAsync(id);
    if (moto is null)
    {
        return Results.NotFound();
    }
    
    moto.Marca = dados.Marca;
    moto.Modelo = dados.Modelo;
    moto.Ano = dados.Ano;
    moto.Cor = dados.Cor;
    await db.SaveChangesAsync();
    return Results.Ok(moto);
});

app.MapDelete("/api/motos/{id:int}", async (int id, ApiDbContext db) =>
{
    var moto = await db.Motos.FindAsync(id);
    if (moto is null) return Results.NotFound();
    db.Motos.Remove(moto);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

app.Run();
