# 💰 Finance Manager - Dashboard Financeiro

Um dashboard moderno e responsivo para gestão de finanças pessoais, desenvolvido com Next.js, Node.js e Neon Database.

## 🚀 Funcionalidades

- ✅ Sistema de autenticação com login pré-cadastrado
- 📊 Dashboard com estatísticas financeiras (receitas, despesas, saldo)
- 📈 Gráficos interativos (linha e pizza) para análise visual
- 💸 CRUD completo de transações financeiras
- 🏷️ Gerenciamento de categorias personalizadas
- 📱 Design totalmente responsivo (mobile, tablet, desktop)
- 🌓 Suporte a tema claro/escuro
- 🔒 Autenticação JWT segura

## 🛠️ Tecnologias

### Frontend
- **Next.js 14** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Recharts** - Gráficos interativos
- **Lucide React** - Ícones modernos

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **PostgreSQL** (Neon) - Banco de dados
- **JWT** - Autenticação
- **bcryptjs** - Hash de senhas

## 📋 Pré-requisitos

- Node.js 18+ instalado
- Conta no [Neon Database](https://neon.tech) ou qualquer PostgreSQL
- npm ou yarn

## ⚙️ Instalação

1. **Clone o repositório** (ou use os arquivos criados)

2. **Instale as dependências:**
```bash
npm install
```

3. **Configure as variáveis de ambiente:**
   - Crie um arquivo `.env.local` na raiz do projeto:
```env
DATABASE_URL=your_neon_database_url
JWT_SECRET=your_super_secret_jwt_key_here
NEXT_PUBLIC_API_URL=http://localhost:3001
PORT=3001
```

4. **Execute o banco de dados:**
   - O banco será inicializado automaticamente na primeira execução
   - As tabelas e usuário padrão serão criados automaticamente

## 🚀 Execução

### Desenvolvimento

Em **dois terminais separados**:

**Terminal 1 - Backend:**
```bash
npm run server:dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### Produção

**Backend:**
```bash
npm run build
npm run server
```

**Frontend:**
```bash
npm run build
npm start
```

## 👤 Credenciais Padrão

O sistema cria automaticamente um usuário padrão na primeira execução:

- **Email:** `admin@finance.com`
- **Senha:** `admin123`

## 📁 Estrutura do Projeto

```
finance-manager/
├── app/                    # Next.js App Router
│   ├── components/         # Componentes React
│   ├── login/             # Página de login
│   ├── providers/         # Context providers
│   └── utils/             # Utilitários
├── server/                 # Backend Node.js
│   ├── config/            # Configurações (DB)
│   ├── middleware/        # Middlewares (auth)
│   └── routes/            # Rotas da API
├── package.json
└── README.md
```

## 🔌 API Endpoints

### Autenticação
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Usuário atual

### Transações
- `GET /api/transactions` - Listar transações
- `GET /api/transactions/:id` - Buscar transação
- `POST /api/transactions` - Criar transação
- `PUT /api/transactions/:id` - Atualizar transação
- `DELETE /api/transactions/:id` - Deletar transação

### Categorias
- `GET /api/categories` - Listar categorias
- `POST /api/categories` - Criar categoria
- `PUT /api/categories/:id` - Atualizar categoria
- `DELETE /api/categories/:id` - Deletar categoria

### Dashboard
- `GET /api/dashboard/stats` - Estatísticas do dashboard

## 🎨 Features do Design

- **Responsivo:** Funciona perfeitamente em mobile, tablet e desktop
- **Moderno:** UI limpa e intuitiva
- **Acessível:** Navegação fácil e clara
- **Performance:** Carregamento rápido e otimizado

## 🔒 Segurança

- Senhas são hasheadas com bcrypt
- Autenticação via JWT tokens
- Validação de dados no backend
- Proteção contra SQL injection (usando parâmetros preparados)

## 📝 Notas

- O banco de dados Neon oferece um plano gratuito perfeito para desenvolvimento
- A primeira execução pode demorar um pouco para criar as tabelas
- Certifique-se de configurar corretamente a `DATABASE_URL` do Neon

## 🤝 Contribuições

Sinta-se livre para contribuir com melhorias!

## 📄 Licença

Este projeto está sob a licença MIT.

---

Desenvolvido com ❤️ para ajudar na gestão financeira pessoal

