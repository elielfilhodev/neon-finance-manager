# 🚀 Configuração PM2 - Backend Sempre Rodando

## O que é PM2?

PM2 é um gerenciador de processos para Node.js que mantém sua aplicação sempre rodando, mesmo após reinicializações do sistema.

## 📦 Instalação

```bash
npm install --save-dev pm2
```

Ou já está incluído nas dependências, então apenas:

```bash
npm install
```

## 🎯 Comandos Disponíveis

### Iniciar o servidor (e manter rodando)
```bash
npm run server:start
```

### Parar o servidor
```bash
npm run server:stop
```

### Reiniciar o servidor
```bash
npm run server:restart
```

### Ver logs em tempo real
```bash
npm run server:logs
```

### Ver status do servidor
```bash
npm run server:status
```

### Remover do PM2 (mas não parar o processo)
```bash
npm run server:delete
```

## 🔄 Configurar para iniciar automaticamente no boot

### Windows:
```bash
pm2 startup
pm2 save
```

### Linux/Mac:
```bash
pm2 startup
pm2 save
```

Isso fará com que o servidor inicie automaticamente quando o computador ligar!

## 📋 Comandos PM2 Úteis

```bash
# Ver todos os processos
pm2 list

# Ver informações detalhadas
pm2 show finance-manager-api

# Monitorar recursos (CPU, memória)
pm2 monit

# Limpar logs
pm2 flush

# Reiniciar todos os processos
pm2 restart all

# Parar todos os processos
pm2 stop all
```

## 🔍 Verificar se está rodando

O servidor estará disponível em `http://localhost:3001` (ou a porta configurada).

Você pode verificar se está rodando:
1. Executando `npm run server:status`
2. Acessando `http://localhost:3001/api/health`

## 🐛 Resolução de Problemas

### Servidor não inicia
```bash
# Ver logs de erro
npm run server:logs

# Ou
pm2 logs finance-manager-api --err
```

### Parar tudo e recomeçar
```bash
npm run server:delete
npm run server:start
```

### Ver processos PM2
```bash
pm2 list
```

## 💡 Dicas

1. **Logs**: Os logs ficam em `./logs/pm2-error.log` e `./logs/pm2-out.log`
2. **Auto-restart**: Se o servidor crashar, o PM2 reinicia automaticamente
3. **Memória**: Configurado para reiniciar se usar mais de 1GB de RAM
4. **Desenvolvimento**: Para desenvolvimento com hot-reload, continue usando `npm run server:dev`
5. **Produção**: Use `npm run server:start` para ambiente de produção

## ⚙️ Configuração

O arquivo `ecosystem.config.js` contém todas as configurações. Você pode ajustar:
- Número de instâncias
- Limite de memória
- Variáveis de ambiente
- E muito mais!

