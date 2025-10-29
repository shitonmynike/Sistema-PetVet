const Appointment = require('../models/Appointment');
const Servico = require('../models/Servico');

/**
 * Cadastra um novo atendimento (appointment)
 */
exports.cadastrar = async (req, res) => {
    try {
        const { servicoId, petName, ownerName, appointmentDate, appointmentTime, notes } = req.body;
        const userId = req.user.id; // ID do usuário logado, adicionado pelo middleware 'protect'

        if (!servicoId || !petName || !ownerName || !appointmentDate || !appointmentTime) {
            return res.status(400).json({ erro: 'Campos obrigatórios ausentes.' });
        }

        // 1. Busca o serviço para garantir que ele existe e obter o nome/preço
        const servico = await Servico.listarPorId(servicoId);
        if (!servico) {
            return res.status(404).json({ erro: 'Serviço não encontrado.' });
        }

        // 2. Cria o objeto de atendimento
        const appointmentData = {
            userId,
            servicoId,
            servicoName: servico.name,
            servicoPrice: servico.price,
            petName,
            ownerName,
            appointmentDate,
            appointmentTime,
            notes: notes || '',
            status: 'Pendente', // Status inicial
            createdAt: new Date().toISOString()
        };

        // 3. Insere no banco de dados
        const newAppointment = await Appointment.cadastrar(appointmentData);

        return res.status(201).json({ 
            mensagem: 'Atendimento agendado com sucesso.',
            atendimento: newAppointment
        });
    } catch (error) {
        console.error('Erro ao cadastrar atendimento:', error);
        return res.status(500).json({ erro: 'Erro interno do servidor ao agendar atendimento.' });
    }
};

/**
 * Lista os atendimentos do usuário logado
 */
exports.listarMeusAtendimentos = async (req, res) => {
    try {
        const userId = req.user.id;
        const appointments = await Appointment.listarPorUsuario(userId);

        return res.status(200).json(appointments);
    } catch (error) {
        console.error('Erro ao listar atendimentos:', error);
        return res.status(500).json({ erro: 'Erro interno do servidor ao listar atendimentos.' });
    }
};
