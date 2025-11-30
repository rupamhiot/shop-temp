# Running Frontend Only (No Backend)

## Quick Start

Run the frontend-only development server:

```bash
./dev-frontend-only.sh
```

Or manually:
```bash
npx vite --host 0.0.0.0 --port 5000
```

Frontend will be available at: **http://localhost:5000**

## Important Notes

⚠️ **Without Backend:**
- Frontend UI will load and work
- API calls will fail (network errors in browser console)
- Shopping cart, products, orders won't load data
- This is useful for **UI/UX development only**

✅ **With Node.js Backend:**
```bash
npm run dev
```
Runs both frontend + backend together on port 5000

## Connecting to Python Backend

When you build your Python backend on port 8000:

1. Update `client/src/lib/queryClient.ts` to:
```typescript
const API_URL = process.env.VITE_API_URL || 'http://localhost:8000'
```

2. Or set environment variable:
```bash
VITE_API_URL=http://localhost:8000 npx vite --host 0.0.0.0 --port 5000
```

## API Endpoints Expected by Frontend

Your Python backend should provide these endpoints (matching current structure):

```
GET    /api/products              - List products with filters
GET    /api/products/:id          - Get single product
POST   /api/products              - Create product
PATCH  /api/products/:id          - Update product
DELETE /api/products/:id          - Delete product

GET    /api/cart                  - Get cart items
POST   /api/cart                  - Add to cart
PATCH  /api/cart/:id              - Update cart item
DELETE /api/cart/:id              - Remove from cart

GET    /api/categories            - List categories
GET    /api/categories/:id        - Get category

POST   /api/orders                - Create order
GET    /api/seller/orders         - Get seller orders
GET    /api/seller/stats          - Get seller stats
GET    /api/seller/products       - Get seller products
```

All endpoints are already integrated in the frontend!
