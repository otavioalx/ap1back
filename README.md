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

* **Link público do vídeo:** `https://youtu.be/SEU_LINK_AQUI` *(Substitua pelo seu link público após a gravação)*

---
---

# SEÇÃO 2: ROTEIRO COMPLETO PARA O VÍDEO DE DEMONSTRAÇÃO (AS)

Grave a tela inteira e narre suas ações. Siga cada uma das etapas abaixo:

---

### Cena 1: Apresentação do Tema e Repositório
* **O que mostrar na tela:**
  * VS Code aberto na raiz do repositório.
  * O arquivo `README.md` visível e a árvore de arquivos aberta no explorador à esquerda.
* **O que falar:**
  > *"Olá professor(a) e avaliadores. Este é o vídeo de demonstração da Avaliação Semestral (AS) da disciplina de Backend. O meu projeto é a **API Oficina de Motos**, continuado a partir da AP1 e AP2 no mesmo repositório. O objetivo principal desta entrega foi consolidar a organização do projeto em pastas por responsabilidades (`Models`, `Dtos` e `Data`), mantendo a persistência com SQLite e Entity Framework Core, o tratamento global de exceções e a demonstração completa dos testes no Bruno."*

---

### Cena 2: Explicação da Estrutura e dos Tipos Separados
* **O que mostrar na tela:**
  * Abra o explorador e destaque as três pastas: `Models/`, `Dtos/` e `Data/`.
  * Abra `Models/MotoEntity.cs`: mostre a classe `MotoEntity` com suas propriedades (`Id`, `Marca`, `Modelo`, `Ano`, `Cor`).
  * Abra `Dtos/MotoEntradaDto.cs`: mostre o `record MotoEntradaDto` com os campos de entrada.
  * Abra `Data/ApiDbContext.cs`: mostre a classe `ApiDbContext` herdando de `DbContext` e declarando o `DbSet<MotoEntity> Motos`.
  * Abra `Program.cs`: mostre os imports no topo:
    ```csharp
    using ApiOficina.Data;
    using ApiOficina.Models;
    using ApiOficina.Dtos;
    ```
  * Mostre que o final do `Program.cs` não acumula mais as classes que foram separadas.
* **O que falar:**
  > *"Conforme ensinado na Aula 14, separamos os tipos por responsabilidades:
  > - Na pasta `Models`, temos o `MotoEntity.cs`, que é a nossa entidade de domínio mapeada para a tabela no banco SQLite.
  > - Na pasta `Dtos`, temos o `MotoEntradaDto.cs`, um record utilizado como objeto de transferência para receber dados nas requisições de cadastro e atualização.
  > - Na pasta `Data`, temos o `ApiDbContext.cs`, que configura a ponte com o SQLite e expõe o DbSet de Motos.
  > Aqui no `Program.cs`, importamos os namespaces correspondentes (`ApiOficina.Data`, `ApiOficina.Models`, `ApiOficina.Dtos`), mantendo o arquivo principal limpo, sem acumular definições de tipos."*

---

### Cena 3: Program.cs, Middleware e Conexão com o Banco
* **O que mostrar na tela:**
  * No `Program.cs`, aponte com o mouse:
    1. Registro do contexto: `builder.Services.AddDbContext<ApiDbContext>(...)`.
    2. Connection string apontando para o SQLite configurado em `appsettings.json`.
    3. Middleware de exceção: `app.UseExceptionHandler(...)` que trata erros globais e retorna HTTP 500 em formato JSON.
    4. Middlewares de arquivos estáticos: `app.UseDefaultFiles()` e `app.UseStaticFiles()`.
    5. As rotas Minimal APIs usando `MotoEntradaDto` nos endpoints POST e PUT.
* **O que falar:**
  > *"O `Program.cs` é responsável pela inicialização da aplicação: registramos o `ApiDbContext` com SQLite, configuramos o middleware `UseExceptionHandler` para tratar erros internos sem expor falhas brutas ao cliente, e mantemos os middlewares estáticos da interface. Nas rotas POST e PUT, a API recebe o `MotoEntradaDto`, mapeia para a entidade `MotoEntity` e persiste no banco via `SaveChangesAsync`."*

---

### Cena 4: Compilação e Inicialização da API
* **O que mostrar na tela:**
  * Abra o terminal integrado no VS Code na pasta `ApiOficina`.
  * Execute: `dotnet build` (mostre a compilação com êxito: 0 erros e 0 avisos).
  * Execute: `dotnet ef database update` (mostre que o banco já está atualizado via migrations).
  * Execute: `dotnet run --urls http://localhost:5050`.
  * Aponte para a mensagem: `Now listening on: http://localhost:5050`.
