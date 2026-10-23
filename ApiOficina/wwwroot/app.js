/**
 * Oficina de Motos — Integração com API REST
 * Operações: Listar (GET), Cadastrar (POST), Atualizar (PUT) e Excluir (DELETE)
 * Campos: id, marca, modelo, ano, cor
 */

(function () {
    "use strict";

    // Endpoint base da API
    var API_URL = "/api/motos";

    // Elementos do DOM
    var form = document.getElementById("motoForm");
    var formTitle = document.getElementById("formTitle");
    var btnSubmit = document.getElementById("btnSubmit");
    var btnCancel = document.getElementById("btnCancel");
    var btnRefresh = document.getElementById("btnRefresh");

    var inputMarca = document.getElementById("marca");
    var inputModelo = document.getElementById("modelo");
    var inputAno = document.getElementById("ano");
    var inputCor = document.getElementById("cor");

    var tableWrapper = document.getElementById("tableWrapper");
    var tbody = document.getElementById("motosBody");
    var loadingIndicator = document.getElementById("loadingIndicator");
    var emptyMessage = document.getElementById("emptyMessage");

    var errorBanner = document.getElementById("errorBanner");
    var errorTitle = document.getElementById("errorTitle");
    var errorMessage = document.getElementById("errorMessage");
    var btnCloseError = document.getElementById("btnCloseError");

    var statTotal = document.getElementById("totalMotos");
    var statMarcas = document.getElementById("totalMarcas");
    var toast = document.getElementById("toast");

    // Estado da interface
    var editingId = null;
    var isSubmitting = false;

    // Timer do Toast
    var toastTimer = null;

    /**
     * Exibe notificação temporária (Toast)
     */
    function showToast(message, isError) {
        clearTimeout(toastTimer);
        toast.textContent = message;
        toast.className = "toast show" + (isError ? " toast-error" : " toast-success");

        toastTimer = setTimeout(function () {
            toast.className = "toast";
        }, 3000);
    }

    /**
     * Exibe banner de erro de requisição ou rede
     */
    function showError(title, message) {
        errorTitle.textContent = title;
        errorMessage.textContent = " " + message;
        errorBanner.style.display = "flex";
    }

    /**
     * Oculta o banner de erro
     */
    function hideError() {
        errorBanner.style.display = "none";
        errorTitle.textContent = "";
        errorMessage.textContent = "";
    }

    /**
     * Alterna estado visual de carregamento da listagem
     */
    function setLoading(isLoading) {
        if (isLoading) {
            loadingIndicator.style.display = "flex";
            tableWrapper.style.display = "none";
            emptyMessage.style.display = "none";
            btnRefresh.disabled = true;
        } else {
            loadingIndicator.style.display = "none";
            btnRefresh.disabled = false;
        }
    }

    /**
     * Define se os botões do formulário estão desabilitados durante envio
     */
    function setSubmitting(submitting) {
        isSubmitting = submitting;
        btnSubmit.disabled = submitting;
        btnCancel.disabled = submitting;
        inputMarca.disabled = submitting;
        inputModelo.disabled = submitting;
        inputAno.disabled = submitting;
        inputCor.disabled = submitting;
    }

    /**
     * Reseta formulário e cancela modo de edição
     */
    function resetForm() {
        form.reset();
        editingId = null;
        formTitle.textContent = "➕ Cadastrar Nova Moto";
        btnSubmit.textContent = "Cadastrar Moto";
        btnCancel.style.display = "none";
        setSubmitting(false);
    }

    /**
     * Atualiza os números nos cartões de estatística
     */
    function atualizarEstatisticas(motos) {
        statTotal.textContent = String(motos.length);

        var marcasUnicas = {};
        for (var i = 0; i < motos.length; i++) {
            if (motos[i].marca) {
                marcasUnicas[motos[i].marca.toLowerCase().trim()] = true;
            }
        }
        statMarcas.textContent = String(Object.keys(marcasUnicas).length);
    }

    /**
     * Renderiza as linhas da tabela utilizando estritamente textContent
     */
    function renderizarTabela(motos) {
        tbody.textContent = "";

        if (!motos || motos.length === 0) {
            tableWrapper.style.display = "none";
            emptyMessage.style.display = "block";
            atualizarEstatisticas([]);
            return;
        }

        emptyMessage.style.display = "none";
        tableWrapper.style.display = "block";

        for (var i = 0; i < motos.length; i++) {
            var moto = motos[i];
            var tr = document.createElement("tr");

            // Coluna ID
            var tdId = document.createElement("td");
            var strongId = document.createElement("strong");
            strongId.textContent = "#" + String(moto.id);
            tdId.appendChild(strongId);
            tr.appendChild(tdId);

            // Coluna Marca
            var tdMarca = document.createElement("td");
            tdMarca.textContent = moto.marca || "-";
            tr.appendChild(tdMarca);

            // Coluna Modelo
            var tdModelo = document.createElement("td");
            tdModelo.textContent = moto.modelo || "-";
            tr.appendChild(tdModelo);

            // Coluna Ano
            var tdAno = document.createElement("td");
            tdAno.textContent = (moto.ano && moto.ano > 0) ? String(moto.ano) : "-";
            tr.appendChild(tdAno);

            // Coluna Cor
            var tdCor = document.createElement("td");
            tdCor.textContent = moto.cor || "-";
            tr.appendChild(tdCor);

            // Coluna Ações
            var tdAcoes = document.createElement("td");
            tdAcoes.className = "actions-cell";

            var btnEdit = document.createElement("button");
            btnEdit.type = "button";
            btnEdit.className = "btn btn-edit";
            btnEdit.textContent = "Editar";
            btnEdit.setAttribute("data-id", String(moto.id));
            btnEdit.setAttribute("data-marca", moto.marca || "");
            btnEdit.setAttribute("data-modelo", moto.modelo || "");
            btnEdit.setAttribute("data-ano", (moto.ano && moto.ano > 0) ? String(moto.ano) : "");
            btnEdit.setAttribute("data-cor", moto.cor || "");

            var btnDelete = document.createElement("button");
            btnDelete.type = "button";
            btnDelete.className = "btn btn-delete";
            btnDelete.textContent = "Excluir";
            btnDelete.setAttribute("data-id", String(moto.id));

            tdAcoes.appendChild(btnEdit);
            tdAcoes.appendChild(btnDelete);
            tr.appendChild(tdAcoes);

            tbody.appendChild(tr);
        }

        atualizarEstatisticas(motos);
    }

    /**
     * GET /api/motos — Listar motos
     */
    function carregarMotos() {
        setLoading(true);
        hideError();

        fetch(API_URL, {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        })
        .then(function (response) {
            if (!response.ok) {
                throw new Error("HTTP " + response.status + " (" + response.statusText + ")");
            }
            return response.json();
        })
        .then(function (data) {
            renderizarTabela(data);
        })
        .catch(function (error) {
            showError("Falha ao carregar motos:", error.message);
            showToast("Erro ao obter motos da API", true);
            tableWrapper.style.display = "none";
            emptyMessage.style.display = "block";
            emptyMessage.querySelector("p").textContent = "Não foi possível carregar as motos da API.";
        })
        .finally(function () {
            setLoading(false);
        });
    }

    /**
     * POST /api/motos — Cadastrar moto
     */
    function criarMoto(dados) {
        setSubmitting(true);
        hideError();

        fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(dados)
        })
        .then(function (response) {
            if (response.status === 201 || response.ok) {
                return response.json();
            }
            throw new Error("HTTP " + response.status + " (" + response.statusText + ")");
        })
        .then(function (novaMoto) {
            showToast("Moto #" + novaMoto.id + " cadastrada com sucesso!");
            resetForm();
            carregarMotos();
        })
        .catch(function (error) {
            showError("Falha ao cadastrar moto:", error.message);
            showToast("Erro ao cadastrar: " + error.message, true);
            setSubmitting(false);
        });
    }

    /**
     * PUT /api/motos/{id} — Atualizar moto
     */
    function atualizarMoto(id, dados) {
        setSubmitting(true);
        hideError();

        fetch(API_URL + "/" + id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(dados)
        })
        .then(function (response) {
            if (response.status === 200 || response.ok) {
                return;
            }
            if (response.status === 404) {
                throw new Error("Moto não encontrada na API (HTTP 404)");
            }
            throw new Error("HTTP " + response.status + " (" + response.statusText + ")");
        })
        .then(function () {
            showToast("Moto #" + id + " atualizada com sucesso!");
            resetForm();
            carregarMotos();
        })
        .catch(function (error) {
            showError("Falha ao atualizar moto #" + id + ":", error.message);
            showToast("Erro ao atualizar: " + error.message, true);
            setSubmitting(false);
        });
    }

    /**
     * DELETE /api/motos/{id} — Excluir moto
     */
    function excluirMoto(id) {
        var confirmacao = window.confirm("Deseja realmente remover a moto #" + id + "?");
        if (!confirmacao) {
            return;
        }

        hideError();

        fetch(API_URL + "/" + id, {
            method: "DELETE"
        })
        .then(function (response) {
            if (response.status === 204 || response.ok) {
                return;
            }
            if (response.status === 404) {
                throw new Error("Moto #" + id + " não encontrada para exclusão (HTTP 404)");
            }
            throw new Error("HTTP " + response.status + " (" + response.statusText + ")");
        })
        .then(function () {
            showToast("Moto #" + id + " removida com sucesso!");
            if (editingId === id) {
                resetForm();
            }
            carregarMotos();
        })
        .catch(function (error) {
            showError("Falha ao remover moto #" + id + ":", error.message);
            showToast("Erro ao excluir: " + error.message, true);
        });
    }

    /**
     * Evento Submit do Formulário
     */
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        if (isSubmitting) {
            return;
        }

        var marca = inputMarca.value.trim();
        var modelo = inputModelo.value.trim();
        var ano = parseInt(inputAno.value, 10);
        var cor = inputCor.value.trim();

        if (!marca || !modelo) {
            showError("Validação:", "Preencha a Marca e o Modelo da moto.");
            return;
        }

        if (isNaN(ano) || ano < 1900 || ano > 2100) {
            showError("Validação:", "Informe um ano válido para a moto (ex: 2024).");
            return;
        }

        if (!cor) {
            showError("Validação:", "Informe a cor da moto.");
            return;
        }

        var payload = {
            marca: marca,
            modelo: modelo,
            ano: ano,
            cor: cor
        };

        if (editingId !== null) {
            atualizarMoto(editingId, payload);
        } else {
            criarMoto(payload);
        }
    });

    /**
     * Cancelar edição
     */
    btnCancel.addEventListener("click", function () {
        resetForm();
    });

    /**
     * Botão recarregar listagem
     */
    btnRefresh.addEventListener("click", function () {
        carregarMotos();
    });

    /**
     * Fechar banner de erro
     */
    btnCloseError.addEventListener("click", function () {
        hideError();
    });

    /**
     * Delegação de cliques na tabela para Editar e Excluir
     */
    tbody.addEventListener("click", function (e) {
        var target = e.target;
        if (!target || target.tagName !== "BUTTON") {
            return;
        }

        var id = parseInt(target.getAttribute("data-id"), 10);
        if (isNaN(id)) {
            return;
        }

        if (target.classList.contains("btn-edit")) {
            var marca = target.getAttribute("data-marca") || "";
            var modelo = target.getAttribute("data-modelo") || "";
            var ano = target.getAttribute("data-ano") || "";
            var cor = target.getAttribute("data-cor") || "";

            editingId = id;
            inputMarca.value = marca;
            inputModelo.value = modelo;
            inputAno.value = ano;
            inputCor.value = cor;

            formTitle.textContent = "✏️ Editar Moto #" + String(id);
            btnSubmit.textContent = "Salvar Alterações";
            btnCancel.style.display = "inline-block";

            form.scrollIntoView({ behavior: "smooth", block: "center" });
            inputMarca.focus();
        } else if (target.classList.contains("btn-delete")) {
            excluirMoto(id);
        }
    });

    // Carga inicial
    carregarMotos();
})();
