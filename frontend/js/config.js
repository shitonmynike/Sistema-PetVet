/**
 * Configurações e informações da PetVet
 */
const PETVET_CONFIG = {
    // Informações básicas da clínica
    nome: "PetVet - Clínica Veterinária",
    slogan: "Cuidando com amor, tratando com ciência",
    
    // Contato
    contato: {
        endereco: {
            rua: "Rua das Flores, 123",
            bairro: "Centro",
            cidade: "São Paulo",
            cep: "01234-567",
            completo: "Rua das Flores, 123 - Centro, São Paulo - SP, CEP: 01234-567"
        },
        telefones: {
            principal: "(11) 3456-7890",
            whatsapp: "(11) 99876-5432",
            emergencia: "(11) 99999-0000"
        },
        email: "contato@petvet.com.br",
        site: "www.petvet.com.br"
    },

    // Horário de funcionamento
    horarios: {
        segunda_sexta: "08:00 às 18:00",
        sabado: "08:00 às 14:00",
        domingo: "Plantão 24h para emergências",
        emergencia: "24 horas todos os dias"
    },

    // Serviços oferecidos
    servicos: [
        {
            nome: "Consulta Veterinária",
            descricao: "Consulta clínica geral com veterinário especializado",
            preco: 80.00,
            duracao: "30 min",
            tipo: "consulta"
        },
        {
            nome: "Vacinação",
            descricao: "Aplicação de vacinas V8, V10, antirrábica e outras",
            preco: 45.00,
            duracao: "15 min",
            tipo: "preventivo"
        },
        {
            nome: "Banho e Tosa",
            descricao: "Banho completo com produtos especializados e tosa higiênica",
            preco: 35.00,
            duracao: "60 min",
            tipo: "estetico"
        },
        {
            nome: "Cirurgia",
            descricao: "Procedimentos cirúrgicos diversos com anestesia",
            preco: 300.00,
            duracao: "120 min",
            tipo: "cirurgia"
        },
        {
            nome: "Exames Laboratoriais",
            descricao: "Hemograma, bioquímico, parasitológico e outros",
            preco: 120.00,
            duracao: "15 min",
            tipo: "diagnostico"
        },
        {
            nome: "Castração",
            descricao: "Cirurgia de castração para cães e gatos",
            preco: 250.00,
            duracao: "90 min",
            tipo: "cirurgia"
        },
        {
            nome: "Emergência 24h",
            descricao: "Atendimento de urgência e emergência",
            preco: 150.00,
            duracao: "Variável",
            tipo: "emergencia"
        },
        {
            nome: "Limpeza Dentária",
            descricao: "Profilaxia e tratamento odontológico",
            preco: 180.00,
            duracao: "45 min",
            tipo: "preventivo"
        }
    ],

    // Equipe profissional
    equipe: [
        {
            nome: "Dr. Carlos Silva",
            especialidade: "Clínico Geral",
            crmv: "CRMV-SP 12345",
            experiencia: "15 anos",
            foto: "assets/team/dr-carlos.jpg"
        },
        {
            nome: "Dra. Ana Santos",
            especialidade: "Cirurgiã",
            crmv: "CRMV-SP 23456",
            experiencia: "12 anos",
            foto: "assets/team/dra-ana.jpg"
        },
        {
            nome: "Dr. Roberto Lima",
            especialidade: "Dermatologia Veterinária",
            crmv: "CRMV-SP 34567",
            experiencia: "10 anos",
            foto: "assets/team/dr-roberto.jpg"
        },
        {
            nome: "Dra. Maria Oliveira",
            especialidade: "Cardiologia Veterinária",
            crmv: "CRMV-SP 45678",
            experiencia: "8 anos",
            foto: "assets/team/dra-maria.jpg"
        },
        {
            nome: "João Pedro",
            especialidade: "Auxiliar Veterinário",
            registro: "AUX-001",
            experiencia: "5 anos",
            foto: "assets/team/joao.jpg"
        },
        {
            nome: "Carla Mendes",
            especialidade: "Tosadora Profissional",
            registro: "TOSA-002",
            experiencia: "7 anos",
            foto: "assets/team/carla.jpg"
        }
    ],

    // Redes sociais
    redesSociais: {
        instagram: "@petvet_clinica",
        facebook: "PetVet Clínica Veterinária",
        whatsapp: "5511998765432"
    },

    // Missão, visão e valores
    sobre: {
        missao: "Proporcionar cuidados veterinários de excelência, promovendo a saúde e bem-estar dos animais com amor, dedicação e tecnologia de ponta.",
        visao: "Ser referência em medicina veterinária, reconhecida pela qualidade dos serviços e pelo carinho no atendimento aos pets e seus tutores.",
        valores: [
            "Amor pelos animais",
            "Excelência profissional",
            "Ética e transparência",
            "Inovação e tecnologia",
            "Respeito aos tutores",
            "Responsabilidade social"
        ]
    },

    // Configurações técnicas
    api: {
        baseUrl: location.hostname === "localhost" ? "http://localhost:3003/api" : "https://petvet-back-sjv0.onrender.com/api"
    }
};

// Disponibilizar globalmente
window.PETVET_CONFIG = PETVET_CONFIG;
