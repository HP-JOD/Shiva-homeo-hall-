const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { runAsync, getAsync, allAsync } = require('../database/init');

// GET /api/products - List all products
router.get('/', async (req, res) => {
  try {
    const products = await allAsync(`
      SELECT id, name, potency, quantity, min_stock, price
      FROM products
      ORDER BY name ASC
    `);
    res.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// GET /api/products/:id - Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await getAsync(`
      SELECT * FROM products WHERE id = ?
    `, [req.params.id]);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// POST /api/products - Create new product
router.post('/', async (req, res) => {
  try {
    const { name, potency, quantity, min_stock, price } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Product name is required' });
    }

    const id = uuidv4();
    await runAsync(`
      INSERT INTO products (id, name, potency, quantity, min_stock, price)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [id, name, potency, quantity || 0, min_stock || 10, price || 0]);

    res.status(201).json({ id, name, potency, quantity, min_stock, price });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// PUT /api/products/:id - Update product
router.put('/:id', async (req, res) => {
  try {
    const { name, potency, quantity, min_stock, price } = req.body;

    await runAsync(`
      UPDATE products
      SET name = COALESCE(?, name),
          potency = COALESCE(?, potency),
          quantity = COALESCE(?, quantity),
          min_stock = COALESCE(?, min_stock),
          price = COALESCE(?, price),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [name, potency, quantity, min_stock, price, req.params.id]);

    res.json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

module.exports = router;
