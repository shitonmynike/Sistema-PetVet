/**
 * Gerenciamento de Serviços - Frontend PetVet
 */
class ServicosManager {
    constructor() {
        this.servidor = this.getServidorUrl();
        this.init();
    }

    /**
     * Determina a URL do servidor baseada no ambiente
     */
    getServidorUrl() {
        const isLocalhost = location.hostname === "localhost";
        return isLocalhost ? "http://localhost:3003" : "https://petvet-back-sjv0.onrender.com";
    }

    /**
     * Inicializa os event listeners e carrega os dados
     */
    init() {
        $(document).ready(() => {
            this.setupEventListeners();
            this.listarServicos();
        });
    }

    /**
     * Configura todos os event listeners
     */
    setupEventListeners() {
        // Botão de cadastrar novo serviço
        $("#bt-novo-servico").click(() => this.abrirModalCadastro());

        // Botão salvar (cadastro)
        $("#bt-salvar").click(() => this.salvarServico());

        // Botão editar (atualização)
        $("#bt-editar").click(() => this.editarServico());

        // Botão confirmar exclusão
        $("#bt-confirma-delete").click(() => this.confirmarExclusao());

        // Event listeners para botões da tabela (delegação de eventos)
        $("#lista-servico").on("click", ".bt-alterar", (e) => {
            const id = $(e.target).attr("servico-id");
            this.abrirModalEdicao(id);
        });

        $("#lista-servico").on("click", ".bt-delete", (e) => {
            const id = $(e.target).attr("servico-id");
            this.prepararExclusao(id);
        });

        // Fechar alertas automaticamente
        $(".alert .btn-close").click(function() {
            $(this).parent().addClass("d-none");
        });
    }

    /**
     * Lista todos os serviços
     */
    async listarServicos() {
        try {
            this.showLoading(true);
            
            const response = await $.getJSON(`${this.servidor}/api/servicos`);
            const servicos = response.dados || response;

            this.renderizarTabela(servicos);
            
        } catch (error) {
            console.error('Erro ao listar serviços:', error);
            this.showError('Erro ao carregar lista de serviços');
        } finally {
            this.showLoading(false);
        }
    }

    /**
     * Renderiza a tabela de serviços
     */
    renderizarTabela(servicos) {
        const tbody = $("#lista-servico");
        tbody.empty();

        if (!servicos || servicos.length === 0) {
            tbody.append(`
                <tr>
                    <td colspan="5" class="text-center text-muted">
                        Nenhum serviço cadastrado
                    </td>
                </tr>
            `);
            return;
        }

        servicos.forEach(servico => {
            const row = `
                <tr>
                    <td>${servico.nome}</td>
                    <td>R$ ${parseFloat(servico.preco).toFixed(2)}</td>
                    <td>${servico.profissional || 'Não informado'}</td>
                    <td>${servico.tipo || 'Não informado'}</td>
                    <td>
                        <div class="btn-group" role="group">
                            <button servico-id="${servico._id}" class="btn btn-outline-primary btn-sm bt-alterar">
                                <i class="bi bi-pencil"></i> Editar
                            </button>
                            <button servico-id="${servico._id}" class="btn btn-outline-danger btn-sm bt-delete" 
                                    data-bs-toggle="modal" data-bs-target="#modal-delete">
                                <i class="bi bi-trash"></i> Excluir
                            </button>
                        </div>
                    </td>
                </tr>
            `;
            tbody.append(row);
        });
    }

    /**
     * Abre modal para cadastro de novo serviço
     */
    abrirModalCadastro() {
        this.limparFormulario();
        $("#modal-title").text("Cadastrar Novo Serviço");
        $("#bt-salvar").removeClass("d-none");
        $("#bt-editar").addClass("d-none");
        $("#modal-cadastrar").modal('show');
    }

