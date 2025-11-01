# 🚀 Guia de Configuração Rápida

## Passo 1: Instalar Dependências
```bash
npm install
```

## Passo 2: Configurar Banco de Dados Neon

1. Acesse [https://neon.tech](https://neon.tech)
2. Crie uma conta gratuita
3. Crie um novo projeto
4. Copie a **Connection String** (DATABASE_URL)

## Passo 3: Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
DATABASE_URL=postgresql://usuario:senha@host.neon.tech/nome_do_banco?sslmode=require
JWT_SECRET=seu_jwt_secret_super_secreto_aqui_qualquer_string_longa
NEXT_PUBLIC_API_URL=http://localhost:3001
PORT=3001
NODE_ENV=development
```

**Importante:**
- Substitua `DATABASE_URL` pela sua connection string do Neon
- Crie um `JWT_SECRET` aleatório e seguro (pode ser qualquer string longa)
- Mantenha `NEXT_PUBLIC_API_URL` como `http://localhost:3001` para desenvolvimento

## Passo 4: Inicializar o Banco de Dados

O banco será inicializado automaticamente na primeira execução do servidor.

## Passo 5: Executar a Aplicação

Abra **dois terminais**:

**Terminal 1 - Backend:**
```bash
npm run server:dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

## Passo 6: Acessar a Aplicação

1. Acesse: http://localhost:3000
2. Faça login com:
   - **Email:** `admin@finance.com`
   - **Senha:** `admin123`

## ✅ Pronto!

Agora você pode começar a usar o dashboard financeiro!

### Primeiras Ações

1. Adicione algumas transações clicando em "Nova Transação"
2. Explore os gráficos e estatísticas
3. Crie categorias personalizadas (via API ou diretamente no banco)

## 🐛 Problemas Comuns

### Erro de conexão com o banco
- Verifique se a `DATABASE_URL` está correta
- Certifique-se de que o banco Neon está ativo

### Porta já em uso
- Altere a porta no `.env.local` (PORT=3002)
- Ou feche o processo que está usando a porta

### Erro de autenticação
- Limpe o localStorage do navegador
- Faça logout e login novamente

## 📞 Suporte

Se encontrar problemas, verifique:
1. Logs do servidor backend
2. Console do navegador (F12)
3. Se todas as dependências foram instaladas

