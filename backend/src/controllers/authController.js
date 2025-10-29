const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Chave secreta simples para o JWT (em um projeto real, deve ser uma variável de ambiente forte)
const JWT_SECRET = process.env.JWT_SECRET || 'secreto_muito_secreto';

/**
 * Gera um token JWT para o usuário
 * @param {Object} user - Objeto do usuário (sem a senha)
 * @returns {string} Token JWT
 */
const generateToken = (user) => {
    return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: '1h', // Token expira em 1 hora
    });
};

/**
 * Controlador para registro de novos usuários
 */
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ erro: 'Todos os campos são obrigatórios: nome, email e senha.' });
        }

        const user = await User.register({ name, email, password });
        const token = generateToken(user);

        return res.status(201).json({ 
            mensagem: 'Usuário registrado com sucesso.',
            token,
            user: user
        });
    } catch (error) {
        if (error.message.includes('Usuário já cadastrado')) {
            return res.status(409).json({ erro: error.message });
        }
        console.error('Erro no registro:', error);
        return res.status(500).json({ erro: 'Erro interno do servidor ao registrar usuário.' });
    }
};

/**
 * Controlador para login de usuários
 */
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ erro: 'E-mail e senha são obrigatórios.' });
        }

        const user = await User.login(email, password);

        if (!user) {
            return res.status(401).json({ erro: 'Credenciais inválidas.' });
        }

        const token = generateToken(user);

        return res.status(200).json({ 
            mensagem: 'Login realizado com sucesso.',
            token,
            user: user
        });
    } catch (error) {
        console.error('Erro no login:', error);
        return res.status(500).json({ erro: 'Erro interno do servidor ao realizar login.' });
    }
};

/**
 * Middleware para proteger rotas
 */
exports.protect = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ erro: 'Acesso negado. Token não fornecido ou mal formatado.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Adiciona os dados do usuário ao request
        next();
    } catch (error) {
        console.error('Erro na verificação do token:', error);
        return res.status(401).json({ erro: 'Token inválido ou expirado.' });
    }
};
