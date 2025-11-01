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
      'SELECT * FROM categories WHERE id = $1 AND user_id = $2',
      [params.id, user.id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Categoria não encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error: any) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar categoria' },
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

    const { name, type, color, icon } = await request.json();

    // Check if category exists and belongs to user
    const checkResult = await query(
      'SELECT * FROM categories WHERE id = $1 AND user_id = $2',
      [params.id, user.id]
    );

    if (checkResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Categoria não encontrada' },
        { status: 404 }
      );
    }

    const result = await query(
      `UPDATE categories
       SET name = $1, type = $2, color = $3, icon = $4
       WHERE id = $5 AND user_id = $6
       RETURNING *`,
      [
        name || checkResult.rows[0].name,
        type || checkResult.rows[0].type,
        color || checkResult.rows[0].color,
        icon !== undefined ? icon : checkResult.rows[0].icon,
        params.id,
        user.id,
      ]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error: any) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar categoria' },
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
      'DELETE FROM categories WHERE id = $1 AND user_id = $2 RETURNING *',
      [params.id, user.id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Categoria não encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Categoria deletada com sucesso' });
  } catch (error: any) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { error: 'Erro ao deletar categoria' },
      { status: 500 }
    );
  }
}

