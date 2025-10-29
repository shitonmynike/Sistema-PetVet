const fs = require('fs/promises');
const path = require('path');

const DB_PATH = path.resolve(__dirname, '..', '..', 'db.json');

/**
 * Estrutura inicial do banco de dados JSON
 */
const initialData = {
    users: [],
    appointments: [],
    services: [
        { id: 's1', name: 'Consulta Veterinária', description: 'Exame clínico completo.', price: 80.00 },
        { id: 's2', name: 'Vacinação', description: 'Aplicação de vacinas essenciais.', price: 50.00 },
        { id: 's3', name: 'Banho e Tosa', description: 'Serviço completo de higiene e estética.', price: 45.00 },
        { id: 's4', name: 'Exames Laboratoriais', description: 'Análises de sangue, urina e fezes.', price: 120.00 },
    ]
};

/**
 * Lê o conteúdo do banco de dados JSON.
 * Se o arquivo não existir, cria um com a estrutura inicial.
 * @returns {Promise<object>} O objeto de dados do banco.
 */
async function readDB() {
    try {
        const data = await fs.readFile(DB_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            // Arquivo não existe, cria um novo
            await writeDB(initialData);
            return initialData;
        }
        throw error;
    }
}

/**
 * Escreve o objeto de dados no arquivo JSON.
 * @param {object} data O objeto de dados a ser escrito.
 * @returns {Promise<void>}
 */
async function writeDB(data) {
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 4), 'utf-8');
}

/**
 * Classe para simular uma "Collection" do MongoDB.
 */
class Collection {
    constructor(collectionName) {
        this.collectionName = collectionName;
    }

    /**
     * Busca todos os documentos da coleção.
     * @returns {Promise<Array<object>>}
     */
    async find() {
        const db = await readDB();
        return db[this.collectionName] || [];
    }

    /**
     * Busca um documento por um critério (simplesmente compara a chave/valor).
     * @param {object} query - O critério de busca (ex: { email: 'user@example.com' }).
     * @returns {Promise<object|null>} O primeiro documento encontrado ou null.
     */
    async findOne(query) {
        const all = await this.find();
        // Assume que a query tem apenas uma chave/valor
        const [key, value] = Object.entries(query)[0];
        return all.find(item => item[key] === value) || null;
    }

    /**
     * Insere um novo documento na coleção.
     * @param {object} document - O documento a ser inserido.
     * @returns {Promise<object>} O documento inserido (com um ID, se não tiver).
     */
    async insertOne(document) {
        const db = await readDB();
        // Gera um ID simples baseado no timestamp
        const newDocument = { id: Date.now().toString(), ...document };
        db[this.collectionName].push(newDocument);
        await writeDB(db);
        return newDocument;
    }

    /**
     * Atualiza um documento.
     * @param {object} query - O critério de busca (ex: { id: '123' }).
     * @param {object} update - O objeto com os campos a serem atualizados.
     * @returns {Promise<object|null>} O documento atualizado ou null.
     */
    async updateOne(query, update) {
        const db = await readDB();
        const [key, value] = Object.entries(query)[0];
        const index = db[this.collectionName].findIndex(item => item[key] === value);

        if (index === -1) {
            return null;
        }

        const updatedDocument = { ...db[this.collectionName][index], ...update };
        db[this.collectionName][index] = updatedDocument;
        await writeDB(db);
        return updatedDocument;
    }
}

/**
 * Classe para manter a compatibilidade com o código original que espera um objeto Database.
 */
class Database {
    constructor() {
        this.Collection = Collection;
    }
    
    /**
     * Função de conexão simulada (não faz nada, apenas para compatibilidade).
     */
    async connect() {
        console.log('✅ Banco de dados JSON inicializado com sucesso.');
        await readDB(); // Garante que o arquivo db.json existe
    }

    /**
     * Função de fechamento simulada.
     */
    async close() {
        console.log('❌ Conexão com banco de dados JSON encerrada.');
    }

    /**
     * Retorna uma nova instância de Collection para a coleção especificada.
     */
    getCollection(name) {
        return new Collection(name);
    }
}

// Exporta a função de conexão e a classe Collection
module.exports = new Database();
