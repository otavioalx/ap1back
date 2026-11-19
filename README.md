# API Oficina de Motos — Avaliação Semestral (AS)

Repositório da aplicação de gerenciamento de motos da oficina, consolidado a partir das avaliações AP1 e AP2 e organizado conforme as práticas da Avaliação Semestral (AS). O projeto contempla arquitetura organizada por responsabilidades (`Models`, `Dtos`, `Data`), persistência em banco de dados relacional **SQLite** via **Entity Framework Core**, tratamento global de exceções, suíte de testes no **Bruno** e interface web servida na mesma origem.

---

# SEÇÃO 1: DOCUMENTAÇÃO E INSTRUÇÕES DE ENTREGA

## 1. Tema e Objetivo
* **Tema:** Oficina de Motos
* **Recurso Principal:** Moto (`MotoEntity` / `MotoEntradaDto`)
* **Objetivo:** Fornecer uma API RESTful para cadastro, listagem, consulta por ID, atualização e remoção de motos em manutenção na oficina, com dados persistidos em disco pelo Entity Framework Core em banco SQLite.
* **Consolidação na AS:**
  1. **Separação por Responsabilidades:** Entidade em `Models/`, DTO de entrada em `Dtos/` e Contexto do banco em `Data/`.
  2. **`Program.cs` Enxuto:** Mantém apenas a inicialização do builder, injeção do DbContext, middlewares e mapeamento das rotas, sem acumular definições de tipos.
  3. **Persistência com SQLite e EF Core:** Operações de CRUD gravadas fisicamente no arquivo de banco; dados persistem após reiniciar a aplicação.
  4. **Tratamento de Exceções:** Middleware global `UseExceptionHandler` preservado, retornando JSON amigável e código HTTP 500 sem rotas de falha deliberada.
  5. **Contrato HTTP e Testes no Bruno:** Status coerentes (`201` no POST, `200` no GET/PUT, `204` no DELETE, `404` para recursos inexistentes) e collection pronta na pasta `bruno/`.
  6. **Frontend Integrado (`wwwroot/`):** Interface web em HTML/CSS/JS puros consumindo os endpoints reais pela mesma origem.

---

