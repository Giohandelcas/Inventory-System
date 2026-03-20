# Inventory System

- Start test using Cloude
A full-stack inventory management system for small stores.

## Tech Stack

- **Frontend:** React + Vite + TailwindCSS
- **Backend:** Node.js + Express
- **Database:** SQLite (via better-sqlite3)

## Features

- Product management (CRUD)
- Category management
- Stock tracking with low-stock alerts
- Sales recording
- Dashboard with key metrics

## Getting Started

### Backend
```bash
cd server
npm install
npm run dev
```

### Frontend
```bash
cd client
npm install
npm run dev
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/products | List all products |
| POST | /api/products | Create product |
| PUT | /api/products/:id | Update product |
| DELETE | /api/products/:id | Delete product |
| GET | /api/categories | List categories |
| POST | /api/sales | Record a sale |
| GET | /api/dashboard | Get metrics |
