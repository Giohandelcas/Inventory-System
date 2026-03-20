// Static demo data used when the backend API is unavailable (e.g. GitHub Pages)
export const demoCategories = [
  { id: 1, name: 'Electronics' },
  { id: 2, name: 'Food & Beverages' },
  { id: 3, name: 'Clothing' },
  { id: 4, name: 'Home & Garden' },
  { id: 5, name: 'Health & Beauty' },
];

export const demoProducts = [
  { id: 1, name: 'USB-C Cable 2m', sku: 'ELEC-001', category_id: 1, category_name: 'Electronics', price: 12.99, cost: 4.50, stock: 3, low_stock_threshold: 5, unit: 'unit' },
  { id: 2, name: 'Wireless Mouse', sku: 'ELEC-002', category_id: 1, category_name: 'Electronics', price: 29.99, cost: 12.00, stock: 15, low_stock_threshold: 5, unit: 'unit' },
  { id: 3, name: 'Mechanical Keyboard', sku: 'ELEC-003', category_id: 1, category_name: 'Electronics', price: 89.99, cost: 40.00, stock: 8, low_stock_threshold: 3, unit: 'unit' },
  { id: 4, name: 'Organic Coffee 500g', sku: 'FOOD-001', category_id: 2, category_name: 'Food & Beverages', price: 14.99, cost: 7.00, stock: 2, low_stock_threshold: 10, unit: 'bag' },
  { id: 5, name: 'Green Tea 100 bags', sku: 'FOOD-002', category_id: 2, category_name: 'Food & Beverages', price: 8.99, cost: 3.50, stock: 25, low_stock_threshold: 5, unit: 'box' },
  { id: 6, name: 'Cotton T-Shirt M', sku: 'CLO-001', category_id: 3, category_name: 'Clothing', price: 19.99, cost: 8.00, stock: 40, low_stock_threshold: 10, unit: 'unit' },
  { id: 7, name: 'Denim Jeans 32', sku: 'CLO-002', category_id: 3, category_name: 'Clothing', price: 49.99, cost: 20.00, stock: 12, low_stock_threshold: 5, unit: 'unit' },
  { id: 8, name: 'Vitamin C 1000mg', sku: 'HLT-001', category_id: 5, category_name: 'Health & Beauty', price: 11.99, cost: 4.00, stock: 4, low_stock_threshold: 10, unit: 'bottle' },
];

export const demoSales = [
  { id: 1, product_id: 2, product_name: 'Wireless Mouse', quantity: 2, unit_price: 29.99, total: 59.98, sold_at: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
  { id: 2, product_id: 6, product_name: 'Cotton T-Shirt M', quantity: 3, unit_price: 19.99, total: 59.97, sold_at: new Date(Date.now() - 1000 * 60 * 90).toISOString() },
  { id: 3, product_id: 3, product_name: 'Mechanical Keyboard', quantity: 1, unit_price: 89.99, total: 89.99, sold_at: new Date(Date.now() - 1000 * 3600 * 3).toISOString() },
  { id: 4, product_id: 5, product_name: 'Green Tea 100 bags', quantity: 5, unit_price: 8.99, total: 44.95, sold_at: new Date(Date.now() - 1000 * 3600 * 5).toISOString() },
  { id: 5, product_id: 1, product_name: 'USB-C Cable 2m', quantity: 4, unit_price: 12.99, total: 51.96, sold_at: new Date(Date.now() - 1000 * 3600 * 24).toISOString() },
  { id: 6, product_id: 7, product_name: 'Denim Jeans 32', quantity: 2, unit_price: 49.99, total: 99.98, sold_at: new Date(Date.now() - 1000 * 3600 * 26).toISOString() },
  { id: 7, product_id: 2, product_name: 'Wireless Mouse', quantity: 1, unit_price: 29.99, total: 29.99, sold_at: new Date(Date.now() - 1000 * 3600 * 48).toISOString() },
];

// Generate 30-day sales chart data
const today = new Date();
export const demoDashboard = {
  stats: {
    totalProducts: demoProducts.length,
    totalCategories: demoCategories.length,
    lowStockProducts: demoProducts.filter(p => p.stock <= p.low_stock_threshold).length,
    inventoryValue: demoProducts.reduce((sum, p) => sum + p.stock * p.cost, 0),
    todaySales: { total: 59.98 + 59.97, units: 5 },
    monthSales: { total: 436.83, units: 18 },
  },
  topProducts: [
    { name: 'Mechanical Keyboard', units_sold: 5, revenue: 449.95 },
    { name: 'Wireless Mouse', units_sold: 8, revenue: 239.92 },
    { name: 'Denim Jeans 32', units_sold: 4, revenue: 199.96 },
    { name: 'Cotton T-Shirt M', units_sold: 9, revenue: 179.91 },
    { name: 'Green Tea 100 bags', units_sold: 12, revenue: 107.88 },
  ],
  lowStockList: demoProducts.filter(p => p.stock <= p.low_stock_threshold),
  salesByDay: Array.from({ length: 30 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (29 - i));
    return {
      date: d.toISOString().slice(0, 10),
      total: Math.round((Math.random() * 150 + 30) * 100) / 100,
    };
  }),
};
