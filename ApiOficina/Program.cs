var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

//Criar nossa lista
var motos = new List<MotoDto>
{
    new MotoDto(1, "Honda", "CG 160"),
    new MotoDto(2, "Yamaha", "Fazer 250")
};

app.MapGet("/", () => "API da Oficina esta no ar");

app.MapGet("/api/motos", () =>
{
    return Results.Ok(motos);
});

app.MapGet("/api/motos/{id:int}", (int id) =>
{
    var moto = motos.Find(motoDaLista => motoDaLista.Id == id);
    if (moto is null)
    {
        return Results.NotFound();
    }
    return Results.Ok(moto);
});

app.MapPost("/api/motos", (MotoEntradaDto dados) =>
{
    int proximoId = motos.Count + 1;
    var novaMoto = new MotoDto(proximoId, dados.Marca, dados.Modelo);
    motos.Add(novaMoto);
    return Results.Created($"/api/motos/{novaMoto.Id}", novaMoto);
});

app.MapPut("/api/motos/{id:int}", (int id, MotoEntradaDto dados) =>
{
    int indice = motos.FindIndex(motoDaLista => motoDaLista.Id == id);
    if (indice == -1)
    {
        return Results.NotFound();
    }
    var motoAtualizada = new MotoDto(id, dados.Marca, dados.Modelo);
    motos[indice] = motoAtualizada;
    return Results.Ok(motoAtualizada);
});

app.MapDelete("/api/motos/{id:int}", (int id) =>
{
    int indice = motos.FindIndex(motoDaLista => motoDaLista.Id == id);
    if (indice == -1)
    {
        return Results.NotFound();
    }
    motos.RemoveAt(indice);
    return Results.NoContent();
});

app.Run();

record MotoDto(int Id, string Marca, string Modelo);
record MotoEntradaDto(string Marca, string Modelo);
