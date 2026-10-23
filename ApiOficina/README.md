# API Oficina de Motos — Avaliação AP2

Repositório da aplicação de gerenciamento de motos da oficina, evoluído a partir da AP1. O projeto contempla persistência em banco de dados relacional **SQLite** via **Entity Framework Core** e interface visual integrada aos endpoints reais da API servida na mesma origem.

---

# SEÇÃO 1: DOCUMENTAÇÃO E INSTRUÇÕES DE ENTREGA

## 1. Tema e Escopo do Recurso
* **Tema:** Oficina de Motos
* **Recurso Principal:** Moto (`MotoEntity`)
* **Propósito:** Gerenciar a entrada, consulta, atualização e remoção de motos em manutenção na oficina com dados persistidos em disco.
* **Evoluções da AP2:**
  1. Substituição da antiga lista em memória por persistência real com **SQLite** e **EF Core**.
  2. Implementação das migrações de banco versionadas na pasta `Migrations/`.
  3. Suporte a arquivos estáticos na mesma origem via middleware ASP.NET Core (`wwwroot/`).
  4. Interface web completa (HTML, CSS e JavaScript puros) conectada à API REST sem dados fictícios.
  5. Atualização da Collection Bruno com testes de validação dos status HTTP (`200`, `201`, `204` e `404`).

---

