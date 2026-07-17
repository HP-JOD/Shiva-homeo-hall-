# Homeopathy Invoice Management System - Backend

Node.js + Express backend with SQLite database for managing invoices, customers, and products.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Navigate to backend directory:**
```bash
cd app/backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create `.env` file:**
```bash
cp .env.example .env
```

4. **Start the server:**
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

The server will run at `http://localhost:5000`

## 📁 Project Structure

```
app/backend/
├── src/
│   ├── index.js              # Main server file
│   ├── database/
│   │   └── init.js           # Database initialization & queries
│   └── routes/
│       ├── stats.js          # Dashboard statistics endpoints
│       ├── invoices.js       # Invoice CRUD endpoints
│       └── products.js       # Product CRUD endpoints
├── database/                 # SQLite database files (auto-created)
├── package.json              # Dependencies
├── .env.example              # Environment variables template
└── README.md                 # This file
```

## 🔧 API Endpoints

### Health Check
- `GET /api/health` - Server status

### Statistics
- `GET /api/stats` - Dashboard statistics (today's sales, total sales, invoices count, products count, recent invoices, low stock items)

### Invoices
- `GET /api/invoices` - List all invoices
- `GET /api/invoices/:id` - Get single invoice with items
- `POST /api/invoices` - Create new invoice

### Products
- `GET /api/products` - List all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product

## 📊 Database Schema

### customers
```sql
id, name, phone, email, address, created_at, updated_at
```

### products
```sql
id, name, potency, quantity, min_stock, price, created_at, updated_at
```

### invoices
```sql
id, invoice_no, customer_id, customer_name, date, status, 
subtotal, discount, tax, grand_total, notes, created_at, updated_at
```

### invoice_items
```sql
id, invoice_id, product_id, quantity, price, total, created_at
```

## 🔑 Environment Variables

```env
PORT=5000                              # Server port
NODE_ENV=development                   # Environment mode
DATABASE_PATH=./database/invoices.db   # SQLite database path
CORS_ORIGIN=http://localhost:3000      # Frontend URL for CORS
```

## 📝 Example Requests

### Create a Product
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Arnica Montana",
    "potency": "200CH",
    "quantity": 50,
    "min_stock": 10,
    "price": 150
  }'
```

### Create an Invoice
```bash
curl -X POST http://localhost:5000/api/invoices \
  -H "Content-Type: application/json" \
  -d '{
    "customer_name": "John Doe",
    "subtotal": 500,
    "discount": 0,
    "tax": 45,
    "items": [
      {
        "product_id": "product-uuid",
        "quantity": 2,
        "price": 250
      }
    ]
  }'
```

### Get Dashboard Statistics
```bash
curl http://localhost:5000/api/stats
```

## 🛠️ Development

### Adding New Routes
1. Create new file in `src/routes/`
2. Import in `src/index.js`
3. Use `app.use('/api/path', require('./routes/filename'))`

### Database Queries
Use the helper functions from `database/init.js`:
- `getAsync(query, params)` - Get single row
- `allAsync(query, params)` - Get all rows
- `runAsync(query, params)` - Insert/Update/Delete

## 📚 Dependencies

- **express** - Web framework
- **cors** - Cross-Origin Resource Sharing
- **sqlite3** - Database
- **uuid** - Generate unique IDs
- **dotenv** - Environment variables
- **nodemon** (dev) - Auto-reload during development

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

ISC
