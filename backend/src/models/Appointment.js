const database = require('../config/database');

/**
 * Modelo para gerenciamento de atendimentos (agendamentos)
 */
class Appointment {
    constructor() {
        this.collection = database.getCollection('appointments');
    }

    /**
     * Cadastra um novo atendimento
     * @param {Object} dados - Dados do atendimento
     * @returns {Object} O atendimento cadastrado
     */
    async cadastrar(dados) {
        return await this.collection.insertOne(dados);
    }

    /**
     * Lista todos os atendimentos de um usuário específico
     * @param {string} userId - ID do usuário
     * @returns {Array} Lista de atendimentos
     */
    async listarPorUsuario(userId) {
        const allAppointments = await this.collection.find();
        // O findOne/find do nosso Collection JSON é limitado, então filtramos aqui
        return allAppointments.filter(app => app.userId === userId);
    }
}

module.exports = new Appointment();