    /**
     * Abre modal para edição de serviço
     */
    async abrirModalEdicao(id) {
        try {
            const response = await $.getJSON(`${this.servidor}/api/servicos/${id}`);
            const servico = response.dados || response;

            $("#id-selecionado").val(id);
            $("#nome").val(servico.nome);
            $("#preco").val(parseFloat(servico.preco).toFixed(2));
            $("#funcionario").val(servico.profissional || '');

            // Selecionar tipo de serviço
            $('[name="tipo"]').each(function() {
                $(this).prop("checked", $(this).val() === servico.tipo);
            });

            $("#modal-title").text("Editar Serviço");
            $("#bt-editar").removeClass("d-none");
            $("#bt-salvar").addClass("d-none");
            $("#modal-cadastrar").modal('show');

        } catch (error) {
            console.error('Erro ao carregar serviço:', error);
            this.showError('Erro ao carregar dados do serviço');
        }
    }

    /**
     * Salva um novo serviço
     */
    async salvarServico() {
        try {
            const dadosServico = this.coletarDadosFormulario();
            
            if (!this.validarDados(dadosServico)) {
                return;
            }

            await $.post(`${this.servidor}/api/servicos`, dadosServico);
            
            $("#modal-cadastrar").modal('hide');
            this.showSuccess('Serviço cadastrado com sucesso!');
            this.listarServicos();
            this.limparFormulario();

        } catch (error) {
            console.error('Erro ao salvar serviço:', error);
            this.showError('Erro ao cadastrar serviço');
        }
    }

    /**
     * Edita um serviço existente
     */
    async editarServico() {
        try {
            const id = $("#id-selecionado").val();
            const dadosServico = this.coletarDadosFormulario();
            
            if (!this.validarDados(dadosServico)) {
                return;
            }

            await $.ajax({
                url: `${this.servidor}/api/servicos/${id}`,
                method: 'PUT',
                data: JSON.stringify(dadosServico),
                contentType: 'application/json'
            });
            
            $("#modal-cadastrar").modal('hide');
            this.showSuccess('Serviço atualizado com sucesso!');
            this.listarServicos();
            this.limparFormulario();

        } catch (error) {
            console.error('Erro ao editar serviço:', error);
            this.showError('Erro ao atualizar serviço');
        }
    }

    /**
     * Prepara a exclusão de um serviço
     */
    prepararExclusao(id) {
        $("#id-selecionado").val(id);
    }

    /**
     * Confirma e executa a exclusão
     */
    async confirmarExclusao() {
        try {
            const id = $("#id-selecionado").val();
            
            await $.ajax({
                url: `${this.servidor}/api/servicos/${id}`,
                method: 'DELETE'
            });
            
            $("#modal-delete").modal('hide');
            this.showSuccess('Serviço excluído com sucesso!');
            this.listarServicos();

        } catch (error) {
            console.error('Erro ao excluir serviço:', error);
            this.showError('Erro ao excluir serviço');
        }
    }

    /**
     * Coleta dados do formulário
     */
    coletarDadosFormulario() {
        return {
            nome: $("#nome").val().trim(),
            preco: $("#preco").val(),
            profissional: $("#funcionario").val().trim(),
            tipo: $('[name="tipo"]:checked').val()
        };
    }

    /**
     * Valida os dados do formulário
     */
    validarDados(dados) {
        if (!dados.nome) {
            this.showError('Nome do serviço é obrigatório');
            return false;
        }

        if (!dados.preco || parseFloat(dados.preco) <= 0) {
            this.showError('Preço deve ser maior que zero');
            return false;
        }

        return true;
    }

    /**
     * Limpa o formulário
     */
    limparFormulario() {
        $("#nome, #funcionario, #preco").val("");
        $('[name="tipo"]').prop("checked", false);
        $("#id-selecionado").val("");
    }

    /**
     * Exibe mensagem de sucesso
     */
    showSuccess(mensagem) {
        $("#msg-sucesso").removeClass("d-none").find(".alert-text").text(mensagem);
        setTimeout(() => $("#msg-sucesso").addClass("d-none"), 5000);
    }

    /**
     * Exibe mensagem de erro
     */
    showError(mensagem) {
        $("#msg-erro").removeClass("d-none").find(".alert-text").text(mensagem);
        setTimeout(() => $("#msg-erro").addClass("d-none"), 5000);
    }

    /**
     * Controla o indicador de carregamento
     */
    showLoading(show) {
        if (show) {
            $("#loading").removeClass("d-none");
        } else {
            $("#loading").addClass("d-none");
        }
    }
}

// Inicializar o gerenciador quando o documento estiver pronto
const servicosManager = new ServicosManager();
