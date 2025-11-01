# ✅ Configuração para Vercel - RESUMO RÁPIDO

## 🔧 Variáveis de Ambiente Necessárias

No painel do Vercel (Settings → Environment Variables), adicione:

```
DATABASE_URL=sua_connection_string_do_neon_aqui
JWT_SECRET=qualquer_string_longa_e_secreta
NEXT_PUBLIC_API_URL=
```

⚠️ **IMPORTANTE:** Deixe `NEXT_PUBLIC_API_URL` **VAZIO** - o Next.js usa rotas relativas!

## 🚀 O que foi alterado?

1. ✅ Backend migrado para **API Routes do Next.js** (serverless functions)
2. ✅ Todas as rotas agora estão em `app/api/*`
3. ✅ Banco de dados inicializa automaticamente na primeira requisição
4. ✅ Não precisa mais de servidor Express separado no Vercel

## 📁 Estrutura das APIs

- `/api/auth/login` - POST
- `/api/auth/me` - GET
- `/api/transactions` - GET, POST
- `/api/transactions/[id]` - GET, PUT, DELETE
- `/api/categories` - GET, POST
- `/api/categories/[id]` - GET, PUT, DELETE
- `/api/dashboard/stats` - GET

## 🐛 Se ainda estiver dando erro:

1. **Verifique as variáveis de ambiente** - especialmente `DATABASE_URL`
2. **Verifique os logs** no Vercel (Deployments → View Function Logs)
3. **Aguarde alguns segundos** - a primeira inicialização pode demorar
4. **Limpe o cache** do navegador e localStorage

## 💡 Dica

O servidor Express ainda existe em `server/` para desenvolvimento local, mas no Vercel usamos apenas as API Routes do Next.js!

