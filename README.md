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
* **Cadastro:** Formulário para inserção de novas motos (`Marca` e `Modelo`).
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
  "modelo": "GSX-S150"
}
```

#### `PUT /api/motos/1`
```json
{
  "marca": "Suzuki",
  "modelo": "GSX-S150 Sport"
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

* **Link público do vídeo:** https://youtu.be/jhTvzDqJE9Q
