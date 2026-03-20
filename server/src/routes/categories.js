const express = require('express');
const router = express.Router();
const db = require('../database');

// GET /api/categories
router.get('/', (req, res) => {
  const categories = db.prepare('SELECT * FROM categories ORDER BY name').all();
  res.json(categories);
});

// POST /api/categories
router.post('/', (req, res) => {
  const { name } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Category name is required' });
  }
  try {
    const result = db.prepare('INSERT INTO categories (name) VALUES (?)').run(name.trim());
    const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(category);
  } catch (err) {
    if (err.message.includes('UNIQUE constraint failed')) {
      return res.status(409).json({ error: 'Category already exists' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/categories/:id
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const inUse = db.prepare('SELECT COUNT(*) as count FROM products WHERE category_id = ?').get(id);
  if (inUse.count > 0) {
    return res.status(409).json({ error: 'Category is in use by products' });
  }
  db.prepare('DELETE FROM categories WHERE id = ?').run(id);
  res.status(204).send();
});

module.exports = router;
