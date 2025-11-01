import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

// Validate DATABASE_URL
if (!process.env.DATABASE_URL) {
  console.error('❌ ERRO: DATABASE_URL não está configurada!');
  console.error('Por favor, configure a variável DATABASE_URL nas variáveis de ambiente');
  throw new Error('DATABASE_URL is required');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

let isInitialized = false;

export async function initDatabase() {
  if (isInitialized) {
    return;
  }

  try {
    // Create tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense')),
        color VARCHAR(7) NOT NULL,
        icon VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
        amount DECIMAL(10, 2) NOT NULL,
        description TEXT,
        type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense')),
        date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create default user if not exists
    const defaultEmail = 'admin@finance.com';
    const defaultPassword = 'admin123';
    const defaultName = 'Administrador';

    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [defaultEmail]);
    
    if (userResult.rows.length === 0) {
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);
      await pool.query(
        'INSERT INTO users (email, password, name) VALUES ($1, $2, $3)',
        [defaultEmail, hashedPassword, defaultName]
      );

      const newUser = await pool.query('SELECT id FROM users WHERE email = $1', [defaultEmail]);
      const userId = newUser.rows[0].id;

      // Create default categories
      const defaultCategories = [
        { name: 'Salário', type: 'income', color: '#10b981', icon: 'dollar-sign' },
        { name: 'Freelance', type: 'income', color: '#3b82f6', icon: 'briefcase' },
        { name: 'Investimentos', type: 'income', color: '#8b5cf6', icon: 'trending-up' },
        { name: 'Alimentação', type: 'expense', color: '#ef4444', icon: 'utensils' },
        { name: 'Transporte', type: 'expense', color: '#f59e0b', icon: 'car' },
        { name: 'Moradia', type: 'expense', color: '#6366f1', icon: 'home' },
        { name: 'Lazer', type: 'expense', color: '#ec4899', icon: 'smile' },
        { name: 'Saúde', type: 'expense', color: '#14b8a6', icon: 'heart' },
      ];

      for (const category of defaultCategories) {
        await pool.query(
          'INSERT INTO categories (user_id, name, type, color, icon) VALUES ($1, $2, $3, $4, $5)',
          [userId, category.name, category.type, category.color, category.icon]
        );
      }
    }

    isInitialized = true;
  } catch (error) {
    console.error('Database initialization error:', error);
    // Don't throw, just log - allow the app to continue
  }
}

export { pool };
export const query = (text: string, params?: any[]) => pool.query(text, params);

