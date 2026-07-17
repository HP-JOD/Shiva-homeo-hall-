# 🚀 Complete Setup Guide

## Project Structure

```
Shiva-homeo-hall-/
├── app/
│   ├── backend/          # Node.js + Express API
│   │   ├── src/
│   │   │   ├── index.js
│   │   │   ├── database/
│   │   │   ├── routes/
│   │   │   └── seeds/
│   │   ├── package.json
│   │   ├── .env.example
│   │   └── Dockerfile
│   └── frontend/         # React + TypeScript
│       ├── src/
│       │   ├── api/
│       │   ├── pages/
│       │   └── components/
│       ├── package.json
│       └── Dockerfile
├── docker-compose.yml
└── SETUP_GUIDE.md
```

## ✅ Quick Start (Local Development)

### Method 1: Run Separately (Recommended for Development)

#### Terminal 1 - Backend
```bash
cd app/backend
cp .env.example .env
npm install
npm run dev
```
✅ Backend runs at: `http://localhost:5000`
✅ API docs available at: `http://localhost:5000/api`
✅ Database auto-seeds with sample data

#### Terminal 2 - Frontend
```bash
cd app/frontend
cp .env.example .env
npm install
npm start
```
✅ Frontend runs at: `http://localhost:3000`
✅ Dashboard displays with real data from backend

### Method 2: Docker Compose (One Command)

```bash
# Build and start both services
docker-compose up --build

# Or start without rebuilding
docker-compose up

# Stop services
docker-compose down
```

✅ Both services run automatically
✅ Frontend: `http://localhost:3000`
✅ Backend: `http://localhost:5000`

## 🔑 Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
DATABASE_PATH=./database/invoices.db
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
```

## 📊 Features

### Dashboard
- ✅ Today's sales
- ✅ Total sales
- ✅ Total invoices count
- ✅ Total products count
- ✅ Recent invoices
- ✅ Low stock alerts

### Invoices
- ✅ Create invoices
- ✅ View all invoices
- ✅ Search invoices
- ✅ Download invoices
- ✅ Invoice details

### Inventory
- ✅ Add products
- ✅ Edit products
- ✅ Delete products
- ✅ Track stock levels
- ✅ Low stock alerts

### Customers
- ✅ Add customers
- ✅ Edit customers
- ✅ Delete customers
- ✅ Store contact information

## 🛠️ API Endpoints

### Stats
- `GET /api/stats` - Dashboard statistics

### Invoices
- `GET /api/invoices` - List all invoices
- `GET /api/invoices/:id` - Get single invoice
- `POST /api/invoices` - Create invoice

### Products
- `GET /api/products` - List products
- `GET /api/products/:id` - Get product
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product

### Health
- `GET /api/health` - Server status

## 📝 Sample API Requests

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
    "items": []
  }'
```

### Get Dashboard Stats
```bash
curl http://localhost:5000/api/stats
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Change port in .env
PORT=5001
```

### Database Issues
```bash
# Delete database and restart (will auto-seed)
rm app/backend/database/invoices.db
npm run dev
```

### CORS Errors
Make sure:
1. Backend is running on `http://localhost:5000`
2. Frontend is running on `http://localhost:3000`
3. `.env` files are properly configured

### Dependencies Not Installing
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📦 Dependencies

### Backend
- express
- cors
- sqlite3
- uuid
- dotenv
- nodemon (dev)

### Frontend
- react
- react-router-dom
- axios
- lucide-react
- tailwindcss

## 🚀 Deployment

### Deploy to Heroku

1. Backend:
```bash
heroku create your-app-name-backend
heroku config:set CORS_ORIGIN=https://your-app.herokuapp.com
git push heroku main
```

2. Frontend:
```bash
heroku create your-app-name-frontend
heroku config:set REACT_APP_API_URL=https://your-app-backend.herokuapp.com/api
git push heroku main
```

### Deploy with Docker
```bash
docker build -t homeo-app .
docker run -p 5000:5000 -p 3000:3000 homeo-app
```

## 📊 Database Schema

### Tables
- `customers` - Customer information
- `products` - Medicine inventory
- `invoices` - Invoice records
- `invoice_items` - Individual invoice line items

## 🤝 Contributing

Feel free to submit issues and pull requests!

## 📄 License

ISC
