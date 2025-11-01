const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const db = require('../config/database');

const router = express.Router();

// Get all categories
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { type } = req.query;
    let query = 'SELECT * FROM categories WHERE user_id = $1';
    const params = [req.user.id];

    if (type) {
      query += ' AND type = $2';
      params.push(type);
    }

    query += ' ORDER BY name ASC';

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Erro ao buscar categorias' });
  }
});

// Get category by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM categories WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Categoria não encontrada' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ error: 'Erro ao buscar categoria' });
  }
});

// Create category
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, type, color, icon } = req.body;

    if (!name || !type || !color) {
      return res.status(400).json({ error: 'Campos obrigatórios: name, type, color' });
    }

    if (type !== 'income' && type !== 'expense') {
      return res.status(400).json({ error: 'Tipo deve ser "income" ou "expense"' });
    }

    const result = await db.query(
      'INSERT INTO categories (user_id, name, type, color, icon) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [req.user.id, name, type, color, icon || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ error: 'Erro ao criar categoria' });
  }
});

// Update category
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { name, type, color, icon } = req.body;

    // Check if category exists and belongs to user
    const checkResult = await db.query(
      'SELECT * FROM categories WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Categoria não encontrada' });
    }

    const result = await db.query(
      `UPDATE categories
       SET name = $1, type = $2, color = $3, icon = $4
       WHERE id = $5 AND user_id = $6
       RETURNING *`,
      [
        name || checkResult.rows[0].name,
        type || checkResult.rows[0].type,
        color || checkResult.rows[0].color,
        icon !== undefined ? icon : checkResult.rows[0].icon,
        req.params.id,
        req.user.id,
      ]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ error: 'Erro ao atualizar categoria' });
  }
});

// Delete category
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const result = await db.query(
      'DELETE FROM categories WHERE id = $1 AND user_id = $2 RETURNING *',
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Categoria não encontrada' });
    }

    res.json({ message: 'Categoria deletada com sucesso' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Erro ao deletar categoria' });
  }
});

module.exports = router;