## 2. Requisitos de Ambiente
* [.NET 10.0 SDK](https://dotnet.microsoft.com/) ou superior
* Ferramenta de linha de comando do Entity Framework Core (`dotnet-ef`):
  ```bash
  dotnet tool install --global dotnet-ef
  ```

---

## 3. Preparação do Banco de Dados (Migrations)
O banco de dados SQLite local não é versionado (ignorado pelo `.gitignore`), garantindo a integridade do repositório. Para gerar e atualizar o arquivo de banco de dados (`api-oficina-motos-aula09.db`) a partir das migrações existentes:

1. Abra o terminal na pasta `ApiOficina`:
   ```bash
   cd ApiOficina
   ```
2. Execute a atualização do banco:
   ```bash
   dotnet ef database update
   ```

---

## 4. Como Executar a Aplicação

Na pasta `ApiOficina`, execute o comando:
```bash
dotnet run --urls http://localhost:5050
```

A aplicação iniciará o servidor Kestrel escutando em `http://localhost:5050`.

---

## 5. Como Abrir a Interface Web
Com o servidor em execução, abra seu navegador e acesse:
```
http://localhost:5050/index.html
```
*(ou simplesmente `http://localhost:5050/`)*

### Recursos disponíveis na Interface:
* **Listagem:** Carrega automaticamente todas as motos salvas no banco de dados SQLite.
* **Cadastro:** Formulário para inserção de novas motos (`Marca`, `Modelo`, `Ano` e `Cor`).
* **Edição:** Permite selecionar uma moto existente, preencher os campos e salvar as alterações via `PUT`.
* **Exclusão:** Confirmação e remoção imediata via `DELETE`.
* **Tratamento de Estados:** Indicador visual de carregamento (*spinner*), mensagem para lista vazia e avisos de erro em caso de falha de conexão ou HTTP.
* **Segurança:** Manipulação do DOM realizada com `textContent` para mitigação de vulnerabilidades XSS.

---

## 6. Endpoints e Contrato da API

| Método | Rota | Descrição | Status Sucesso | Status Erro |
|---|---|---|---|---|
| `GET` | `/` | Healthcheck simples da API | `200 OK` | - |
| `GET` | `/api/motos` | Lista todas as motos cadastradas | `200 OK` | `500` |
| `GET` | `/api/motos/{id}` | Busca os dados de uma moto por ID | `200 OK` | `404 Not Found` |
| `POST` | `/api/motos` | Cadastra uma nova moto no SQLite | `201 Created` | `400 Bad Request` |
| `PUT` | `/api/motos/{id}` | Atualiza marca e modelo da moto | `200 OK` | `404 Not Found` |
| `DELETE` | `/api/motos/{id}` | Remove a moto informada do banco | `204 No Content` | `404 Not Found` |

### Exemplos de Payload JSON

#### `POST /api/motos`
```json
{
  "marca": "Suzuki",
  "modelo": "GSX-S150",
  "ano": 2024,
  "cor": "Azul"
}
```

#### `PUT /api/motos/1`
```json
{
  "marca": "Suzuki",
  "modelo": "GSX-S150 Sport",
  "ano": 2025,
  "cor": "Preta"
}
```

---

## 7. Collection de Testes (Bruno)
A collection de testes automatizados está localizada na pasta [`ApiOficina/bruno/`](file:///c:/Users/milen/Desktop/backand/ap1/ApiOficina/bruno):
* `00 - API no ar.bru`: Validação da rota raiz `GET /`.
* `01 - Listar.bru`: `GET /api/motos` (retorna array JSON com status 200).
* `02 - Buscar por id.bru`: `GET /api/motos/1` (retorna o objeto correspondente).
* `03 - Cadastrar.bru`: `POST /api/motos` (cria registro com status 201).
* `04 - Atualizar.bru`: `PUT /api/motos/3` (atualiza com status 200).
* `05 - Remover.bru`: `DELETE /api/motos/3` (remove com status 204).
* `06 - Confirmar remocao.bru`: `GET /api/motos/3` (confirma exclusão retornando status 404).

**Ambiente configurado:** `Local` com a variável `baseUrl = http://localhost:5050`.

---

## 8. Vídeo de Demonstração — AP2
> [!IMPORTANT]
> O link abaixo deve ser público e testado em janela anônima para garantir que o avaliador tenha acesso imediato sem solicitações de permissão.

* **Link público do vídeo:** `https://youtu.be/SEU_LINK_AQUI` *(Substitua por seu link público)*

---
---

# SEÇÃO 2: ROTEIRO COMPLETO PARA O VÍDEO DE DEMONSTRAÇÃO

Este roteiro foi estruturado para guiá-lo passo a passo durante a gravação da tela. Mantenha a gravação em tela cheia com áudio claro e pausado.

---

### Cena 1: Abertura e Apresentação do Projeto
* **O que mostrar na tela:**
  * Tela do VS Code aberta na raiz do repositório.
  * O arquivo `README.md` ou a árvore de pastas visível à esquerda: pasta `ApiOficina`, subpastas `Migrations`, `bruno` e `wwwroot`.
* **O que falar:**
  > *"Olá professor(a) e avaliadores. Este é o vídeo de demonstração da AP2 da disciplina de Backend. O meu projeto é a **API Oficina de Motos**. Nesta etapa, evoluímos a aplicação da AP1, substituindo a antiga lista em memória por persistência definitiva em banco de dados SQLite com Entity Framework Core. Também integramos a interface web em `wwwroot` diretamente com a nossa API, servida na mesma origem, sem dados fictícios."*

---

### Cena 2: Explicação da Arquitetura do Código
* **O que mostrar na tela:**
  * Abra o arquivo `Program.cs`.
  * Destaque com o mouse a classe `MotoEntity` (linhas finais) e a classe `ApiDbContext`.
  * Destaque a injeção do DbContext com SQLite: `builder.Services.AddDbContext<ApiDbContext>(...)`.
  * Destaque os middlewares de arquivos estáticos: `app.UseDefaultFiles()` e `app.UseStaticFiles()`.
  * Destaque rapidamente as rotas Minimal APIs: `GET /api/motos`, `GET /api/motos/{id}`, `POST /api/motos`, `PUT /api/motos/{id}` e `DELETE /api/motos/{id}` com seus respectivos status (`200`, `201`, `204` e `404`).
* **O que falar:**
  > *"Aqui no código em `Program.cs`, temos a entidade `MotoEntity` com suas propriedades e a classe `ApiDbContext`. Configuramos a conexão com o SQLite através da connection string no `appsettings.json`. Habilitamos o `UseDefaultFiles` e `UseStaticFiles` para que o Kestrel sirva a nossa interface web da pasta `wwwroot`. Todas as operações de CRUD foram implementadas com métodos assíncronos do EF Core, retornando status HTTP padronizados: 201 no cadastro, 200 nas consultas e alterações, 204 na remoção e 404 para registros não encontrados."*

---

### Cena 3: Preparação do Banco e Inicialização
* **O que mostrar na tela:**
  * Abra o terminal integrado no VS Code na pasta `ApiOficina`.
  * Digite e execute: `dotnet ef database update` (mostre a mensagem `Done.`).
  * Em seguida, execute: `dotnet run --urls http://localhost:5050`.
  * Mostre a mensagem de que a aplicação está rodando em `http://localhost:5050`.
* **O que falar:**
  > *"Agora no terminal, demonstro a aplicação das migrations versionadas utilizando o comando `dotnet ef database update`, que cria o banco SQLite e a tabela `Motos` do zero. Em seguida, inicio o servidor com `dotnet run --urls http://localhost:5050`. A API já está no ar."*

---

### Cena 4: Validação do Contrato da API no Bruno
* **O que mostrar na tela:**
  * Abra o aplicativo **Bruno** com a collection `ApiOficina/bruno` carregada e o ambiente `Local` selecionado.
  * Execute as requisições na ordem:
    1. **00 - API no ar:** Envie a requisição `GET /` e aponte para o status `200 OK` e o texto *"API da Oficina esta no ar"*.
    2. **03 - Cadastrar:** Envie `POST /api/motos` com a Suzuki GSX-S150. Aponte para o status `201 Created` e o ID gerado.
    3. **01 - Listar:** Envie `GET /api/motos`. Aponte para o status `200 OK` e o array com o registro cadastrado.
    4. **02 - Buscar por id:** Envie `GET /api/motos/{id}` com o ID retornado. Aponte para o status `200 OK` e os dados do objeto.
    5. **04 - Atualizar:** Envie `PUT /api/motos/{id}` alterando o modelo para "GSX-S150 Sport". Aponte para o status `200 OK` com o campo alterado.
    6. **05 - Remover:** Envie `DELETE /api/motos/{id}`. Aponte para o status `204 No Content`.
    7. **06 - Confirmar remocao:** Envie `GET /api/motos/{id}` para o mesmo ID excluído. Destaque com o mouse o status `404 Not Found`.
* **O que falar:**
  > *"Agora no Bruno, vamos validar todo o contrato REST antes de ir para a interface. O endpoint raiz retorna 200 OK. Fazemos um POST para cadastrar uma nova moto: recebemos 201 Created com o ID gerado pelo banco. Ao listar com GET, recebemos 200 OK e o array com a moto. Ao buscar pelo ID exato, recebemos 200 OK. No PUT, atualizamos o modelo e recebemos 200 OK com o registro atualizado. Em seguida, executamos o DELETE e recebemos 204 No Content. Por fim, consultamos novamente o ID removido e confirmamos a resposta 404 Not Found, comprovando que o ciclo de status HTTP está estritamente correto."*

---

### Cena 5: Demonstração de Ponta a Ponta no Navegador (Frontend Real)
* **O que mostrar na tela:**
  * Abra o navegador Google Chrome (ou outro navegador) e acesse: `http://localhost:5050/index.html`.
  * Mostre a interface carregando a listagem real do banco.
  * No formulário **Cadastrar Nova Moto**:
    * Digite `Marca`: "Yamaha" e `Modelo`: "MT-07".
    * Clique no botão **Cadastrar Moto**.
    * Mostre o toast de sucesso e a nova linha aparecendo na tabela instantaneamente com o ID gerado.
  * Alterne para o **Bruno**, rode o `01 - Listar` e mostre que a "Yamaha MT-07" criada pela interface web está presente no banco de dados.
  * Volte ao navegador:
    * Na linha da Yamaha MT-07, clique no botão **Editar**.
    * Mostre que o formulário foi preenchido com os dados e o botão mudou para "Salvar Alterações".
    * Altere o modelo para: "MT-07 ABS 2026" e clique em **Salvar Alterações**.
    * Mostre a tabela atualizada com o novo valor.
  * Cadastre uma segunda moto de teste (ex: "Honda CB 500F").
  * Em seguida, clique em **Excluir** na moto de teste, confirme o pop-up do navegador e veja a linha sumir da tabela com o toast de confirmação.
* **O que falar:**
  > *"Agora no navegador, acessamos `http://localhost:5050/index.html`. A interface é servida pela mesma origem da API e consome exclusivamente os endpoints reais, sem dados simulados. Vou cadastrar uma nova moto: Marca 'Yamaha', Modelo 'MT-07'. Ao clicar em cadastrar, a requisição POST é enviada, a tela exibe o toast de sucesso e a tabela é atualizada. Para comprovar a integração real, volto ao Bruno e executo o GET: veja que o registro está lá gravado no banco de dados. De volta ao navegador, clico em 'Editar', altero para 'MT-07 ABS 2026' e salvo. A requisição PUT atualiza o dado em tempo real. Também realizo a exclusão de um registro com confirmação, recebendo a resposta 204 e atualizando a lista."*

---

### Cena 6: Comprovação da Persistência de Dados
* **O que mostrar na tela:**
  * Certifique-se de que há pelo menos uma moto visível na tabela do navegador (ex: "Yamaha MT-07 ABS 2026").
  * Vá para a janela do terminal onde a API está rodando.
  * Pressione `Ctrl + C` para interromper o processo (mostre que o servidor parou).
  * No navegador, mostre que se tentar recarregar nesse momento, a API está fora do ar.
  * Volte ao terminal e inicie novamente a aplicação: `dotnet run --urls http://localhost:5050`.
  * Volte ao navegador e aperte `F5` (Recarregar a página).
  * Mostre a moto persistida aparecendo normalmente na tabela.
* **O que falar:**
  > *"Para comprovar que os dados estão efetivamente persistidos no SQLite com Entity Framework Core e não em memória volátil, vou derrubar o servidor agora no terminal com Ctrl+C. O servidor está desligado. Agora, inicio novamente a aplicação com `dotnet run`. Ao recarregar a página no navegador com F5, vemos que a nossa moto continua exatamente aqui com seus dados preservados. Isso comprova a persistência definitiva exigida na AP2."*

---

### Cena 7: Encerramento
* **O que mostrar na tela:**
  * Retorne ao VS Code com o `README.md` visível, apontando para a seção do link do vídeo.
* **O que falar:**
  > *"Com isso, cobrimos 100% dos requisitos da AP2: persistência com SQLite e EF Core, CRUD completo com respostas HTTP corretas, testes no Bruno, frontend funcional integrado sem dados fictícios e persistência comprovada após o reinício da aplicação. O link deste vídeo está disponível publicamente no README do repositório. Muito obrigado!"*
