/**
 * Dashboard Principal - PetVet
 */
class Dashboard {
    constructor() {
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
     * Atualiza as estatísticas do dashboard
     */
    async atualizarEstatisticas() {
        try {
            // Simular dados (em uma implementação real, viria da API)
            const estatisticas = {
                agendamentosHoje: Math.floor(Math.random() * 15) + 5,
                agendamentosPendentes: Math.floor(Math.random() * 8) + 1,
                agendamentosConcluidos: Math.floor(Math.random() * 10) + 3,
                totalClientes: Math.floor(Math.random() * 50) + 100
            };

            // Atualizar na interface com animação
            this.animarContador('#agendamentos-hoje', estatisticas.agendamentosHoje);
            this.animarContador('#agendamentos-pendentes', estatisticas.agendamentosPendentes);
            this.animarContador('#agendamentos-concluidos', estatisticas.agendamentosConcluidos);
            this.animarContador('#total-clientes', estatisticas.totalClientes);

        } catch (error) {
            console.error('Erro ao atualizar estatísticas:', error);
        }
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
        
        // Adicionar horário no cabeçalho se não existir
        if (!$('#horario-atual').length) {
            $('.btn-toolbar').prepend(`
                <div class="me-3">
                    <small class="text-muted" id="horario-atual">${horarioFormatado}</small>
                </div>
            `);
        } else {
            $('#horario-atual').text(horarioFormatado);
        }

        // Atualizar a cada minuto
        setTimeout(() => this.atualizarHorario(), 60000);
    }

    /**
     * Carrega agendamentos do dia (simulado)
     */
    async carregarAgendamentosHoje() {
        try {
            // Em uma implementação real, isso viria da API
            const agendamentos = [
                {
                    id: 1,
                    pet: 'Paçoca',
                    tutor: 'João Silva',
                    servico: 'Banho e Tosa',
                    profissional: 'Carla Mendes',
                    horario: '10:30',
                    status: 'confirmado'
                },
                {
                    id: 2,
                    pet: 'Mimi',
                    tutor: 'Maria Santos',
                    servico: 'Consulta Veterinária',
                    profissional: 'Dr. Carlos Silva',
                    horario: '14:00',
                    status: 'aguardando'
                },
                {
                    id: 3,
                    pet: 'Rex',
                    tutor: 'Pedro Costa',
                    servico: 'Vacinação V10',
                    profissional: 'Dra. Ana Santos',
                    horario: '16:30',
                    status: 'agendado'
                }
            ];

            this.renderizarAgendamentos(agendamentos);

        } catch (error) {
            console.error('Erro ao carregar agendamentos:', error);
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
                    <p class="text-muted mt-2">Nenhum agendamento para hoje</p>
                </div>
            `);
            return;
        }

        agendamentos.forEach(agendamento => {
            const statusClass = this.getStatusClass(agendamento.status);
            const statusText = this.getStatusText(agendamento.status);

            const item = `
                <div class="appointment-card list-group-item d-flex gap-3 py-3">
                    <div class="appointment-avatar">
                        <i class="bi bi-heart"></i>
                    </div>
                    <div class="d-flex gap-2 w-100 justify-content-between">
                        <div>
                            <h6 class="mb-0">${agendamento.pet} - ${agendamento.tutor}</h6>
                            <p class="mb-0 text-muted">${agendamento.servico}</p>
                            <small class="text-success">
                                <i class="bi bi-person-badge me-1"></i>${agendamento.profissional}
                            </small>
                        </div>
                        <div class="text-end">
                            <small class="text-primary fw-bold">${agendamento.horario}</small>
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
            'confirmado': 'bg-success',
            'aguardando': 'bg-warning',
            'agendado': 'bg-primary',
            'cancelado': 'bg-danger',
            'concluido': 'bg-secondary'
        };
        return classes[status] || 'bg-secondary';
    }

    /**
     * Retorna o texto do status
     */
    getStatusText(status) {
        const textos = {
            'confirmado': 'Confirmado',
            'aguardando': 'Aguardando',
            'agendado': 'Agendado',
            'cancelado': 'Cancelado',
            'concluido': 'Concluído'
        };
        return textos[status] || 'Indefinido';
    }
}

// Inicializar o dashboard
const dashboard = new Dashboard();
