const express = require('express');
const router = express.Router();

// Importar rotas específicas
const servicoRoutes = require('./servicoRoutes');
const authRoutes = require('./authRoutes');
const appointmentRoutes = require('./appointmentRoutes');

/**
 * Configuração central de rotas da API
 */

// Rota de teste da API
router.get('/', (req, res) => {
    res.json({
        mensagem: 'API PetVet funcionando!',
        versao: '1.0.0',
        timestamp: new Date().toISOString()
    });
});

// Rotas de serviços
router.use('/servicos', servicoRoutes);
router.use('/auth', authRoutes);
router.use('/appointments', appointmentRoutes);

// Middleware para rotas não encontradas
router.use('*', (req, res) => {
    res.status(404).json({
        erro: 'Rota não encontrada',
        metodo: req.method,
        url: req.originalUrl
    });
});

module.exports = router;
