# PetVet - Sistema de Agendamento para Clínica Veterinária

**Slogan:** *Cuidando com amor, tratando com ciência*

## Sobre o Projeto

O PetVet é um sistema completo de gerenciamento para clínicas veterinárias, desenvolvido para facilitar o agendamento de consultas, cadastro de clientes, gerenciamento de serviços e controle da equipe profissional.

## Funcionalidades

### Dashboard Principal
- Visão geral dos agendamentos do dia
- Estatísticas em tempo real
- Acesso rápido às principais funcionalidades
- Informações de contato e horário de funcionamento

### Gerenciamento de Serviços
- Cadastro completo de serviços oferecidos
- Controle de preços e durações
- Categorização por tipos (consulta, preventivo, estético, cirurgia, diagnóstico, emergência)
- Associação com profissionais responsáveis
- Sistema de busca e filtros

### Agendamentos
- Sistema de agendamento intuitivo
- Controle de status (confirmado, aguardando, agendado, cancelado, concluído)
- Visualização por profissional e data
- Notificações e lembretes

### Cadastro de Clientes
- Informações completas dos tutores
- Histórico de pets
- Controle de consultas anteriores

### Equipe Profissional
- Cadastro de veterinários e auxiliares
- Especialidades e qualificações
- Controle de agenda individual

## Tecnologias Utilizadas

### Backend
- **Node.js** com Express.js
- **MongoDB** para banco de dados
- **CORS** para requisições cross-origin
- Arquitetura MVC (Model-View-Controller)

### Frontend
- **HTML5** semântico
- **Bootstrap 5** para interface responsiva
- **jQuery** para interações
- **Bootstrap Icons** para iconografia
- **CSS3** personalizado com variáveis CSS

## Estrutura do Projeto

```
petvet-reorganizado/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   │   └── servicoController.js
│   │   ├── models/
│   │   │   └── Servico.js
│   │   └── routes/
│   │       ├── index.js
│   │       └── servicoRoutes.js
│   ├── package.json
│   ├── server.js
│   └── .env.example
└── frontend/
    ├── css/
    │   └── petvet.css
    ├── js/
    │   ├── config.js
    │   ├── dashboard.js
    │   └── servicos.js
    ├── pages/
    │   └── servicos.html
    ├── assets/
    └── index.html
```

## Instalação e Configuração

### Pré-requisitos
- Node.js (versão 16 ou superior)
- MongoDB (local ou MongoDB Atlas)
- Git

### Backend

1. **Navegue para o diretório do backend:**
   ```bash
   cd petvet-reorganizado/backend
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**
   ```bash
   cp .env.example .env
   ```
   
   Edite o arquivo `.env` com suas configurações:
   ```env
   AMBIENTE=DEV
   NODE_ENV=development
   PORT=3003
   URL_MONGO=mongodb://localhost:27017
   DATABASE=petvet
   FRONTEND_URL=http://localhost:3000
   ```

4. **Inicie o servidor:**
   ```bash
   # Desenvolvimento
   npm run dev
   
   # Produção
   npm start
   ```

### Frontend

1. **Navegue para o diretório do frontend:**
   ```bash
   cd petvet-reorganizado/frontend
   ```

2. **Sirva os arquivos estáticos:**
   
   **Opção 1 - Servidor HTTP simples (Python):**
   ```bash
   python3 -m http.server 3000
   ```
   
   **Opção 2 - Live Server (VS Code):**
   - Instale a extensão "Live Server"
   - Clique com o botão direito em `index.html`
   - Selecione "Open with Live Server"

3. **Acesse a aplicação:**
   ```
   http://localhost:3000
   ```

## API Endpoints

### Serviços
- `GET /api/servicos` - Listar todos os serviços
- `GET /api/servicos/:id` - Buscar serviço por ID
- `GET /api/servicos/buscar?termo=...` - Buscar serviços por termo
- `POST /api/servicos` - Cadastrar novo serviço
- `PUT /api/servicos/:id` - Atualizar serviço
- `DELETE /api/servicos/:id` - Excluir serviço

### Health Check
- `GET /health` - Verificar status da API

## Configurações da PetVet

### Informações da Clínica
- **Nome:** PetVet - Clínica Veterinária
- **Slogan:** Cuidando com amor, tratando com ciência
- **Endereço:** Rua das Flores, 123 - Centro, São Paulo - SP
- **Telefone:** (11) 3456-7890
- **WhatsApp:** (11) 99876-5432
- **Email:** contato@petvet.com.br
- **Emergência 24h:** (11) 99999-0000

### Horário de Funcionamento
- **Segunda a Sexta:** 08:00 às 18:00
- **Sábado:** 08:00 às 14:00
- **Domingo:** Plantão 24h para emergências

### Equipe Profissional
- **Dr. Carlos Silva** - Clínico Geral (CRMV-SP 12345)
- **Dra. Ana Santos** - Cirurgiã (CRMV-SP 23456)
- **Dr. Roberto Lima** - Dermatologia Veterinária (CRMV-SP 34567)
- **Dra. Maria Oliveira** - Cardiologia Veterinária (CRMV-SP 45678)
- **João Pedro** - Auxiliar Veterinário
- **Carla Mendes** - Tosadora Profissional

## Recursos Implementados

### Interface do Usuário
- ✅ Design responsivo para desktop e mobile
- ✅ Tema personalizado com cores da marca
- ✅ Navegação intuitiva com sidebar
- ✅ Alertas e notificações
- ✅ Loading states e animações
- ✅ Tooltips e feedback visual

### Funcionalidades Backend
- ✅ API RESTful completa
- ✅ Validação de dados
- ✅ Tratamento de erros
- ✅ Soft delete para serviços
- ✅ Busca e filtros
- ✅ Conexão com MongoDB

### Funcionalidades Frontend
- ✅ Dashboard com estatísticas
- ✅ CRUD completo de serviços
- ✅ Sistema de busca em tempo real
- ✅ Modais para cadastro/edição
- ✅ Confirmação de exclusão
- ✅ Responsividade completa

## Próximas Implementações

### Funcionalidades Planejadas
- [ ] Sistema de agendamentos completo
- [ ] Cadastro de clientes e pets
- [ ] Gestão de profissionais
- [ ] Relatórios e estatísticas
- [ ] Sistema de notificações
- [ ] Integração com WhatsApp
- [ ] Sistema de login e autenticação
- [ ] Backup automático de dados

### Melhorias Técnicas
- [ ] Testes automatizados
- [ ] Docker para containerização
- [ ] CI/CD pipeline
- [ ] Monitoramento e logs
- [ ] Cache Redis
- [ ] Upload de imagens
- [ ] PWA (Progressive Web App)

## Contribuição

Para contribuir com o projeto:

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença ISC. Veja o arquivo `LICENSE` para mais detalhes.

## Suporte

Para suporte técnico ou dúvidas sobre o sistema:

- **Email:** contato@petvet.com.br
- **Telefone:** (11) 3456-7890
- **WhatsApp:** (11) 99876-5432

---

**PetVet** - *Cuidando com amor, tratando com ciência* 🐾❤️
