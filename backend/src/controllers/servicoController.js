const Servico = require('../models/Servico');

/**
 * Controlador para gerenciamento de serviços
 */
class ServicoController {
    
    /**
     * Cadastra um novo serviço
     */
    async cadastrar(req, res) {
        try {
            const dadosServico = req.body;
            
            // Validação básica
            if (!dadosServico.nome || !dadosServico.preco) {
                return res.status(400).json({
                    erro: 'Nome e preço são obrigatórios'
                });
            }

            const resultado = await Servico.cadastrar(dadosServico);
            
            res.status(201).json({
                sucesso: true,
                mensagem: 'Serviço cadastrado com sucesso',
                id: resultado.insertedId
            });

        } catch (error) {
            console.error('Erro ao cadastrar serviço:', error);
            res.status(500).json({
                erro: 'Erro interno do servidor ao cadastrar serviço'
            });
        }
    }

    /**
     * Lista todos os serviços
     */
    async listar(req, res) {
        try {
            const servicos = await Servico.listar();
            
            res.json({
                sucesso: true,
                dados: servicos,
                total: servicos.length
            });

        } catch (error) {
            console.error('Erro ao listar serviços:', error);
            res.status(500).json({
                erro: 'Erro interno do servidor ao listar serviços'
            });
        }
    }

    /**
     * Busca um serviço específico por ID
     */
    async buscarPorId(req, res) {
        try {
            const { id } = req.params;
            
            if (!id) {
                return res.status(400).json({
                    erro: 'ID do serviço é obrigatório'
                });
            }

            const servico = await Servico.listar(id);
            
            if (!servico) {
                return res.status(404).json({
                    erro: 'Serviço não encontrado'
                });
            }

            res.json({
                sucesso: true,
                dados: servico
            });

        } catch (error) {
            console.error('Erro ao buscar serviço:', error);
            res.status(500).json({
                erro: 'Erro interno do servidor ao buscar serviço'
            });
        }
    }

    /**
     * Atualiza um serviço existente
     */
    async atualizar(req, res) {
        try {
            const { id } = req.params;
            const novosDados = req.body;

            if (!id) {
                return res.status(400).json({
                    erro: 'ID do serviço é obrigatório'
                });
            }

            const resultado = await Servico.alterar(id, novosDados);
            
            if (resultado.matchedCount === 0) {
                return res.status(404).json({
                    erro: 'Serviço não encontrado'
                });
            }

            res.json({
                sucesso: true,
                mensagem: 'Serviço atualizado com sucesso'
            });

        } catch (error) {
            console.error('Erro ao atualizar serviço:', error);
            res.status(500).json({
                erro: 'Erro interno do servidor ao atualizar serviço'
            });
        }
    }

    /**
     * Remove um serviço
     */
    async deletar(req, res) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({
                    erro: 'ID do serviço é obrigatório'
                });
            }

            const resultado = await Servico.deletar(id);
            
            if (resultado.matchedCount === 0) {
                return res.status(404).json({
                    erro: 'Serviço não encontrado'
                });
            }

            res.json({
                sucesso: true,
                mensagem: 'Serviço removido com sucesso'
            });

        } catch (error) {
            console.error('Erro ao deletar serviço:', error);
            res.status(500).json({
                erro: 'Erro interno do servidor ao deletar serviço'
            });
        }
    }

    /**
     * Busca serviços por termo
     */
    async buscar(req, res) {
        try {
            const { termo } = req.query;

            if (!termo) {
                return res.status(400).json({
                    erro: 'Termo de busca é obrigatório'
                });
            }

            const servicos = await Servico.buscar(termo);
            
            res.json({
                sucesso: true,
                dados: servicos,
                total: servicos.length
            });

        } catch (error) {
            console.error('Erro ao buscar serviços:', error);
            res.status(500).json({
                erro: 'Erro interno do servidor ao buscar serviços'
            });
        }
    }
}

module.exports = new ServicoController();
