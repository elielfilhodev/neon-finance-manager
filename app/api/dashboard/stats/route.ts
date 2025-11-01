import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { query, initDatabase } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    await initDatabase();
    
    const user = verifyToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    let dateFilter = '';
    const params: any[] = [user.id];
    let paramIndex = 2;

    if (startDate && endDate) {
      dateFilter = `AND date BETWEEN $${paramIndex} AND $${paramIndex + 1}`;
      params.push(startDate, endDate);
      paramIndex += 2;
    }

    // Total income
    const incomeResult = await query(
      `SELECT COALESCE(SUM(amount), 0) as total
       FROM transactions
       WHERE user_id = $1 AND type = 'income' ${dateFilter}`,
      params
    );

    // Total expenses
    const expenseResult = await query(
      `SELECT COALESCE(SUM(amount), 0) as total
       FROM transactions
       WHERE user_id = $1 AND type = 'expense' ${dateFilter}`,
      params
    );

    // Transactions count
    const countResult = await query(
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
    const categoryParams: any[] = [user.id];
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
    const categoryResult = await query(categoryQuery, categoryParams);

    // Monthly transactions (last 6 months)
    const monthlyResult = await query(
      `SELECT 
         DATE_TRUNC('month', date) as month,
         type,
         COALESCE(SUM(amount), 0) as total
       FROM transactions
       WHERE user_id = $1 AND date >= NOW() - INTERVAL '6 months'
       GROUP BY DATE_TRUNC('month', date), type
       ORDER BY month DESC, type`,
      [user.id]
    );

    const income = parseFloat(incomeResult.rows[0].total);
    const expenses = parseFloat(expenseResult.rows[0].total);
    const balance = income - expenses;

    return NextResponse.json({
      income,
      expenses,
      balance,
      transactionsCount: parseInt(countResult.rows[0].count),
      byCategory: categoryResult.rows,
      monthly: monthlyResult.rows,
    });
  } catch (error: any) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar estatísticas' },
      { status: 500 }
    );
  }
}

