const express = require('express');
const router = express.Router();
const db = require('../database');

// GET /api/products
router.get('/', (req, res) => {
  const { search, category, low_stock } = req.query;
  let query = `
    SELECT p.*, c.name as category_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE 1=1
  `;
  const params = [];

  if (search) {
    query += ` AND (p.name LIKE ? OR p.sku LIKE ?)`;
    params.push(`%${search}%`, `%${search}%`);
  }
  if (category) {
    query += ` AND p.category_id = ?`;
    params.push(category);
  }
  if (low_stock === 'true') {
    query += ` AND p.stock <= p.low_stock_threshold`;
  }

  query += ` ORDER BY p.name`;
  const products = db.prepare(query).all(...params);
  res.json(products);
});

// GET /api/products/:id
router.get('/:id', (req, res) => {
  const product = db.prepare(`
    SELECT p.*, c.name as category_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.id = ?
  `).get(req.params.id);

  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

// POST /api/products
router.post('/', (req, res) => {
  const { name, sku, category_id, price, cost, stock, low_stock_threshold, unit } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Product name is required' });
  }
  try {
    const result = db.prepare(`
      INSERT INTO products (name, sku, category_id, price, cost, stock, low_stock_threshold, unit)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      name.trim(),
      sku || null,
      category_id || null,
      price || 0,
      cost || 0,
      stock || 0,
      low_stock_threshold || 5,
      unit || 'unit'
    );
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(product);
  } catch (err) {
    if (err.message.includes('UNIQUE constraint failed')) {
      return res.status(409).json({ error: 'SKU already exists' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/products/:id
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, sku, category_id, price, cost, stock, low_stock_threshold, unit } = req.body;

  const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ error: 'Product not found' });

  try {
    db.prepare(`
      UPDATE products
      SET name = ?, sku = ?, category_id = ?, price = ?, cost = ?,
          stock = ?, low_stock_threshold = ?, unit = ?, updated_at = datetime('now')
      WHERE id = ?
    `).run(
      name ?? existing.name,
      sku ?? existing.sku,
      category_id ?? existing.category_id,
      price ?? existing.price,
      cost ?? existing.cost,
      stock ?? existing.stock,
      low_stock_threshold ?? existing.low_stock_threshold,
      unit ?? existing.unit,
      id
    );
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    res.json(product);
  } catch (err) {
    if (err.message.includes('UNIQUE constraint failed')) {
      return res.status(409).json({ error: 'SKU already exists' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/products/:id
router.delete('/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Product not found' });

  db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
  res.status(204).send();
});

module.exports = router;