## 2. Requisitos de Ambiente
* [.NET 10.0 SDK](https://dotnet.microsoft.com/) ou superior
* Ferramenta de linha de comando do Entity Framework Core (`dotnet-ef`):
  ```bash
  dotnet tool install --global dotnet-ef
  ```

---

## 3. Preparação do Banco de Dados
O projeto utiliza a estratégia de **Migrations** do Entity Framework Core (e não criação automática em tempo de execução), garantindo histórico versionado e rastreabilidade da evolução do esquema.

> ⚠️ O arquivo local do banco (`.db`) **não é versionado** no Git (ignorado via `.gitignore`). O avaliador pode preparar o banco a qualquer momento a partir das migrações existentes.

Para criar o banco e aplicar todas as migrações:
1. Abra o terminal na pasta `ApiOficina`:
   ```bash
   cd ApiOficina
   ```
2. Execute o comando de atualização do banco:
   ```bash
   dotnet ef database update
   ```
Isso criará localmente o arquivo SQLite `api-oficina-motos-aula09.db` com a tabela `Motos` contendo as colunas `Id`, `Marca`, `Modelo`, `Ano` e `Cor`.

---

## 4. Como Executar a Aplicação

Na pasta `ApiOficina`, execute:
```bash
dotnet run --urls http://localhost:5050
```

> **Dica:** Para inicialização imediata após o build, utilize:
> ```bash
> dotnet run --no-build --urls http://localhost:5050
> ```

A API iniciará escutando em `http://localhost:5050`.

---

## 5. Como Abrir a Interface Web
Com a API em execução, abra o navegador em:
```
http://localhost:5050/index.html
```
*(ou `http://localhost:5050/`)*

A interface permite listar, cadastrar, editar e excluir registros com dados persistidos no banco.

---

## 6. Árvore de Pastas e Responsabilidades

```text
ApiOficina/
├── Data/
│   └── ApiDbContext.cs              # Contexto EF Core: gerencia a conexão SQLite e mapeia DbSet<MotoEntity>
├── Dtos/
│   └── MotoEntradaDto.cs            # Data Transfer Object (record) para entrada de dados em POST e PUT
├── Models/
│   └── MotoEntity.cs                # Entidade de domínio representando a tabela Motos no banco de dados
├── Migrations/                      # Histórico versionado de migrações do banco de dados
│   ├── 20261017215427_BancoInicial.cs
│   ├── 20261020223846_AdicionarAnoECor.cs
│   └── ApiDbContextModelSnapshot.cs
├── Properties/
│   └── launchSettings.json          # Perfis de inicialização do Kestrel e portas locais
├── bruno/                           # Collection de requisições prontas no Bruno
│   ├── environments/
│   │   └── Local.bru                # Ambiente local com baseUrl configurada
│   ├── 00 - API no ar.bru
│   ├── 01 - Listar.bru
│   ├── 02 - Buscar por id.bru
│   ├── 03 - Cadastrar.bru
│   ├── 04 - Atualizar.bru
│   ├── 05 - Remover.bru
│   ├── 06 - Confirmar remocao.bru
│   ├── 07 - Cadastrar segundo registro (persistencia).bru
│   └── 08 - Consultar segundo registro apos reinicio.bru
├── wwwroot/                         # Frontend estático servido pela mesma origem
│   ├── index.html                   # Estrutura semântica da página
│   ├── style.css                    # Estilização responsiva pura
│   └── app.js                       # Lógica de integração assíncrona com fetch
├── appsettings.json                 # ConnectionStrings e configurações da aplicação
├── appsettings.Development.json     # Configurações do ambiente de desenvolvimento
├── ApiOficina.csproj                # Arquivo do projeto, SDK e pacotes NuGet (EF Core, SQLite)
└── Program.cs                       # Ponto de entrada: registro do DbContext, middlewares e rotas
```

---

## 7. Endpoints e Contrato da API

| Método | Rota | Descrição | Status Sucesso | Status Erro |
|---|---|---|---|---|
| `GET` | `/` | Healthcheck simples da API | `200 OK` | - |
| `GET` | `/api/motos` | Lista todas as motos cadastradas | `200 OK` | `500` |
| `GET` | `/api/motos/{id}` | Busca uma moto por ID | `200 OK` | `404 Not Found` |
| `POST` | `/api/motos` | Cadastra nova moto (recebe `MotoEntradaDto`) | `201 Created` | `400` / `500` |
| `PUT` | `/api/motos/{id}` | Atualiza moto existente (recebe `MotoEntradaDto`) | `200 OK` | `404 Not Found` |
| `DELETE` | `/api/motos/{id}` | Remove uma moto pelo ID | `204 No Content` | `404 Not Found` |

### Exemplos de JSON

#### `POST /api/motos`
```json
{
  "marca": "Suzuki",
  "modelo": "GSX-S150",
  "ano": 2024,
  "cor": "Azul"
}
```

#### `PUT /api/motos/{id}`
```json
{
  "marca": "Suzuki",
  "modelo": "GSX-S150 Sport",
  "ano": 2025,
  "cor": "Preta"
}
```

---

## 8. Localização da Collection do Bruno

A collection está salva no repositório na pasta [`ApiOficina/bruno/`](file:///c:/Users/milen/Desktop/backand/ap1/ApiOficina/bruno) (e também espelhada na raiz em `bruno/`).
* **Environment:** `Local` com variável `baseUrl = http://localhost:5050`.
* **Requisições:**
  1. `00 - API no ar` (`GET /`)
  2. `01 - Listar` (`GET /api/motos`)
  3. `02 - Buscar por id` (`GET /api/motos/{id}`)
  4. `03 - Cadastrar` (`POST /api/motos`)
  5. `04 - Atualizar` (`PUT /api/motos/{id}`)
  6. `05 - Remover` (`DELETE /api/motos/{id}`)
  7. `06 - Confirmar remocao` (`GET /api/motos/{id}` -> valida `404`)
  8. `07 - Cadastrar segundo registro (persistencia)` (`POST /api/motos`)
  9. `08 - Consultar segundo registro apos reinicio` (`GET /api/motos/{id}`)

---

## 9. Vídeo de Demonstração — AS

> [!IMPORTANT]
> O vídeo foi gravado especificamente para a Avaliação Semestral (AS), explicando a estrutura do código e demonstrando os testes reais no Bruno. O link é público e abre sem solicitação de login ou permissão.

* **Link público do vídeo:** `https://youtu.be/kr8UIgyCtWw`

