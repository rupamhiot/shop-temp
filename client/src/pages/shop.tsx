import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, SlidersHorizontal, ShoppingCart, Star } from "lucide-react";
import { CartDrawer } from "@/components/cart-drawer";
import type { Product } from "@shared/schema";

export default function Shop() {
  const [location] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("featured");
  const [cartOpen, setCartOpen] = useState(false);
  const ITEMS_PER_PAGE = 8;

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products", { category: selectedCategory, search: searchTerm }],
  });

  const { data: categories } = useQuery<Array<{ id: string; name: string }>>({
    queryKey: ["/api/categories"],
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
          <Link href="/">
            <a className="text-2xl font-bold text-foreground hover-elevate active-elevate-2 px-3 py-1 rounded-md" data-testid="link-home">
              ShopHub
            </a>
          </Link>
          
          <div className="flex-1 max-w-2xl hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="input-search"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/seller/dashboard">
              <Button variant="ghost" data-testid="button-sell">Sell</Button>
            </Link>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setCartOpen(true)}
              data-testid="button-cart"
            >
              <ShoppingCart className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden px-6 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              data-testid="input-search-mobile"
            />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters Bar */}
        <div className="flex flex-wrap gap-4 items-center mb-8">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[200px]" data-testid="select-category">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories?.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[200px]" data-testid="select-sort">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Top Rated</SelectItem>
            </SelectContent>
          </Select>

          <div className="ml-auto">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" data-testid="button-filters">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="py-6">
                  <h3 className="font-semibold mb-4">Price Range</h3>
                  <div className="space-y-2">
                    <Input type="number" placeholder="Min" data-testid="input-price-min" />
                    <Input type="number" placeholder="Max" data-testid="input-price-max" />
                  </div>
                  <div className="mt-6">
                    <h3 className="font-semibold mb-4">Rating</h3>
                    <div className="space-y-2">
                      {[5, 4, 3].map((rating) => (
                        <label key={rating} className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" className="rounded" />
                          <div className="flex items-center gap-1">
                            {[...Array(rating)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            ))}
                            <span className="text-sm ml-1">& Up</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="aspect-square w-full" />
                <div className="p-6 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-6 w-1/4" />
                </div>
              </Card>
            ))}
          </div>
        ) : products && products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <Link key={product.id} href={`/product/${product.id}`}>
                  <Card className="overflow-hidden hover-elevate active-elevate-2 transition-transform hover:scale-105 cursor-pointer h-full" data-testid={`card-product-${product.id}`}>
                    <div className="aspect-square bg-card overflow-hidden">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="font-medium text-lg mb-2 line-clamp-1" data-testid={`text-product-name-${product.id}`}>
                        {product.name}
                      </h3>
                      {product.rating && (
                        <div className="flex items-center gap-1 mb-2">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm text-muted-foreground">{product.rating}</span>
                          {product.reviewCount && (
                            <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
                          )}
                        </div>
                      )}
                      <p className="text-sm text-muted-foreground mb-3">{product.sellerName}</p>
                      <p className="text-xl font-semibold" data-testid={`text-product-price-${product.id}`}>
                        ${Number(product.price).toFixed(2)}
                      </p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">No products found</p>
          </div>
        )}
      </div>

      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </div>
  );
}
