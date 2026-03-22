# ShopMini — E-Commerce Mini Platform

## Features
- Product listing with stock badges (in stock / low stock / out of stock)
- Cart with quantity controls
- Checkout flow with shipping form + order confirmation
- Order history (per browser session)
- Admin panel: add products, update stock, delete products, manage order statuses

## Stack
- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: lowdb (JSON file, zero config)

## Setup & Run

### 1. Backend
```bash
cd backend
node npm install   
node server.js
# Runs on http://localhost:4000
```

### 2. Frontend
```bash
cd frontend
node /usr/local/bin/npm run dev
# Runs on http://localhost:5173
```

## API Endpoints
| Method | Path | Description |
|--------|------|-------------|
| GET | /api/products | List all products |
| POST | /api/products | Add product (admin) |
| PATCH | /api/products/:id/stock | Update stock (admin) |
| DELETE | /api/products/:id | Delete product (admin) |
| POST | /api/orders | Checkout (creates order) |
| GET | /api/orders?sessionId= | User order history |
| GET | /api/orders/all | All orders (admin) |
| PATCH | /api/orders/:id/status | Update order status (admin) |
