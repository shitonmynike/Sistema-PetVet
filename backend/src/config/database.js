const { MongoClient } = require('mongodb');

/**
 * Configuração de conexão com MongoDB
 */
class Database {
    constructor() {
        this.url = process.env.URL_MONGO || 'mongodb://localhost:27017';
        this.databaseName = process.env.DATABASE || 'petvet';
        this.client = null;
        this.db = null;
    }

    /**
     * Conecta ao banco de dados MongoDB
     */
    async connect() {
        try {
            this.client = new MongoClient(this.url);
            await this.client.connect();
            this.db = this.client.db(this.databaseName);
            console.log(`Conectado ao MongoDB: ${this.databaseName}`);
            return this.db;
        } catch (error) {
            console.error('Erro ao conectar ao MongoDB:', error);
            throw error;
        }
    }

    /**
     * Retorna a instância do banco de dados
     */
    getDatabase() {
        if (!this.db) {
            throw new Error('Banco de dados não conectado. Execute connect() primeiro.');
        }
        return this.db;
    }

    /**
     * Fecha a conexão com o banco de dados
     */
    async close() {
        if (this.client) {
            await this.client.close();
            console.log('Conexão com MongoDB fechada');
        }
    }
}

module.exports = new Database();
