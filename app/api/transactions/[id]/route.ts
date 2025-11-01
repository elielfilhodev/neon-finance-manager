import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { query, initDatabase } from '@/lib/database';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await initDatabase();
    
    const user = verifyToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const result = await query(
      `SELECT t.*, c.name as category_name, c.color as category_color, c.icon as category_icon
       FROM transactions t
       LEFT JOIN categories c ON t.category_id = c.id
       WHERE t.id = $1 AND t.user_id = $2`,
      [params.id, user.id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Transação não encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error: any) {
    console.error('Error fetching transaction:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar transação' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await initDatabase();
    
    const user = verifyToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { amount, description, type, date, category_id } = await request.json();

    // Check if transaction exists and belongs to user
    const checkResult = await query(
      'SELECT * FROM transactions WHERE id = $1 AND user_id = $2',
      [params.id, user.id]
    );

    if (checkResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Transação não encontrada' },
        { status: 404 }
      );
    }

    const result = await query(
      `UPDATE transactions
       SET amount = $1, description = $2, type = $3, date = $4, category_id = $5
       WHERE id = $6 AND user_id = $7
       RETURNING *`,
      [
        amount || checkResult.rows[0].amount,
        description !== undefined ? description : checkResult.rows[0].description,
        type || checkResult.rows[0].type,
        date || checkResult.rows[0].date,
        category_id !== undefined ? category_id : checkResult.rows[0].category_id,
        params.id,
        user.id,
      ]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error: any) {
    console.error('Error updating transaction:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar transação' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await initDatabase();
    
    const user = verifyToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const result = await query(
      'DELETE FROM transactions WHERE id = $1 AND user_id = $2 RETURNING *',
      [params.id, user.id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Transação não encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Transação deletada com sucesso' });
  } catch (error: any) {
    console.error('Error deleting transaction:', error);
    return NextResponse.json(
      { error: 'Erro ao deletar transação' },
      { status: 500 }
    );
  }
}

