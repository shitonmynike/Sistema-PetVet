const { ObjectId } = require('mongodb');
const database = require('../config/database');

/**
 * Modelo para gerenciamento de serviços da clínica veterinária
 */
class Servico {
    constructor() {
        this.collection = null;
    }

    /**
     * Inicializa a coleção de serviços
     */
    async init() {
        const db = database.getDatabase();
        this.collection = db.collection('servicos');
    }

    /**
     * Cadastra um novo serviço
     * @param {Object} dados - Dados do serviço (nome, descricao, preco, duracao)
     * @returns {Object} Resultado da inserção
     */
    async cadastrar(dados) {
        await this.init();
        
        const servicoData = {
            ...dados,
            preco: parseFloat(dados.preco),
            data_cadastro: new Date(),
            ativo: true
        };

        return await this.collection.insertOne(servicoData);
    }

    /**
     * Lista todos os serviços ou um serviço específico por ID
     * @param {string|null} id - ID do serviço (opcional)
     * @returns {Array|Object} Lista de serviços ou serviço específico
     */
    async listar(id = null) {
        await this.init();

        if (!id) {
            const cursor = this.collection.find({ ativo: true });
            return await cursor.toArray();
        } else {
            return await this.collection.findOne({ 
                _id: new ObjectId(id),
                ativo: true 
            });
        }
    }

    /**
     * Atualiza um serviço existente
     * @param {string} id - ID do serviço
     * @param {Object} novosDados - Novos dados do serviço
     * @returns {Object} Resultado da atualização
     */
    async alterar(id, novosDados) {
        await this.init();

        const dadosAtualizacao = {
            ...novosDados,
            preco: parseFloat(novosDados.preco),
            data_alteracao: new Date()
        };

        const filtro = { _id: new ObjectId(id) };
        const atualizacao = { $set: dadosAtualizacao };

        return await this.collection.updateOne(filtro, atualizacao);
    }

    /**
     * Remove um serviço (soft delete)
     * @param {string} id - ID do serviço
     * @returns {Object} Resultado da remoção
     */
    async deletar(id) {
        await this.init();

        const filtro = { _id: new ObjectId(id) };
        const atualizacao = { 
            $set: { 
                ativo: false,
                data_exclusao: new Date()
            }
        };

        return await this.collection.updateOne(filtro, atualizacao);
    }

    /**
     * Busca serviços por nome ou descrição
     * @param {string} termo - Termo de busca
     * @returns {Array} Lista de serviços encontrados
     */
    async buscar(termo) {
        await this.init();

        const regex = new RegExp(termo, 'i');
        const cursor = this.collection.find({
            ativo: true,
            $or: [
                { nome: regex },
                { descricao: regex }
            ]
        });

        return await cursor.toArray();
    }
}

module.exports = new Servico();
