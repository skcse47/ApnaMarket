# ApnaMarket

A full-stack e-commerce application with React (Vite) frontend and Node.js/Express backend.

## Project Structure

```
client/   # React + Vite frontend
server/   # Node.js + Express backend
```

## Prerequisites
- Node.js >= 16
- npm >= 8
- MongoDB (local or Atlas)

## Setup Instructions

### 1. Clone the Repository
```
git clone <your-repo-url>
cd apnamarket
```

### 2. Environment Variables
- Copy `.env.example` to `.env` in the `server/` directory and fill in values as needed.

```
cp .env.example server/.env
```

### 3. Install Dependencies
```
cd client
npm install
cd ../server
npm install
```

### 4. Seed Products (optional)
```
node utils/seedProducts.js
```

### 5. Start the Backend
```
cd server
npm run dev
```

### 6. Start the Frontend
```
cd ../client
npm run dev
```

### 7. Running Tests (Backend)
```
cd server
npm run test
```

## API Testing
- Use the provided `server/ApnaMarket-API.postman_collection.json` for Postman API tests.

## Features
- User authentication (JWT + HTTP-only cookies)
- Product browsing
- Cart management
- Order placement
- Admin dashboard (optional)

## Folder Structure
- `client/` - React app (Vite)
- `server/` - Express API, MongoDB models, routes

## License
MIT
