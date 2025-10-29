const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { protect } = require('../controllers/authController');

/**
 * Rotas para gerenciamento de atendimentos (agendamentos)
 */

// POST /api/appointments - Cadastrar novo atendimento (requer autenticação)
router.post('/', protect, appointmentController.cadastrar);

// GET /api/appointments/me - Listar atendimentos do usuário logado (requer autenticação)
router.get('/me', protect, appointmentController.listarMeusAtendimentos);

module.exports = router;
