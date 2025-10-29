const database = require('../config/database');
const bcrypt = require('bcryptjs');

/**
 * Modelo para gerenciamento de usuários
 */
class User {
    constructor() {
        this.collection = database.getCollection('users');
    }

    /**
     * Cadastra um novo usuário
     * @param {Object} userData - Dados do usuário (email, password, name)
     * @returns {Object} O usuário cadastrado (sem a senha)
     */
    async register(userData) {
        // 1. Verifica se o usuário já existe
        const existingUser = await this.collection.findOne({ email: userData.email });
        if (existingUser) {
            throw new Error('Usuário já cadastrado com este e-mail.');
        }

        // 2. Hash da senha
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userData.password, salt);

        // 3. Cria o objeto do novo usuário
        const newUser = {
            name: userData.name,
            email: userData.email,
            password: hashedPassword, // Armazena o hash
            createdAt: new Date().toISOString()
        };

        // 4. Insere no banco de dados
        const result = await this.collection.insertOne(newUser);

        // 5. Retorna o usuário sem a senha
        const { password, ...userWithoutPassword } = result;
        return userWithoutPassword;
    }

    /**
     * Autentica um usuário
     * @param {string} email - E-mail do usuário
     * @param {string} password - Senha em texto puro
     * @returns {Object|null} O usuário autenticado (sem a senha) ou null
     */
    async login(email, password) {
        // 1. Busca o usuário pelo e-mail
        const user = await this.collection.findOne({ email });
        if (!user) {
            return null; // Usuário não encontrado
        }

        // 2. Compara a senha fornecida com o hash armazenado
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return null; // Senha incorreta
        }

        // 3. Retorna o usuário sem a senha
        const { password: userPassword, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
}

module.exports = new User();
