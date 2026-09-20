# API Oficina de Motos

API REST para gerenciamento de motos que entram para manutenção em uma oficina, desenvolvida com ASP.NET Core e .NET 10.

## Tema e Objetivo

**Tema:** Oficina de Motos  
**Recurso principal:** Moto (`MotoDto`) — representa cada moto cadastrada para atendimento na oficina.  
**Objetivo:** Permitir o cadastro, consulta, atualização e remoção de motos via API REST, com dados mantidos em memória durante a execução da aplicação.

## Requisitos

- .NET SDK 10.0 ou superior

## Como executar

Na raiz do projeto (pasta `ApiOficina`), execute:

```bash
dotnet run --urls http://localhost:5050
```

A API estará disponível em: `http://localhost:5050`

Para verificar se a API está no ar:

```http
GET http://localhost:5050/
```

Resposta esperada:

```
API da Oficina esta no ar
```

Para verificar se o projeto compila sem erros:

```bash
dotnet build
```

## URL local utilizada nos testes

```
http://localhost:5050
```

## Endpoints

| Método | Rota | Descrição |
| --- | --- | --- |
| GET | `/` | Verifica se a API está no ar |
| GET | `/api/motos` | Lista todas as motos cadastradas |
| GET | `/api/motos/{id}` | Busca uma moto pelo ID |
| POST | `/api/motos` | Cadastra uma nova moto |
| PUT | `/api/motos/{id}` | Atualiza os dados de uma moto existente |
| DELETE | `/api/motos/{id}` | Remove uma moto pelo ID |

## Exemplos de JSON

### POST — Cadastrar nova moto

```json
{
  "marca": "Suzuki",
  "modelo": "GSX-S150"
}
```

### PUT — Atualizar moto existente

```json
{
  "marca": "Suzuki",
  "modelo": "GSX-S150 Sport"
}
```

## Dados em memória

> ⚠️ Os dados são armazenados em uma `List<MotoDto>` na memória da aplicação. Ao reiniciar, os dados voltam ao estado inicial com duas motos pré-cadastradas (Honda CG 160 e Yamaha Fazer 250). Não há banco de dados.

## Collection do Bruno

A Collection de testes está na pasta `bruno/` dentro deste repositório.

| # | Nome | Método | Rota | Resultado esperado |
| --- | --- | --- | --- | --- |
| 00 | API no ar | GET | `/` | 200 OK + mensagem |
| 01 | Listar | GET | `/api/motos` | 200 OK + lista em JSON |
| 02 | Buscar por id | GET | `/api/motos/1` | 200 OK + um registro |
| 03 | Cadastrar | POST | `/api/motos` | 201 Created + novo registro |
| 04 | Atualizar | PUT | `/api/motos/3` | 200 OK + dados atualizados |
| 05 | Remover | DELETE | `/api/motos/3` | 204 No Content |
| 06 | Confirmar remoção | GET | `/api/motos/3` | 404 Not Found |

**Environment:** `Local` → `baseUrl` = `http://localhost:5050`


Link do vídeo: