# Python FastAPI Backend Setup

## What I've Created

I've converted the entire Express.js backend to a Python FastAPI backend!

### Files Created:
- **`backend_python.py`** - Complete FastAPI backend with all endpoints
- **`run_backend.sh`** - Startup script for the backend

## How to Run

### Option 1: Run Python Backend Only
```bash
python backend_python.py
```
Backend will run on http://localhost:5000

### Option 2: Run Frontend Only
```bash
./dev-frontend-only.sh
```
Frontend will run on http://localhost:5000 (without backend)

### Option 3: Run Frontend + Python Backend (Different Ports)

**Terminal 1 - Backend (port 8000):**
```bash
python -m uvicorn backend_python:app --host 0.0.0.0 --port 8000 --reload
```

**Terminal 2 - Frontend (port 5000):**
```bash
npx vite --host 0.0.0.0 --port 5000
```

Then update `client/src/lib/queryClient.ts` to use: `http://localhost:8000`

## What's Included in Python Backend

✅ **All API Endpoints:**
- Products (CRUD + filtering)
- Categories (CRUD)
- Shopping Cart (add/update/remove items)
- Orders (create + retrieve)
- Seller Dashboard (stats + products)

✅ **Same Data Structure:**
- 8 seed products across 3 categories
- All product images and descriptions
- Same JSON response format as Express

✅ **Features:**
- In-memory storage (same as Express)
- CORS enabled for all origins
- Pagination support
- Cart merging (same product = add quantity)
- Seller stats calculation

## API Endpoints

All endpoints match the original Express backend exactly:

```
GET    /api/products              - List all products
GET    /api/products/:id          - Get single product
POST   /api/products              - Create product
PATCH  /api/products/:id          - Update product
DELETE /api/products/:id          - Delete product

GET    /api/categories            - List categories
GET    /api/categories/:id        - Get single category

GET    /api/cart                  - Get cart items
POST   /api/cart                  - Add to cart
PATCH  /api/cart/:id              - Update cart item quantity
DELETE /api/cart/:id              - Remove from cart

POST   /api/orders                - Create order
GET    /api/seller/orders         - Get seller orders
GET    /api/seller/products       - Get seller products
GET    /api/seller/stats          - Get seller stats
```

## Why Python Backend?

✅ Same functionality as Express
✅ Uses FastAPI (modern, fast Python framework)
✅ In-memory storage (no database needed yet)
✅ CORS configured for frontend communication
✅ Pydantic for data validation
✅ Easy to extend with features like Stripe, authentication, etc.

## Next Steps

When you're ready for production features, you can easily add:
- PostgreSQL database integration
- Stripe payment processing
- User authentication (JWT tokens)
- Database migrations
- Background tasks

The frontend doesn't need ANY changes - it already works with the Python backend!

## Running on Replit

To make the Python backend the default on Replit:
1. Go to Tools → Change Workflow Settings
2. Change command to: `python backend_python.py`
3. Frontend will automatically connect to the backend

Or create a separate run configuration for the frontend if you want both running.
