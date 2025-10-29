/**
 * Dashboard Principal - PetVet
 */
class Dashboard {
    constructor() {
        this.servidor = window.API_URL;
        this.init();
    }

    /**
     * Inicializa o dashboard
     */
    init() {
        $(document).ready(() => {
            this.carregarInformacoes();
            this.configurarEventListeners();
            this.atualizarHorario();
            this.carregarMeusAgendamentos(); // NOVO: Carregar agendamentos do usuário
        });
    }

    /**
     * Carrega as informações da clínica na interface
     */
    carregarInformacoes() {
        if (typeof PETVET_CONFIG !== 'undefined') {
            // Atualizar informações no header e sidebar
            $('#nome-clinica').text(PETVET_CONFIG.nome);
            $('#slogan-clinica').text(PETVET_CONFIG.slogan);
            $('#telefone-header').text(PETVET_CONFIG.contato.telefones.principal);
            $('#telefone-sidebar').text(PETVET_CONFIG.contato.telefones.principal);
            $('#whatsapp-sidebar').text(PETVET_CONFIG.contato.telefones.whatsapp);
            $('#email-sidebar').text(PETVET_CONFIG.contato.email);
            
            // Atualizar título da página
            document.title = `${PETVET_CONFIG.nome} | ${PETVET_CONFIG.slogan}`;
        }
    }

    /**
     * Configura os event listeners
     */
    configurarEventListeners() {
        // Atualizar estatísticas a cada 30 segundos
        setInterval(() => {
            this.atualizarEstatisticas();
        }, 30000);

        // Configurar tooltips do Bootstrap
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }

    /**
     * Atualiza as estatísticas do dashboard (Simulado, pois não temos dados de admin)
     */
    async atualizarEstatisticas() {
        // Manter a simulação para os cards, já que o foco é o agendamento do usuário
        const estatisticas = {
            agendamentosHoje: Math.floor(Math.random() * 15) + 5,
            agendamentosPendentes: Math.floor(Math.random() * 8) + 1,
            agendamentosConcluidos: Math.floor(Math.random() * 10) + 3,
            totalClientes: Math.floor(Math.random() * 50) + 100
        };

        this.animarContador('#agendamentos-hoje', estatisticas.agendamentosHoje);
        this.animarContador('#agendamentos-pendentes', estatisticas.agendamentosPendentes);
        this.animarContador('#agendamentos-concluidos', estatisticas.agendamentosConcluidos);
        this.animarContador('#total-clientes', estatisticas.totalClientes);
    }

    /**
     * Anima a contagem de números
     */
    animarContador(selector, valorFinal) {
        const elemento = $(selector);
        const valorAtual = parseInt(elemento.text()) || 0;
        
        if (valorAtual !== valorFinal) {
            $({ contador: valorAtual }).animate({ contador: valorFinal }, {
                duration: 1000,
                step: function() {
                    elemento.text(Math.ceil(this.contador));
                },
                complete: function() {
                    elemento.text(valorFinal);
                }
            });
        }
    }

    /**
     * Atualiza o horário atual
     */
    atualizarHorario() {
        const agora = new Date();
        const opcoes = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        
        const horarioFormatado = agora.toLocaleDateString('pt-BR', opcoes);
        
        if (!$('#horario-atual').length) {
            $('.btn-toolbar').prepend(`
                <div class="me-3">
                    <small class="text-muted" id="horario-atual">${horarioFormatado}</small>
                </div>
            `);
        } else {
            $('#horario-atual').text(horarioFormatado);
        }

        setTimeout(() => this.atualizarHorario(), 60000);
    }

    /**
     * NOVO: Carrega os agendamentos do usuário logado
     */
    async carregarMeusAgendamentos() {
        const token = localStorage.getItem('petvet_token');
        const user = JSON.parse(localStorage.getItem('petvet_user'));
        
        if (!token || !user) {
            this.renderizarAgendamentos([]); // Renderiza lista vazia se não estiver logado
            return;
        }

        try {
            const response = await fetch(`${this.servidor}/appointments/me`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const agendamentos = await response.json();
                this.renderizarAgendamentos(agendamentos);
            } else {
                console.error('Falha ao carregar agendamentos:', await response.json());
                this.renderizarAgendamentos([]);
            }

        } catch (error) {
            console.error('Erro de rede ao carregar agendamentos:', error);
            this.renderizarAgendamentos([]);
        }
    }

    /**
     * Renderiza a lista de agendamentos
     */
    renderizarAgendamentos(agendamentos) {
        const container = $('#agendamentos-lista');
        container.empty();

        if (!agendamentos || agendamentos.length === 0) {
            container.html(`
                <div class="text-center py-4">
                    <i class="bi bi-calendar-x text-muted fs-1"></i>
                    <p class="text-muted mt-2">Nenhum agendamento encontrado.</p>
                    <p class="text-muted mt-0 small">Faça login e agende um serviço na página de Serviços.</p>
                </div>
            `);
            return;
        }

        // Filtra para mostrar apenas os agendamentos de hoje
        const hoje = new Date().toISOString().split('T')[0];
        const agendamentosHoje = agendamentos.filter(a => a.appointmentDate === hoje);

        if (agendamentosHoje.length === 0) {
             container.html(`
                <div class="text-center py-4">
                    <i class="bi bi-calendar-x text-muted fs-1"></i>
                    <p class="text-muted mt-2">Nenhum agendamento para hoje.</p>
                </div>
            `);
            return;
        }

        agendamentosHoje.forEach(agendamento => {
            const statusClass = this.getStatusClass(agendamento.status);
            const statusText = this.getStatusText(agendamento.status);
            
            // Formatar data e hora para exibição
            const [hora, minuto] = agendamento.appointmentTime.split(':');
            const horarioFormatado = `${hora}:${minuto}`;

            const item = `
                <div class="appointment-card list-group-item d-flex gap-3 py-3">
                    <div class="appointment-avatar">
                        <i class="bi bi-heart"></i>
                    </div>
                    <div class="d-flex gap-2 w-100 justify-content-between">
                        <div>
                            <h6 class="mb-0">${agendamento.petName} - ${agendamento.ownerName}</h6>
                            <p class="mb-0 text-muted">${agendamento.servicoName}</p>
                            <small class="text-success">
                                <i class="bi bi-person-badge me-1"></i>${agendamento.status}
                            </small>
                        </div>
                        <div class="text-end">
                            <small class="text-primary fw-bold">${horarioFormatado}</small>
                            <br>
                            <span class="badge ${statusClass}">${statusText}</span>
                        </div>
                    </div>
                </div>
            `;

            container.append(item);
        });
    }

    /**
     * Retorna a classe CSS para o status
     */
    getStatusClass(status) {
        const classes = {
            'Pendente': 'bg-warning',
            'Confirmado': 'bg-success',
            'Cancelado': 'bg-danger',
            'Concluído': 'bg-secondary'
        };
        return classes[status] || 'bg-secondary';
    }

    /**
     * Retorna o texto do status
     */
    getStatusText(status) {
        return status || 'Indefinido';
    }
}

// Inicializar o dashboard
const dashboard = new Dashboard();
