var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

//Criar nossa lista
var jogos = new List<JogoDto>
{
    new JogoDto(1, "The Legend of Zelda: Tears of the Kingdom", "Aventura"),
    new JogoDto(2, "God of War Ragnarok", "Acao/Aventura")
};

app.MapGet("/", () => "API de Jogos esta no ar");

app.MapGet("/api/jogos", () =>
{
    return Results.Ok(jogos);
});

app.MapGet("/api/jogos/{id:int}", (int id) =>
{
    var jogo = jogos.Find(jogoDaLista => jogoDaLista.Id == id);
    if (jogo is null)
    {
        return Results.NotFound();
    }
    return Results.Ok(jogo);
});

app.MapPost("/api/jogos", (JogoEntradaDto dados) =>
{
    int proximoId = jogos.Count + 1;
    var novoJogo = new JogoDto(proximoId, dados.Nome, dados.Genero);
    jogos.Add(novoJogo);
    return Results.Created($"/api/jogos/{novoJogo.Id}", novoJogo);
});

app.MapPut("/api/jogos/{id:int}", (int id, JogoEntradaDto dados) =>
{
    int indice = jogos.FindIndex(jogoDaLista => jogoDaLista.Id == id);
    if(indice == -1)
    {
        return Results.NotFound();
    }
    var jogoAtualizado = new JogoDto(id, dados.Nome, dados.Genero);
    jogos[indice] = jogoAtualizado;
    return Results.Ok(jogoAtualizado);
});

app.MapDelete("/api/jogos/{id:int}", (int id) =>
{
    int indice = jogos.FindIndex(jogoDaLista => jogoDaLista.Id == id);
    if(indice == -1)
    {
        return Results.NotFound();
    }
    jogos.RemoveAt(indice);
    return Results.NoContent();
});

app.Run();

record JogoDto(int Id, string Nome, string Genero);
record JogoEntradaDto(string Nome, string Genero);
