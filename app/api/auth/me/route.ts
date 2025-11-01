import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { query, initDatabase } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    await initDatabase();
    
    const decoded = verifyToken(request);

    if (!decoded) {
      return NextResponse.json(
        { error: 'Token não fornecido ou inválido' },
        { status: 401 }
      );
    }

    const result = await query('SELECT id, email, name FROM users WHERE id = $1', [decoded.id]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user: result.rows[0] });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Token inválido' },
      { status: 401 }
    );
  }
}

