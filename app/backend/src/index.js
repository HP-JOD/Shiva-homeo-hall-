const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

const invoiceRoutes = require('./routes/invoices');
const statsRoutes = require('./routes/stats');
const productRoutes = require('./routes/products');
const { initializeDatabase } = require('./database/init');
const { seedDatabase } = require('./seeds/seedData');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================================
// MIDDLEWARE
// ============================================================

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================================
// INITIALIZE DATABASE
// ============================================================

initializeDatabase();
seedDatabase();

// ============================================================
// ROUTES
// ============================================================

app.use('/api/stats', statsRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/products', productRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
  });
});

// ============================================================
// START SERVER
// ============================================================

app.listen(PORT, () => {
  console.log(`\n🚀 Backend server running at http://localhost:${PORT}`);
  console.log(`📁 Database: ${process.env.DATABASE_PATH || './database/invoices.db'}`);
  console.log(`🌍 CORS enabled for: ${process.env.CORS_ORIGIN || 'http://localhost:3000'}\n`);
});

module.exports = app;
