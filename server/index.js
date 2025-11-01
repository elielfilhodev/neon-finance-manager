const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load .env.local first, then .env (BEFORE importing database)
const envLocalPath = path.resolve(process.cwd(), '.env.local');
const envPath = path.resolve(process.cwd(), '.env');

// Load .env.local first (if exists)
const resultLocal = dotenv.config({ path: envLocalPath });
if (resultLocal.error && resultLocal.error.code !== 'ENOENT') {
  console.warn('⚠️ Aviso ao carregar .env.local:', resultLocal.error.message);
}

// Load .env (if exists) - won't override .env.local values
const result = dotenv.config({ path: envPath });
if (result.error && result.error.code !== 'ENOENT') {
  console.warn('⚠️ Aviso ao carregar .env:', result.error.message);
}

// Verify DATABASE_URL is loaded
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL não encontrada após carregar arquivos .env');
  console.error('Verifique se o arquivo .env.local existe e contém DATABASE_URL');
  process.exit(1);
}

// Now import routes and database (after env is loaded)
const authRoutes = require('./routes/auth');
const transactionsRoutes = require('./routes/transactions');
const categoriesRoutes = require('./routes/categories');
const dashboardRoutes = require('./routes/dashboard');
const db = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Finance Manager API is running' });
});

// Initialize database and start server
async function startServer() {
  try {
    await db.init();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

