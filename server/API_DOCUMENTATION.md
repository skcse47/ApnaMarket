# Apna Market API Documentation

Base URL: `http://localhost:5000/api`

## Authentication
All protected routes require a valid JWT token sent via cookies. The token is automatically set after login/register.

### Register User
```http
POST /register
```
**Body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```
**Response:** `201 Created`
```json
{
  "_id": "string",
  "name": "string",
  "email": "string",
  "role": "user"
}
```

### Login
```http
POST /login
```
**Body:**
```json
{
  "email": "string",
  "password": "string"
}
```
**Response:** `200 OK`
```json
{
  "_id": "string",
  "name": "string",
  "email": "string",
  "role": "string"
}
```

### Get Profile
```http
GET /profile
```
**Auth Required:** Yes

**Response:** `200 OK`
```json
{
  "_id": "string",
  "name": "string",
  "email": "string",
  "role": "string"
}
```

### Logout
```http
POST /logout
```
**Auth Required:** Yes

**Response:** `200 OK`
```json
{
  "message": "Logged out successfully"
}
```

## Products

### Get All Products
```http
GET /products
```
**Auth Required:** No

**Response:** `200 OK`
```json
[
  {
    "_id": "string",
    "title": "string",
    "description": "string",
    "price": "number",
    "images": ["string"],
    "stock": "number",
    "category": "string",
    "isActive": "boolean"
  }
]
```

### Get Single Product
```http
GET /products/:id
```
**Auth Required:** No

**Response:** `200 OK`
```json
{
  "_id": "string",
  "title": "string",
  "description": "string",
  "price": "number",
  "images": ["string"],
  "stock": "number",
  "category": "string",
  "isActive": "boolean"
}
```

### Create Product (Admin Only)
```http
POST /products
```
**Auth Required:** Yes (Admin)

**Body:**
```json
{
  "title": "string",
  "description": "string",
  "price": "number",
  "images": ["string"],
  "stock": "number",
  "category": "string"
}
```
**Response:** `201 Created`

### Update Product (Admin Only)
```http
PUT /products/:id
```
**Auth Required:** Yes (Admin)

**Body:** (all fields optional)
```json
{
  "title": "string",
  "description": "string",
  "price": "number",
  "images": ["string"],
  "stock": "number",
  "category": "string"
}
```
**Response:** `200 OK`

### Delete Product (Admin Only)
```http
DELETE /products/:id
```
**Auth Required:** Yes (Admin)

**Response:** `200 OK`
```json
{
  "message": "Product removed"
}
```

## Cart

### Get Cart
```http
GET /cart
```
**Auth Required:** Yes

**Response:** `200 OK`
```json
[
  {
    "_id": "string",
    "productId": {
      "_id": "string",
      "title": "string",
      "price": "number",
      "images": ["string"],
      "stock": "number"
    },
    "quantity": "number"
  }
]
```

### Add/Update Cart Item
```http
POST /cart
```
**Auth Required:** Yes

**Body:**
```json
{
  "productId": "string",
  "quantity": "number"
}
```
**Response:** `200 OK`

### Remove Cart Item
```http
DELETE /cart/:itemId
```
**Auth Required:** Yes

**Response:** `200 OK`
```json
{
  "message": "Item removed from cart"
}
```

### Clear Cart
```http
DELETE /cart
```
**Auth Required:** Yes

**Response:** `200 OK`
```json
{
  "message": "Cart cleared"
}
```

## Orders

### Place Order
```http
POST /orders
```
**Auth Required:** Yes

**Body:**
```json
{
  "street": "string",
  "city": "string",
  "state": "string",
  "zipCode": "string"
}
```
**Response:** `201 Created`
```json
{
  "_id": "string",
  "userId": "string",
  "items": [
    {
      "productId": "string",
      "quantity": "number",
      "priceAtPurchase": "number"
    }
  ],
  "total": "number",
  "status": "pending",
  "shippingAddress": {
    "street": "string",
    "city": "string",
    "state": "string",
    "zipCode": "string"
  },
  "createdAt": "date"
}
```

### Get User Orders
```http
GET /orders
```
**Auth Required:** Yes

**Response:** `200 OK`
```json
[
  {
    "_id": "string",
    "items": [...],
    "total": "number",
    "status": "string",
    "createdAt": "date"
  }
]
```

### Get Order Details
```http
GET /orders/:id
```
**Auth Required:** Yes

**Response:** `200 OK`
```json
{
  "_id": "string",
  "items": [...],
  "total": "number",
  "status": "string",
  "shippingAddress": {...},
  "createdAt": "date"
}
```

### Get All Orders (Admin Only)
```http
GET /orders/admin/all
```
**Auth Required:** Yes (Admin)

**Response:** `200 OK`
```json
[
  {
    "_id": "string",
    "userId": {
      "name": "string",
      "email": "string"
    },
    "items": [...],
    "total": "number",
    "status": "string",
    "createdAt": "date"
  }
]
```

### Update Order Status (Admin Only)
```http
PUT /orders/:id
```
**Auth Required:** Yes (Admin)

**Body:**
```json
{
  "status": "enum('pending', 'shipped', 'delivered')"
}
```
**Response:** `200 OK`

## Error Responses

### 400 Bad Request
```json
{
  "error": "Error message describing the issue"
}
```

### 401 Unauthorized
```json
{
  "error": "Not authorized - No token"
}
```

### 403 Forbidden
```json
{
  "error": "Not authorized as admin"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Error message describing the issue"
}
```