* **O que falar:**
  > *"Vou compilar o projeto com `dotnet build`. Como podem ver, compilação concluída com zero erros e zero avisos. Nosso banco é gerenciado via migrations, e agora inicializo o servidor com `dotnet run --urls http://localhost:5050`. A aplicação está no ar."*

---

### Cena 5: Demonstração dos Testes no Bruno
* **O que mostrar na tela:**
  * Abra o aplicativo **Bruno**, selecione a collection `bruno` e garanta que o ambiente **`Local`** está ativo no canto superior direito.
  * Execute cada requisição deixando visíveis o método, a URL, o corpo e o status de retorno:
    1. **`00 - API no ar`:** Envie `GET /`. Status `200 OK`, resposta `"API da Oficina esta no ar"`.
    2. **`01 - Listar`:** Envie `GET /api/motos`. Status `200 OK`, exibe a listagem atual em JSON.
    3. **`03 - Cadastrar`:** Envie `POST /api/motos` com o corpo da Suzuki GSX-S150. Status `201 Created`. **Aponte para o ID gerado na resposta** (ex: ID 5).
    4. **`02 - Buscar por id`:** Ajuste a URL para o ID gerado e envie `GET /api/motos/{id}`. Status `200 OK` com os mesmos dados criados.
    5. **`04 - Atualizar`:** Ajuste o ID e envie `PUT /api/motos/{id}` alterando o modelo para "GSX-S150 Sport". Status `200 OK`. Em seguida, envie novamente a busca por ID para confirmar o dado atualizado.
    6. **`05 - Remover`:** Ajuste o ID e envie `DELETE /api/motos/{id}`. Status `204 No Content` (sem corpo).
    7. **`06 - Confirmar remocao`:** Envie `GET /api/motos/{id}` para o mesmo ID excluído. Destaque o status `404 Not Found`.
* **O que falar:**
  > *"Agora no Bruno, vamos executar o roteiro obrigatório de testes:
  > - Primeiro, validamos o healthcheck: 200 OK.
  > - Em seguida, listamos as motos cadastradas: 200 OK.
  > - No POST, cadastramos uma nova moto: recebemos 201 Created e o identificador gerado pelo banco.
  > - Consultamos exatamente por esse identificador com GET: 200 OK com os dados criados.
  > - No PUT, atualizamos o modelo para a versão Sport: 200 OK e dados confirmados no banco.
  > - No DELETE, removemos o registro: 204 No Content.
  > - E ao buscar novamente pelo identificador removido, recebemos 404 Not Found, comprovando o ciclo correto dos códigos HTTP."*

---

### Cena 6: Demonstração da Persistência (POST + Reinício + GET)
* **O que mostrar na tela:**
  * No Bruno, abra a requisição `07 - Cadastrar segundo registro (persistencia)`.
  * Envie o POST com a Yamaha MT-07. Aponte para o status `201 Created` e o novo ID gerado.
  * Vá para o terminal onde o `dotnet run` está executando e aperte `Ctrl + C` para encerrar o processo.
  * No Bruno, tente enviar uma requisição rápida para mostrar que a API está fora do ar (`ECONNREFUSED`).
  * No terminal, suba a aplicação novamente: `dotnet run --urls http://localhost:5050`.
  * Volte ao Bruno na requisição `08 - Consultar segundo registro apos reinicio` com o ID da Yamaha cadastrada.
  * Envie o GET: mostre o status `200 OK` e os dados da moto retornados perfeitamente.
* **O que falar:**
  > *"Para comprovar a persistência definitiva dos dados, cadastro agora um segundo registro no Bruno: Yamaha MT-07. Recebemos 201 Created. Agora, vou ao terminal e encerro completamente o processo do servidor com Ctrl+C. O backend está desligado. Inicio o servidor novamente com `dotnet run`. De volta ao Bruno, consulto o identificador da moto que cadastramos antes do reinício: recebemos 200 OK e todos os dados preservados. Isso comprova que a gravação ocorre fisicamente no SQLite pelo EF Core, e não em memória volátil."*

---

### Cena 7: Visualização da Interface Web e Encerramento
* **O que mostrar na tela:**
  * Abra o navegador em `http://localhost:5050/index.html`. Mostre a moto cadastrada aparecendo na tabela.
  * Retorne ao VS Code no arquivo `README.md`, mostrando a Seção 1 com as instruções, a árvore de pastas e o local do link do vídeo na Seção 2.
* **O que falar:**
  > *"A interface web servida na mesma origem continua funcional em `wwwroot` e reflete os mesmos dados gravados no banco. Com isso, cobrimos todos os requisitos da AS: tipos organizados por responsabilidade em `Models`, `Dtos` e `Data`, `Program.cs` enxuto, persistência comprovada com SQLite, suíte do Bruno completa e documentação atualizada no README. O link deste vídeo está disponível publicamente no README. Muito obrigado!"*
