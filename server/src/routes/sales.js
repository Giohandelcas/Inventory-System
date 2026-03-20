const express = require('express');
const router = express.Router();
const db = require('../database');

// GET /api/sales
router.get('/', (req, res) => {
  const { limit = 50 } = req.query;
  const sales = db.prepare(`
    SELECT s.*, p.name as product_name
    FROM sales s
    JOIN products p ON s.product_id = p.id
    ORDER BY s.sold_at DESC
    LIMIT ?
  `).all(Number(limit));
  res.json(sales);
});

// POST /api/sales - Record a sale and update stock
router.post('/', (req, res) => {
  const { product_id, quantity } = req.body;

  if (!product_id || !quantity || quantity <= 0) {
    return res.status(400).json({ error: 'product_id and a positive quantity are required' });
  }

  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(product_id);
  if (!product) return res.status(404).json({ error: 'Product not found' });

  if (product.stock < quantity) {
    return res.status(409).json({ error: `Insufficient stock. Available: ${product.stock}` });
  }

  // Use a transaction to ensure consistency
  const recordSale = db.transaction(() => {
    const total = product.price * quantity;
    const result = db.prepare(`
      INSERT INTO sales (product_id, quantity, unit_price, total)
      VALUES (?, ?, ?, ?)
    `).run(product_id, quantity, product.price, total);

    db.prepare(`
      UPDATE products SET stock = stock - ?, updated_at = datetime('now') WHERE id = ?
    `).run(quantity, product_id);

    return db.prepare('SELECT * FROM sales WHERE id = ?').get(result.lastInsertRowid);
  });

  const sale = recordSale();
  res.status(201).json(sale);
});

module.exports = router;
