const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const db = require('../config/database');

const router = express.Router();

// Get dashboard statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let dateFilter = '';
    const params = [req.user.id];
    let paramIndex = 2;

    if (startDate && endDate) {
      dateFilter = `AND date BETWEEN $${paramIndex} AND $${paramIndex + 1}`;
      params.push(startDate, endDate);
      paramIndex += 2;
    }

    // Total income
    const incomeResult = await db.query(
      `SELECT COALESCE(SUM(amount), 0) as total
       FROM transactions
       WHERE user_id = $1 AND type = 'income' ${dateFilter}`,
      params
    );

    // Total expenses
    const expenseResult = await db.query(
      `SELECT COALESCE(SUM(amount), 0) as total
       FROM transactions
       WHERE user_id = $1 AND type = 'expense' ${dateFilter}`,
      params
    );

    // Transactions count
    const countResult = await db.query(
      `SELECT COUNT(*) as count FROM transactions WHERE user_id = $1 ${dateFilter}`,
      params
    );

    // Transactions by category
    let categoryQuery = `
      SELECT 
         c.id,
         c.name,
         c.color,
         c.icon,
         c.type,
         COALESCE(SUM(t.amount), 0) as total
       FROM categories c
       LEFT JOIN transactions t ON c.id = t.category_id AND t.user_id = $1
    `;
    const categoryParams = [req.user.id];
    if (dateFilter) {
      categoryQuery += ` AND t.date BETWEEN $2 AND $3`;
      categoryParams.push(...params.slice(1));
    }
    categoryQuery += `
       WHERE c.user_id = $1
       GROUP BY c.id, c.name, c.color, c.icon, c.type
       HAVING COALESCE(SUM(t.amount), 0) > 0
       ORDER BY total DESC
    `;
    const categoryResult = await db.query(categoryQuery, categoryParams);

    // Monthly transactions (last 6 months)
    const monthlyResult = await db.query(
      `SELECT 
         DATE_TRUNC('month', date) as month,
         type,
         COALESCE(SUM(amount), 0) as total
       FROM transactions
       WHERE user_id = $1 AND date >= NOW() - INTERVAL '6 months'
       GROUP BY DATE_TRUNC('month', date), type
       ORDER BY month DESC, type`,
      [req.user.id]
    );

    const income = parseFloat(incomeResult.rows[0].total);
    const expenses = parseFloat(expenseResult.rows[0].total);
    const balance = income - expenses;

    res.json({
      income,
      expenses,
      balance,
      transactionsCount: parseInt(countResult.rows[0].count),
      byCategory: categoryResult.rows,
      monthly: monthlyResult.rows,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Erro ao buscar estatísticas' });
  }
});

module.exports = router;

