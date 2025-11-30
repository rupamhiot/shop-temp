from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
from uuid import uuid4
from datetime import datetime
import json


# Data Models
class Category(BaseModel):
    id: str
    name: str
    slug: str
    image: str


class Product(BaseModel):
    id: str
    name: str
    description: str
    price: str
    categoryId: str
    categoryName: str
    image: str
    images: List[str]
    sellerId: str
    sellerName: str
    stock: int
    status: str
    rating: str
    reviewCount: int


class CartItem(BaseModel):
    id: str
    sessionId: str
    productId: str
    quantity: int


class Order(BaseModel):
    id: str
    sellerId: str
    buyerName: str
    buyerEmail: str
    total: str
    status: str
    createdAt: datetime


class SellerStats(BaseModel):
    revenue: float
    activeListings: int
    totalOrders: int
    avgOrderValue: float


# Request Models
class CreateProductRequest(BaseModel):
    name: str
    description: str
    price: str
    categoryId: str
    categoryName: str
    image: str
    images: List[str]
    sellerId: str
    sellerName: str
    stock: int
    status: str


class UpdateProductRequest(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[str] = None
    categoryId: Optional[str] = None
    categoryName: Optional[str] = None
    image: Optional[str] = None
    images: Optional[List[str]] = None
    sellerId: Optional[str] = None
    sellerName: Optional[str] = None
    stock: Optional[int] = None
    status: Optional[str] = None


class AddToCartRequest(BaseModel):
    productId: str
    quantity: int


class UpdateCartItemRequest(BaseModel):
    quantity: int


class CreateOrderRequest(BaseModel):
    sellerId: str
    buyerName: str
    buyerEmail: str
    total: str
    status: str


# In-Memory Storage
class Storage:
    def __init__(self):
        self.products = {}
        self.categories = {}
        self.cart_items = {}
        self.orders = {}
        self._seed_data()
        self.review = []

    def _seed_data(self):
        # Categories
        categories_data = [
            {
                "id": "cat-1",
                "name": "Fashion & Accessories",
                "slug": "fashion",
                "image": "https://images.unsplash.com/photo-1558769132-cb1aea3c3e46?w=800",
            },
            {
                "id": "cat-2",
                "name": "Home & Living",
                "slug": "home-decor",
                "image": "https://images.unsplash.com/photo-1615529328331-f8917597711f?w=800",
            },
            {
                "id": "cat-3",
                "name": "Electronics & Tech",
                "slug": "electronics",
                "image": "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800",
            },
        ]
        for cat in categories_data:
            self.categories[cat["id"]] = cat

        # Products
        products_data = [
            {
                "id": "prod-1",
                "name": "Premium Bluetooth Speaker",
                "description": "High-quality wireless speaker with 360-degree sound, 12-hour battery life, and water-resistant design. Perfect for outdoor adventures or home entertainment.",
                "price": "129.99",
                "categoryId": "cat-3",
                "categoryName": "Electronics & Tech",
                "image": "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800",
                "images": [
                    "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800",
                    "https://images.unsplash.com/photo-1589003077984-894e133dabab?w=800",
                ],
                "sellerId": "seller-1",
                "sellerName": "AudioPro",
                "stock": 45,
                "status": "active",
                "rating": "4.8",
                "reviewCount": 124,
            },
            {
                "id": "prod-2",
                "name": "Ceramic Vase",
                "description": "Handcrafted ceramic vase with a modern minimalist design. Features a beautiful sage green glaze that complements any home decor style.",
                "price": "45.00",
                "categoryId": "cat-2",
                "categoryName": "Home & Living",
                "image": "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=800",
                "images": [
                    "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=800",
                    "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800",
                ],
                "sellerId": "seller-2",
                "sellerName": "HomeStyle",
                "stock": 28,
                "status": "active",
                "rating": "4.9",
                "reviewCount": 87,
            },
            {
                "id": "prod-3",
                "name": "Leather Crossbody Bag",
                "description": "Genuine leather crossbody bag with adjustable strap and gold hardware. Multiple compartments for organized storage. Perfect for daily use or special occasions.",
                "price": "189.99",
                "categoryId": "cat-1",
                "categoryName": "Fashion & Accessories",
                "image": "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800",
                "images": [
                    "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800",
                    "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800",
                ],
                "sellerId": "seller-3",
                "sellerName": "LuxeGoods",
                "stock": 15,
                "status": "active",
                "rating": "4.7",
                "reviewCount": 203,
            },
            {
                "id": "prod-4",
                "name": "Wireless Mechanical Keyboard",
                "description": "Premium mechanical keyboard with RGB backlighting, aluminum frame, and hot-swappable switches. Compatible with Windows, Mac, and Linux.",
                "price": "149.99",
                "categoryId": "cat-3",
                "categoryName": "Electronics & Tech",
                "image": "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800",
                "images": [
                    "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800",
                    "https://images.unsplash.com/photo-1595225476474-87563907a212?w=800",
                ],
                "sellerId": "seller-4",
                "sellerName": "TechGear",
                "stock": 32,
                "status": "active",
                "rating": "4.6",
                "reviewCount": 156,
            },
            {
                "id": "prod-5",
                "name": "Artisanal Scented Candle",
                "description": "Hand-poured soy wax candle with natural essential oils. Features a clean-burning wooden wick and comes in a reusable frosted glass container.",
                "price": "28.00",
                "categoryId": "cat-2",
                "categoryName": "Home & Living",
                "image": "https://images.unsplash.com/photo-1602874801006-a7b7e740e39e?w=800",
                "images": [
                    "https://images.unsplash.com/photo-1602874801006-a7b7e740e39e?w=800",
                    "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800",
                ],
                "sellerId": "seller-5",
                "sellerName": "CozyCraft",
                "stock": 67,
                "status": "active",
                "rating": "5.0",
                "reviewCount": 94,
            },
            {
                "id": "prod-6",
                "name": "Premium Headphones",
                "description": "Over-ear noise-canceling headphones with premium sound quality, 30-hour battery life, and comfortable memory foam ear cushions.",
                "price": "299.99",
                "categoryId": "cat-3",
                "categoryName": "Electronics & Tech",
                "image": "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800",
                "images": [
                    "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800",
                    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
                ],
                "sellerId": "seller-1",
                "sellerName": "AudioPro",
                "stock": 21,
                "status": "active",
                "rating": "4.9",
                "reviewCount": 267,
            },
            {
                "id": "prod-7",
                "name": "Stainless Steel Water Bottle",
                "description": "Insulated stainless steel water bottle keeps drinks cold for 24 hours or hot for 12 hours. BPA-free, leak-proof design in ocean blue.",
                "price": "35.00",
                "categoryId": "cat-2",
                "categoryName": "Home & Living",
                "image": "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800",
                "images": [
                    "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800",
                    "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=800",
                ],
                "sellerId": "seller-6",
                "sellerName": "EcoLife",
                "stock": 89,
                "status": "active",
                "rating": "4.8",
                "reviewCount": 178,
            },
            {
                "id": "prod-8",
                "name": "Macrame Wall Hanging",
                "description": "Handcrafted macrame wall art made from natural cotton rope. Adds a bohemian touch to any room. Comes with wooden dowel for easy hanging.",
                "price": "65.00",
                "categoryId": "cat-2",
                "categoryName": "Home & Living",
                "image": "https://images.unsplash.com/photo-1617098900591-3f90928e8c54?w=800",
                "images": [
                    "https://images.unsplash.com/photo-1617098900591-3f90928e8c54?w=800",
                    "https://images.unsplash.com/photo-1618220924273-338d82d6f886?w=800",
                ],
                "sellerId": "seller-7",
                "sellerName": "HandmadeHome",
                "stock": 12,
                "status": "active",
                "rating": "4.7",
                "reviewCount": 52,
            },
        ]
        for prod in products_data:
            self.products[prod["id"]] = prod

        # review
        self.review = [
            {
                "quote": "I found exactly what I was looking for! The quality is outstanding and the seller was incredibly responsive. Will definitely shop here again.",
                "name": "Sarah Mitchell",
                "role": "Customer",
                "avatar": "https://unsplash.com/photos/closeup-photography-of-woman-smiling-mEZ3PoFGs_k",
            }
            #   {
            #     quote: "Amazing platform for discovering unique products. The checkout process was smooth and my order arrived quickly. Highly recommend!",
            #     name: "Michael Chen",
            #     role: "Customer",
            #     avatar: customerAvatar2
            #   },
            #   {
            #     quote: "As a seller, this platform has transformed my business. The tools are easy to use and I've reached so many new customers. Couldn't be happier!",
            #     name: "Emma Rodriguez",
            #     role: "Seller",
            #     avatar: sellerAvatar1
            #   },
            #   {
            #     quote: "I've been selling here for 6 months and my revenue has tripled. The seller dashboard makes managing everything so simple. Best decision ever!",
            #     name: "David Thompson",
            #     role: "Seller",
            #     avatar: sellerAvatar2
            #   },
        ]

    # Products
    def get_products(
        self,
        category_id: Optional[str] = None,
        search: Optional[str] = None,
        seller_id: Optional[str] = None,
        limit: Optional[int] = None,
        offset: Optional[int] = None,
    ):
        products = list(self.products.values())

        if category_id and category_id != "all":
            products = [p for p in products if p["categoryId"] == category_id]

        if search:
            search_lower = search.lower()
            products = [
                p
                for p in products
                if search_lower in p["name"].lower()
                or search_lower in p["description"].lower()
            ]

        if seller_id:
            products = [p for p in products if p["sellerId"] == seller_id]

        # Pagination
        offset = offset or 0
        if limit:
            products = products[offset : offset + limit]
        else:
            products = products[offset:]

        return products

    def get_product(self, product_id: str):
        return self.products.get(product_id)

    def create_product(self, product_data: dict):
        product_id = str(uuid4())
        product = {"id": product_id, "rating": "0", "reviewCount": 0, **product_data}
        self.products[product_id] = product
        return product

    def update_product(self, product_id: str, updates: dict):
        if product_id not in self.products:
            return None
        product = self.products[product_id]
        product.update(updates)
        return product

    def delete_product(self, product_id: str):
        if product_id in self.products:
            del self.products[product_id]
            return True
        return False

    # Categories
    def get_categories(self):
        return list(self.categories.values())

    def get_category(self, category_id: str):
        return self.categories.get(category_id)

    def create_category(self, category_data: dict):
        category_id = str(uuid4())
        category = {"id": category_id, **category_data}
        self.categories[category_id] = category
        return category

    # Cart
    def get_cart_items(self, session_id: str):
        return [
            item for item in self.cart_items.values() if item["sessionId"] == session_id
        ]

    def get_cart_item(self, item_id: str):
        return self.cart_items.get(item_id)

    def add_to_cart(self, item_data: dict):
        item_id = item_data.get("id")
        item = {"id": item_id, **item_data}
        self.cart_items[item_id] = item
        return item

    def update_cart_item(self, item_id: str, quantity: int):
        if item_id not in self.cart_items:
            return None
        self.cart_items[item_id]["quantity"] = quantity
        return self.cart_items[item_id]

    def remove_from_cart(self, item_id: str):
        if item_id in self.cart_items["session"]:
            del self.cart_items[item_id]
            return True
        return False

    def clear_cart(self, session_id: str):
        items_to_delete = [
            id
            for id, item in self.cart_items.items()
            if item["sessionId"] == session_id
        ]
        for item_id in items_to_delete:
            del self.cart_items[item_id]

    # Orders
    def get_orders(self, seller_id: Optional[str] = None):
        orders = list(self.orders.values())
        if seller_id:
            orders = [o for o in orders if o["sellerId"] == seller_id]
        return sorted(orders, key=lambda x: x["createdAt"], reverse=True)

    def get_order(self, order_id: str):
        return self.orders.get(order_id)

    def create_order(self, order_data: dict):
        order_id = str(uuid4())
        order = {"id": order_id, "createdAt": datetime.now().isoformat(), **order_data}
        self.orders[order_id] = order
        return order

    def get_review(self):
        print(self.review)
        return self.review
    # Seller Stats
    def get_seller_stats(self, seller_id: str):
        seller_products = [
            p for p in self.products.values() if p["sellerId"] == seller_id
        ]
        seller_orders = [o for o in self.orders.values() if o["sellerId"] == seller_id]

        revenue = sum(float(o["total"]) for o in seller_orders)
        active_listings = sum(1 for p in seller_products if p["status"] == "active")
        total_orders = len(seller_orders)
        avg_order_value = revenue / total_orders if total_orders > 0 else 0

        return {
            "revenue": revenue,
            "activeListings": active_listings,
            "totalOrders": total_orders,
            "avgOrderValue": avg_order_value,
        }


# Initialize
storage = Storage()

# FastAPI App
app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5001",
        "http://localhost:5000",
        "http://localhost:3000",
        "http://0.0.0.0:5001",
        "http://0.0.0.0:5000",
        "http://0.0.0.0:3000",
        "127.0.0.1:5001",
        "127.0.0.1:5000",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type"],
)


