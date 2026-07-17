const express = require('express');
const router = express.Router();
const { allAsync, getAsync } = require('../database/init');

// GET /api/stats - Dashboard statistics
router.get('/', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    // Today's sales
    const todayStats = await getAsync(`
      SELECT COALESCE(SUM(grand_total), 0) as total
      FROM invoices
      WHERE DATE(date) = ?
    `, [today]);

    // Total sales
    const totalStats = await getAsync(`
      SELECT COALESCE(SUM(grand_total), 0) as total
      FROM invoices
    `);

    // Total invoices
    const invoiceStats = await getAsync(`
      SELECT COUNT(*) as count
      FROM invoices
    `);

    // Total products
    const productStats = await getAsync(`
      SELECT COUNT(*) as count
      FROM products
    `);

    // Recent invoices
    const recentInvoices = await allAsync(`
      SELECT id, invoice_no, customer_name, date, grand_total
      FROM invoices
      ORDER BY date DESC
      LIMIT 5
    `);

    // Low stock items
    const lowStockItems = await allAsync(`
      SELECT id, name, potency, quantity
      FROM products
      WHERE quantity < min_stock
      ORDER BY quantity ASC
    `);

    res.json({
      today_sales: todayStats.total || 0,
      total_sales: totalStats.total || 0,
      total_invoices: invoiceStats.count || 0,
      total_products: productStats.count || 0,
      recent_invoices: recentInvoices,
      low_stock_items: lowStockItems,
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

module.exports = router;
