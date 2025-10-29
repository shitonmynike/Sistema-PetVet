const express = require('express');
const router = express.Router();
const servicoController = require('../controllers/servicoController');
const { protect } = require('../controllers/authController');

/**
 * Rotas para gerenciamento de serviços
 */

// POST /api/servicos - Cadastrar novo serviço
router.post('/', protect, servicoController.cadastrar);

// GET /api/servicos - Listar todos os serviços
router.get('/', servicoController.listar);

// GET /api/servicos/buscar?termo=... - Buscar serviços por termo
router.get('/buscar', servicoController.buscar);

// GET /api/servicos/:id - Buscar serviço por ID
router.get('/:id', servicoController.buscarPorId);

// PUT /api/servicos/:id - Atualizar serviço
router.put('/:id', protect, servicoController.atualizar);

// DELETE /api/servicos/:id - Deletar serviço
router.delete('/:id', protect, servicoController.deletar);

module.exports = router;
