const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();

const dbPath = process.env.DATABASE_PATH || path.join(__dirname, '../../database/invoices.db');
const dbDir = path.dirname(dbPath);

// Create database directory if it doesn't exist
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

let db = null;

const getDatabase = () => {
  if (!db) {
    db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Error opening database:', err);
      } else {
        console.log('✓ Connected to SQLite database');
      }
    });
  }
  return db;
};

const initializeDatabase = () => {
  const database = getDatabase();

  database.serialize(() => {
    // Create Customers table
    database.run(`
      CREATE TABLE IF NOT EXISTS customers (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        phone TEXT,
        email TEXT,
        address TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create Products table
    database.run(`
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        potency TEXT,
        quantity INTEGER DEFAULT 0,
        min_stock INTEGER DEFAULT 10,
        price REAL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create Invoices table
    database.run(`
      CREATE TABLE IF NOT EXISTS invoices (
        id TEXT PRIMARY KEY,
        invoice_no TEXT UNIQUE NOT NULL,
        customer_id TEXT,
        customer_name TEXT,
        date DATETIME DEFAULT CURRENT_TIMESTAMP,
        status TEXT DEFAULT 'completed',
        subtotal REAL DEFAULT 0,
        discount REAL DEFAULT 0,
        tax REAL DEFAULT 0,
        grand_total REAL DEFAULT 0,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(customer_id) REFERENCES customers(id)
      )
    `);

    // Create Invoice Items table
    database.run(`
      CREATE TABLE IF NOT EXISTS invoice_items (
        id TEXT PRIMARY KEY,
        invoice_id TEXT NOT NULL,
        product_id TEXT NOT NULL,
        quantity INTEGER,
        price REAL,
        total REAL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(invoice_id) REFERENCES invoices(id),
        FOREIGN KEY(product_id) REFERENCES products(id)
      )
    `);

    console.log('✓ Database tables created/verified');
  });
};

const runAsync = (query, params = []) => {
  return new Promise((resolve, reject) => {
    getDatabase().run(query, params, function(err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

const getAsync = (query, params = []) => {
  return new Promise((resolve, reject) => {
    getDatabase().get(query, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const allAsync = (query, params = []) => {
  return new Promise((resolve, reject) => {
    getDatabase().all(query, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
};

module.exports = {
  getDatabase,
  initializeDatabase,
  runAsync,
  getAsync,
  allAsync,
};
