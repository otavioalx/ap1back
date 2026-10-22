using Microsoft.EntityFrameworkCore;
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<ApiDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

app.MapGet("/",  () => "API da Oficina esta no ar");

app.MapGet("/api/motos", async(ApiDbContext db) =>
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



app.MapPost("/api/motos", async (MotoEntity dados, ApiDbContext db) =>
{
    db.Motos.Add(dados);
    await db.SaveChangesAsync();
    return Results.Created($"/api/motos/{dados.Id}", dados);
});



app.MapPut("/api/motos/{id:int}", async (int id, MotoEntity dados, ApiDbContext db) =>
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



class MotoEntity
{
    public int Id { get; set; }
    public string Marca { get; set; } = string.Empty;
    public string Modelo { get; set; } = string.Empty;
    public int Ano { get; set; }
    public string Cor { get; set; } = string.Empty;
}



class ApiDbContext : DbContext
{
    public ApiDbContext(DbContextOptions<ApiDbContext> options) : base(options)
    {
    }
    public DbSet<MotoEntity> Motos => Set<MotoEntity>();
}
