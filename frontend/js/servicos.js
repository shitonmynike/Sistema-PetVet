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
        // Usa a variável global definida em config.js
        return window.API_URL || "http://localhost:3003/api";
    }

    /**
     * Inicializa os event listeners e carrega os dados
     */
    init() {
        $(document).ready(() => {
            this.checkAuth();
            this.setupEventListeners();
            this.listarServicos();
        });
    }

    /**
     * Configura todos os event listeners
     */
    setupEventListeners() {
        // Botão de cadastrar novo serviço (mantido, mas pode ser removido se o usuário não for admin)
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

        // NOVO: Event listener para o botão de Agendar Atendimento
        $("#lista-servico").on("click", ".bt-agendar", (e) => {
            const id = $(e.target).attr("servico-id");
            const nome = $(e.target).attr("servico-nome");
            this.abrirModalAgendamento(id, nome);
        });

        // NOVO: Event listener para o formulário de agendamento
        $("#form-agendamento").submit((e) => {
            e.preventDefault();
            this.agendarAtendimento();
        });

        // Fechar alertas automaticamente
        $(".alert .btn-close").click(function() {
            $(this).parent().addClass("d-none");
        });
    }

    /**
     * Verifica o estado de autenticação e atualiza o botão de login/logout
     */
    checkAuth() {
        const token = localStorage.getItem('petvet_token');
        const user = JSON.parse(localStorage.getItem('petvet_user'));
        const authButton = document.getElementById('authButton');
        
        if (token && user) {
            authButton.innerHTML = `<i class="bi bi-box-arrow-right me-1"></i> Sair (${user.name.split(' ')[0]})`;
            authButton.classList.remove('btn-outline-light');
            authButton.classList.add('btn-danger');
        } else {
            authButton.innerHTML = '<i class="bi bi-box-arrow-in-right me-1"></i> Login';
            authButton.classList.remove('btn-danger');
            authButton.classList.add('btn-outline-light');
        }
    }

    /**
     * Função para lidar com o clique no botão de autenticação (usada no HTML)
     */
    handleAuthClick() {
        const token = localStorage.getItem('petvet_token');
        if (token) {
            // Logout
            localStorage.removeItem('petvet_token');
            localStorage.removeItem('petvet_user');
            this.checkAuth();
            window.location.href = '../index.html'; 
        } else {
            // Login
            window.location.href = 'auth.html';
        }
    }


    /**
     * Lista todos os serviços
     */
    async listarServicos() {
        try {
            this.showLoading(true);
            
            // Ajuste para usar a URL correta com /api
            const response = await $.getJSON(`${this.servidor}/servicos`);
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
                    <td colspan="6" class="text-center text-muted">
                        Nenhum serviço cadastrado
                    </td>
                </tr>
            `);
            return;
        }

        servicos.forEach(servico => {
            // Usamos servico.id do JSON DB, não _id do MongoDB
            const id = servico.id;
            const nome = servico.name;
            const preco = parseFloat(servico.price).toFixed(2);
            const descricao = servico.description;

            const row = `
                <tr>
                    <td>${nome}</td>
                    <td>${descricao}</td>
                    <td>R$ ${preco}</td>
                    <td>-</td>
                    <td>-</td>
                    <td class="text-center">
                        <div class="btn-group" role="group">
                            <button servico-id="${id}" servico-nome="${nome}" class="btn btn-success btn-sm bt-agendar" 
                                    data-bs-toggle="modal" data-bs-target="#modal-agendar">
                                <i class="bi bi-calendar-plus"></i> Agendar
                            </button>
                            <!-- Botões de edição e exclusão removidos/ocultados para o usuário comum -->
                        </div>
                    </td>
                </tr>
            `;
            tbody.append(row);
        });
    }

    /**
     * Abre o modal de agendamento
     */
    abrirModalAgendamento(id, nome) {
        if (!localStorage.getItem('petvet_token')) {
            this.showError('Você precisa estar logado para agendar um atendimento.');
            $('#modal-agendar').modal('hide');
            // Redireciona para login
            setTimeout(() => window.location.href = 'auth.html', 1500);
            return;
        }
        
        $("#agendar-servico-id").val(id);
        $("#servico-selecionado-nome").text(nome);
        $("#agendamentoMessage").addClass("d-none");

        // Preenche o nome do dono com o nome do usuário logado, se disponível
        const user = JSON.parse(localStorage.getItem('petvet_user'));
        if (user && user.name) {
            $("#ownerName").val(user.name);
        } else {
            $("#ownerName").val('');
        }
        
        // Limpa outros campos
        $("#petName").val('');
        $("#appointmentDate").val('');
        $("#appointmentTime").val('');
        $("#notes").val('');
        
        $('#modal-agendar').modal('show');
    }

    /**
     * Envia o agendamento para o backend
     */
    async agendarAtendimento() {
        const servicoId = $("#agendar-servico-id").val();
        const petName = $("#petName").val().trim();
        const ownerName = $("#ownerName").val().trim();
        const appointmentDate = $("#appointmentDate").val();
        const appointmentTime = $("#appointmentTime").val();
        const notes = $("#notes").val().trim();
        const token = localStorage.getItem('petvet_token');

        if (!petName || !ownerName || !appointmentDate || !appointmentTime) {
            this.showError('Preencha todos os campos obrigatórios.', 'agendamentoMessage');
            return;
        }

        try {
            const response = await fetch(`${this.servidor}/appointments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    servicoId,
                    petName,
                    ownerName,
                    appointmentDate,
                    appointmentTime,
                    notes
                })
            });

            const data = await response.json();

            if (response.ok) {
                $('#modal-agendar').modal('hide');
                this.showSuccess('Atendimento agendado com sucesso! Aguarde a confirmação.');
            } else {
                this.showError(data.erro || data.mensagem || 'Erro ao agendar atendimento.', 'agendamentoMessage');
            }

        } catch (error) {
            console.error('Erro de rede/servidor:', error);
            this.showError('Erro de conexão com o servidor.', 'agendamentoMessage');
        }
    }

    // Métodos de CRUD de Serviço (Manter por compatibilidade, mas não serão usados pelo usuário comum)
    abrirModalCadastro() { /* ... */ }
    abrirModalEdicao(id) { /* ... */ }
    salvarServico() { /* ... */ }
    editarServico() { /* ... */ }
    prepararExclusao(id) { /* ... */ }
    confirmarExclusao() { /* ... */ }
    coletarDadosFormulario() { /* ... */ }
    validarDados(dados) { /* ... */ }
    limparFormulario() { /* ... */ }

    // Métodos de UI
    showSuccess(mensagem) {
        $("#msg-sucesso").removeClass("d-none").find(".alert-text").text(mensagem);
        setTimeout(() => $("#msg-sucesso").addClass("d-none"), 5000);
    }

    showError(mensagem, elementId = 'msg-erro') {
        const element = $(`#${elementId}`);
        element.removeClass("d-none").find(".alert-text").text(mensagem);
        setTimeout(() => element.addClass("d-none"), 5000);
    }

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

// Expor funções globais necessárias para o HTML
window.handleAuthClick = servicosManager.handleAuthClick.bind(servicosManager);
