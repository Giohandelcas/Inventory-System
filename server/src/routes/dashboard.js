const express = require('express');
const router = express.Router();
const db = require('../database');

// GET /api/dashboard
router.get('/', (req, res) => {
  const totalProducts = db.prepare('SELECT COUNT(*) as count FROM products').get().count;
  const totalCategories = db.prepare('SELECT COUNT(*) as count FROM categories').get().count;

  const lowStockProducts = db.prepare(`
    SELECT COUNT(*) as count FROM products WHERE stock <= low_stock_threshold
  `).get().count;

  const inventoryValue = db.prepare(`
    SELECT COALESCE(SUM(stock * cost), 0) as value FROM products
  `).get().value;

  const todaySales = db.prepare(`
    SELECT COALESCE(SUM(total), 0) as total, COALESCE(SUM(quantity), 0) as units
    FROM sales WHERE date(sold_at) = date('now')
  `).get();

  const monthSales = db.prepare(`
    SELECT COALESCE(SUM(total), 0) as total, COALESCE(SUM(quantity), 0) as units
    FROM sales WHERE strftime('%Y-%m', sold_at) = strftime('%Y-%m', 'now')
  `).get();

  const topProducts = db.prepare(`
    SELECT p.name, SUM(s.quantity) as units_sold, SUM(s.total) as revenue
    FROM sales s JOIN products p ON s.product_id = p.id
    WHERE strftime('%Y-%m', s.sold_at) = strftime('%Y-%m', 'now')
    GROUP BY s.product_id
    ORDER BY revenue DESC
    LIMIT 5
  `).all();

  const lowStockList = db.prepare(`
    SELECT id, name, stock, low_stock_threshold, unit
    FROM products WHERE stock <= low_stock_threshold
    ORDER BY stock ASC
    LIMIT 10
  `).all();

  const salesByDay = db.prepare(`
    SELECT date(sold_at) as date, SUM(total) as total
    FROM sales
    WHERE sold_at >= date('now', '-30 days')
    GROUP BY date(sold_at)
    ORDER BY date ASC
  `).all();

  res.json({
    stats: {
      totalProducts,
      totalCategories,
      lowStockProducts,
      inventoryValue,
      todaySales,
      monthSales,
    },
    topProducts,
    lowStockList,
    salesByDay,
  });
});

module.exports = router;
