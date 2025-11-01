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
    const type = searchParams.get('type');
    const categoryId = searchParams.get('categoryId');

    let queryText = `
      SELECT t.*, c.name as category_name, c.color as category_color, c.icon as category_icon
      FROM transactions t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.user_id = $1
    `;
    const params: any[] = [user.id];
    let paramIndex = 2;

    if (startDate) {
      queryText += ` AND t.date >= $${paramIndex}`;
      params.push(startDate);
      paramIndex++;
    }

    if (endDate) {
      queryText += ` AND t.date <= $${paramIndex}`;
      params.push(endDate);
      paramIndex++;
    }

    if (type) {
      queryText += ` AND t.type = $${paramIndex}`;
      params.push(type);
      paramIndex++;
    }

    if (categoryId) {
      queryText += ` AND t.category_id = $${paramIndex}`;
      params.push(categoryId);
      paramIndex++;
    }

    queryText += ' ORDER BY t.date DESC, t.created_at DESC';

    const result = await query(queryText, params);
    return NextResponse.json(result.rows);
  } catch (error: any) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar transações' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await initDatabase();
    
    const user = verifyToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { amount, description, type, date, category_id } = await request.json();

    if (!amount || !type || !date) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: amount, type, date' },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO transactions (user_id, category_id, amount, description, type, date)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [user.id, category_id || null, amount, description || null, type, date]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error: any) {
    console.error('Error creating transaction:', error);
    return NextResponse.json(
      { error: 'Erro ao criar transação' },
      { status: 500 }
    );
  }
}

