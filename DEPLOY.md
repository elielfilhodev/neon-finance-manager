# 🚀 Guia de Deploy no Vercel

## Passo 1: Configurar Variáveis de Ambiente no Vercel

1. Acesse seu projeto no Vercel
2. Vá em **Settings** → **Environment Variables**
3. Adicione as seguintes variáveis:

```
DATABASE_URL=sua_connection_string_do_neon
JWT_SECRET=uma_string_secreta_longa_e_aleatoria
NEXT_PUBLIC_API_URL=
```

**Importante:**
- `DATABASE_URL`: Use a connection string completa do Neon
- `JWT_SECRET`: Qualquer string longa e aleatória (ex: `my-secret-key-123456789`)
- `NEXT_PUBLIC_API_URL`: Deixe **VAZIO** (o Next.js usa rotas relativas `/api`)

## Passo 2: Fazer Deploy

### Opção 1: Via Git (Recomendado)
1. Faça commit e push do código:
```bash
git add .
git commit -m "Ready for Vercel deployment"
git push
```

2. O Vercel detectará automaticamente e fará o deploy

### Opção 2: Via Vercel CLI
```bash
npm i -g vercel
vercel
```

## Passo 3: Verificar o Deploy

1. Acesse a URL fornecida pelo Vercel
2. O banco será inicializado automaticamente na primeira requisição
3. Faça login com as credenciais padrão:
   - **Email:** `admin@finance.com`
   - **Senha:** `admin123`

## ⚠️ Problemas Comuns

### Erro 500 - Database Connection
- Verifique se `DATABASE_URL` está correta
- Certifique-se de que o Neon permite conexões externas
- Verifique se o SSL está habilitado no Neon

### Erro de Autenticação
- Limpe o localStorage do navegador
- Faça logout e login novamente

### Build Fails
- Verifique os logs de build no Vercel
- Certifique-se de que todas as dependências estão no `package.json`
- Verifique se não há erros de TypeScript

## ✅ Após o Deploy

1. O banco de dados será inicializado automaticamente
2. O usuário padrão será criado na primeira requisição
3. Todas as rotas da API estarão disponíveis em `/api/*`

## 📝 Notas

- As API Routes do Next.js funcionam como serverless functions no Vercel
- Não é necessário rodar um servidor separado
- O banco Neon suporta conexões serverless automaticamente
- A inicialização do banco acontece na primeira requisição (pode demorar alguns segundos)

