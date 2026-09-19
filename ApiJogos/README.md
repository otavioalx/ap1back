# API Jogos

API REST minimalista para gerenciamento de jogos, desenvolvida com ASP.NET Core e .NET 10.

## Requisitos

- .NET SDK 10.0 ou superior

## Como executar

Na raiz do projeto, execute:

```bash
dotnet run --urls http://localhost:5050
```

A API estará disponível em: `http://localhost:5050`

Para verificar se a API está funcionando:

```http
GET http://localhost:5050/
```

Resposta esperada:

```text
API de Jogos esta no ar
```

## Endpoints

| Método | Rota | Descrição |
| --- | --- | --- |
| GET | `/` | Verifica se a API está no ar |
| GET | `/api/jogos` | Lista todos os jogos |
| GET | `/api/jogos/{id}` | Busca um jogo pelo ID |
| POST | `/api/jogos` | Cadastra um novo jogo |
| PUT | `/api/jogos/{id}` | Atualiza um jogo existente |
| DELETE | `/api/jogos/{id}` | Remove um jogo pelo ID |

## Exemplos de JSON

### POST — Cadastrar

```json
{
  "nome": "Elden Ring",
  "genero": "RPG"
}
```

### PUT — Atualizar

```json
{
  "nome": "Elden Ring - Shadow of the Erdtree",
  "genero": "RPG de Acao"
}
```

## Dados em memória

Os dados são armazenados em uma `List<JogoDto>` na memória. Ao reiniciar a aplicação, os dados voltam ao estado inicial com dois jogos pré-cadastrados.

## Collection do Bruno

A Collection de testes está na pasta `bruno/` dentro deste repositório.

| # | Nome | Método | Resultado esperado |
| --- | --- | --- | --- |
| 00 | API no ar | GET | 200 OK |
| 01 | Listar | GET | 200 OK |
| 02 | Buscar por id | GET | 200 OK |
| 03 | Cadastrar | POST | 201 Created |
| 04 | Atualizar | PUT | 200 OK |
| 05 | Remover | DELETE | 204 No Content |
| 06 | Confirmar remoção | GET | 404 Not Found |

## Vídeo de demonstração

🔗 [Link do vídeo](#)











----------------------------------------------------------------------------------------------------------------------------------------------


















Pronto! O projeto foi finalizado com sucesso e 100% alinhado com a estrutura simplificada do repositório de referência (ApiBibliotecaV2).

Aqui estão as atualizações feitas:

Program.cs e DTOs simplificados:

Apenas os campos Nome e Genero (no modelo do professor era só Titulo).
Nomenclatura atualizada para seguir a aula (JogoDto e JogoEntradaDto).
Rota raiz agora retorna uma string simples (API de Jogos esta no ar).
Respostas do NotFound() ajustadas para não conter mensagem extra.
Variáveis em português para combinar com o padrão utilizado no curso.
Testes do Bruno atualizados:

Os arquivos de POST (03 - Cadastrar) e PUT (04 - Atualizar) foram atualizados para não enviarem campos removidos (plataforma, anoLancamento, etc.), enviando estritamente os campos aceitos.
README.md refinado:

Encurtei as explicações, tornando o arquivo super direto, focado nos links, comandos pra rodar e a tabela simples que vimos no material de base.
Build conferida:

Foi executado o dotnet build e tudo compilou lindamente sem erros ou warnings!
O arquivo detalhando todas as alterações e a estrutura final do projeto está salvo no 
Walkthrough
.

Como combinado na documentação, você agora só precisa:

Subir para um repositório seu no Github.
Gravar e subir o vídeo pro Youtube e referenciar no seu README.md.
Mandar o link do seu Repo via Canvas!
Posso ajudar com mais algum detalhe?