# Products
@app.get("/api/products")
async def get_products(
    category: Optional[str] = None,
    search: Optional[str] = None,
    limit: Optional[int] = None,
    offset: Optional[int] = None,
):
    return storage.get_products(
        category_id=category, search=search, limit=limit, offset=offset
    )


@app.get("/api/products/{product_id}")
async def get_product(product_id: str):
    product = storage.get_product(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@app.get("/api/review")
async def get_review():
    product = [{
                "quote": "I found exactly what I was looking for! The quality is outstanding and the seller was incredibly responsive. Will definitely shop here again.",
                "name": "Sarah Mitchell",
                "role": "Customer",
                "avatar": "https://unsplash.com/photos/closeup-photography-of-woman-smiling-mEZ3PoFGs_k",
            }]
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@app.post("/api/products")
async def create_product(product: CreateProductRequest):
    return storage.create_product(product.dict())


@app.patch("/api/products/{product_id}")
async def update_product(product_id: str, product: UpdateProductRequest):
    updates = {k: v for k, v in product.dict().items() if v is not None}
    result = storage.update_product(product_id, updates)
    if not result:
        raise HTTPException(status_code=404, detail="Product not found")
    return result


@app.delete("/api/products/{product_id}")
async def delete_product(product_id: str):
    if not storage.delete_product(product_id):
        raise HTTPException(status_code=404, detail="Product not found")
    return {"status": "deleted"}


# Categories
@app.get("/api/categories")
async def get_categories():
    return storage.get_categories()


@app.get("/api/categories/{category_id}")
async def get_category(category_id: str):
    category = storage.get_category(category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category


# Cart
@app.get("/api/cart")
async def get_cart(request: Request):
    session_id = request.headers.get("X-Session-ID", "default-session")
    cart_items = storage.get_cart_items(session_id)
    enriched_items = []
    for item in cart_items:
        product = storage.get_product(item["productId"])
        enriched_items.append({"session": item, "product": product})
    return enriched_items


@app.post("/api/cart")
async def add_to_cart(request: Request, cart_data: AddToCartRequest):
    session_id = request.headers.get("X-Session-ID", "default-session")

    # Check if item exists
    existing_items = storage.get_cart_items(session_id)
    existing_item = next(
        (i for i in existing_items if i["productId"] == cart_data.productId), None
    )

    if existing_item:
        # Update quantity
        updated = storage.update_cart_item(
            existing_item["id"], existing_item["quantity"] + cart_data.quantity
        )
        return updated

    # Add new item
    item = storage.add_to_cart(
        {
            "sessionId": session_id,
            "productId": cart_data.productId,
            "quantity": cart_data.quantity,
        }
    )
    return item


@app.patch("/api/cart/{item_id}")
async def update_cart_item(item_id: str, data: UpdateCartItemRequest):
    if data.quantity < 1:
        raise HTTPException(status_code=400, detail="Invalid quantity")
    result = storage.update_cart_item(item_id, data.quantity)
    if not result:
        raise HTTPException(status_code=404, detail="Cart item not found")
    return result


@app.delete("/api/cart/{item_id}")
async def remove_from_cart(item_id: str):
    if not storage.remove_from_cart(item_id):
        raise HTTPException(status_code=404, detail="Cart item not found")
    return {"status": "deleted"}


# Orders
@app.get("/api/seller/orders")
async def get_seller_orders(seller_id: Optional[str] = "seller-1"):
    return storage.get_orders(seller_id)


@app.post("/api/orders")
async def create_order(order: CreateOrderRequest):
    return storage.create_order(order.dict())


# Seller
@app.get("/api/seller/products")
async def get_seller_products(seller_id: Optional[str] = "seller-1"):
    return storage.get_products(seller_id=seller_id)


@app.get("/api/seller/stats")
async def get_seller_stats(seller_id: Optional[str] = "seller-1"):
    return storage.get_seller_stats(seller_id)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=5000)
