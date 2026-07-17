const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { runAsync, getAsync, allAsync } = require('../database/init');

// GET /api/invoices - List all invoices
router.get('/', async (req, res) => {
  try {
    const invoices = await allAsync(`
      SELECT id, invoice_no, customer_name, date, status, grand_total
      FROM invoices
      ORDER BY date DESC
    `);
    res.json(invoices);
  } catch (error) {
    console.error('Get invoices error:', error);
    res.status(500).json({ error: 'Failed to fetch invoices' });
  }
});

// GET /api/invoices/:id - Get single invoice
router.get('/:id', async (req, res) => {
  try {
    const invoice = await getAsync(`
      SELECT * FROM invoices WHERE id = ?
    `, [req.params.id]);

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    const items = await allAsync(`
      SELECT ii.*, p.name, p.potency
      FROM invoice_items ii
      JOIN products p ON ii.product_id = p.id
      WHERE ii.invoice_id = ?
    `, [req.params.id]);

    res.json({ ...invoice, items });
  } catch (error) {
    console.error('Get invoice error:', error);
    res.status(500).json({ error: 'Failed to fetch invoice' });
  }
});

// POST /api/invoices - Create new invoice
router.post('/', async (req, res) => {
  try {
    const { customer_name, items, subtotal, discount, tax, notes } = req.body;

    const id = uuidv4();
    const invoiceNo = `INV${Date.now()}`;
    const grandTotal = (subtotal || 0) - (discount || 0) + (tax || 0);

    await runAsync(`
      INSERT INTO invoices (id, invoice_no, customer_name, subtotal, discount, tax, grand_total, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [id, invoiceNo, customer_name, subtotal, discount, tax, grandTotal, notes]);

    // Add invoice items
    if (items && Array.isArray(items)) {
      for (const item of items) {
        await runAsync(`
          INSERT INTO invoice_items (id, invoice_id, product_id, quantity, price, total)
          VALUES (?, ?, ?, ?, ?, ?)
        `, [uuidv4(), id, item.product_id, item.quantity, item.price, item.total]);
      }
    }

    res.status(201).json({ id, invoice_no: invoiceNo, grand_total: grandTotal });
  } catch (error) {
    console.error('Create invoice error:', error);
    res.status(500).json({ error: 'Failed to create invoice' });
  }
});

module.exports = router;
