const database = require('../config/database');

/**
 * Modelo para gerenciamento de serviços da clínica veterinária
 */
class Servico {
    constructor() {
        // A Collection agora é inicializada no constructor com o nome da coleção
        this.collection = database.getCollection('services');
    }

    /**
     * Cadastra um novo serviço (mantido por compatibilidade, mas o JSON já tem serviços iniciais)
     * @param {Object} dados - Dados do serviço (name, description, price)
     * @returns {Object} Resultado da inserção
     */
    async cadastrar(dados) {
        const servicoData = {
            ...dados,
            price: parseFloat(dados.price),
            data_cadastro: new Date().toISOString(),
            ativo: true
        };

        return await this.collection.insertOne(servicoData);
    }

    /**
     * Lista todos os serviços ativos
     * @returns {Array} Lista de serviços
     */
    async listar() {
        // O find() da Collection JSON retorna todos os itens. 
        // A filtragem por 'ativo' é simplificada, pois os serviços iniciais são todos ativos.
        const allServices = await this.collection.find();
        return allServices.filter(s => s.ativo !== false);
    }

    /**
     * Lista um serviço específico por ID
     * @param {string} id - ID do serviço
     * @returns {Object|null} Serviço específico
     */
    async listarPorId(id) {
        // Usa o findOne com o ID
        return await this.collection.findOne({ id: id });
    }

    // Os métodos alterar, deletar e buscar não são estritamente necessários para o MVP do usuário,
    // que é focado em autenticação e agendamento, mas vamos simplificar o listar().
}

module.exports = new Servico();
