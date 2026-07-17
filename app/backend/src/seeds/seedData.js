const { runAsync, getDatabase } = require('../database/init');
const { v4: uuidv4 } = require('uuid');

const seedDatabase = async () => {
  console.log('\n📊 Seeding database with sample data...');

  try {
    // Add sample products
    const products = [
      { id: uuidv4(), name: 'Arnica Montana', potency: '200CH', quantity: 50, min_stock: 10, price: 150 },
      { id: uuidv4(), name: 'Apis Mellifica', potency: '6C', quantity: 8, min_stock: 10, price: 120 },
      { id: uuidv4(), name: 'Rhus Tox', potency: '30C', quantity: 25, min_stock: 10, price: 100 },
      { id: uuidv4(), name: 'Lycopodium', potency: '200CH', quantity: 12, min_stock: 10, price: 130 },
      { id: uuidv4(), name: 'Sulphur', potency: '1M', quantity: 5, min_stock: 10, price: 200 },
    ];

    for (const product of products) {
      await runAsync(
        `INSERT OR IGNORE INTO products (id, name, potency, quantity, min_stock, price) VALUES (?, ?, ?, ?, ?, ?)`,
        [product.id, product.name, product.potency, product.quantity, product.min_stock, product.price]
      );
    }
    console.log('✅ Added 5 sample products');

    // Add sample customers
    const customers = [
      { id: uuidv4(), name: 'Raj Kumar', phone: '9876543210', email: 'raj@example.com', address: '123 Main St, Delhi' },
      { id: uuidv4(), name: 'Priya Singh', phone: '9876543211', email: 'priya@example.com', address: '456 Park Ave, Mumbai' },
      { id: uuidv4(), name: 'Amit Patel', phone: '9876543212', email: 'amit@example.com', address: '789 Grove St, Bangalore' },
    ];

    for (const customer of customers) {
      await runAsync(
        `INSERT OR IGNORE INTO customers (id, name, phone, email, address) VALUES (?, ?, ?, ?, ?)`,
        [customer.id, customer.name, customer.phone, customer.email, customer.address]
      );
    }
    console.log('✅ Added 3 sample customers');

    // Add sample invoices
    const invoices = [
      {
        id: uuidv4(),
        invoice_no: 'INV001',
        customer_name: 'Raj Kumar',
        date: new Date(Date.now() - 86400000).toISOString(),
        subtotal: 500,
        discount: 0,
        tax: 45,
        grand_total: 545,
      },
      {
        id: uuidv4(),
        invoice_no: 'INV002',
        customer_name: 'Priya Singh',
        date: new Date(Date.now() - 172800000).toISOString(),
        subtotal: 800,
        discount: 50,
        tax: 67.5,
        grand_total: 817.5,
      },
      {
        id: uuidv4(),
        invoice_no: 'INV003',
        customer_name: 'Amit Patel',
        date: new Date().toISOString(),
        subtotal: 1200,
        discount: 100,
        tax: 99,
        grand_total: 1199,
      },
    ];

    for (const invoice of invoices) {
      await runAsync(
        `INSERT OR IGNORE INTO invoices (id, invoice_no, customer_name, date, subtotal, discount, tax, grand_total) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [invoice.id, invoice.invoice_no, invoice.customer_name, invoice.date, invoice.subtotal, invoice.discount, invoice.tax, invoice.grand_total]
      );
    }
    console.log('✅ Added 3 sample invoices');
    console.log('\n✨ Database seeded successfully!\n');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

module.exports = { seedDatabase };
