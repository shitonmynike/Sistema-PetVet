const express = require('express');
const cors = require('cors');
const database = require('./src/config/database');
const routes = require('./src/routes');

/**
 * Servidor principal da aplicação PetVet
 */
class Server {
    constructor() {
        this.app = express();
        this.port = this.getPort();
        this.setupMiddlewares();
        this.setupRoutes();
    }

    /**
     * Determina a porta do servidor baseada no ambiente
     */
    getPort() {
        const env = process.env.AMBIENTE || process.env.NODE_ENV;
        return (env === 'DEV' || env === 'development') ? 3003 : (process.env.PORT || 80);
    }

    /**
     * Configura os middlewares da aplicação
     */
    setupMiddlewares() {
        // CORS - permitir requisições de diferentes origens
        this.app.use(cors({
            origin: process.env.FRONTEND_URL || '*',
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            allowedHeaders: ['Content-Type', 'Authorization']
        }));

        // Parser para JSON
        this.app.use(express.json({ limit: '10mb' }));
        
        // Parser para dados de formulário
        this.app.use(express.urlencoded({ 
            extended: true, 
            limit: '10mb' 
        }));

        // Middleware de log de requisições
        this.app.use((req, res, next) => {
            console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
            next();
        });
    }

    /**
     * Configura as rotas da aplicação
     */
    setupRoutes() {
        // Rotas da API
        this.app.use('/api', routes);

        // Rota de health check
        this.app.get('/health', (req, res) => {
            res.json({
                status: 'OK',
                timestamp: new Date().toISOString(),
                uptime: process.uptime()
            });
        });

        // Middleware de tratamento de erros
        this.app.use((error, req, res, next) => {
            console.error('Erro não tratado:', error);
            res.status(500).json({
                erro: 'Erro interno do servidor',
                timestamp: new Date().toISOString()
            });
        });
    }

    /**
     * Inicia o servidor
     */
    async start() {
        try {
            // Conectar ao banco de dados
            await database.connect();
            
            // Iniciar servidor HTTP
            this.app.listen(this.port, () => {
                console.log(`🚀 Servidor PetVet iniciado na porta ${this.port}`);
                console.log(`📊 Ambiente: ${process.env.AMBIENTE || 'production'}`);
                console.log(`🔗 API disponível em: http://localhost:${this.port}/api`);
                console.log(`❤️  Health check: http://localhost:${this.port}/health`);
            });

        } catch (error) {
            console.error('❌ Erro ao iniciar servidor:', error);
            process.exit(1);
        }
    }

    /**
     * Encerra o servidor graciosamente
     */
    async stop() {
        try {
            await database.close();
            console.log('🛑 Servidor encerrado graciosamente');
        } catch (error) {
            console.error('Erro ao encerrar servidor:', error);
        }
    }
}

// Criar e iniciar servidor
const server = new Server();

// Tratamento de sinais do sistema para encerramento gracioso
process.on('SIGTERM', () => server.stop());
process.on('SIGINT', () => server.stop());

// Iniciar servidor
server.start();

module.exports = server;
