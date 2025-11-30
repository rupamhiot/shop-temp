import { useState } from "react";
import { Link, useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, Star, Minus, Plus, ArrowLeft } from "lucide-react";
import { CartDrawer } from "@/components/cart-drawer";
import type { Product } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [cartOpen, setCartOpen] = useState(false);
  const { toast } = useToast();

  const { data: product, isLoading} = useQuery<Product>({
    queryKey: [`/api/products/${id}`],
  });

  const { data: relatedProducts } = useQuery<Product[]>({
    queryKey: ["/api/products", { category: product?.categoryId, limit: 4 }],
    enabled: !!product?.categoryId,
  });

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      if (!product) return;
      return apiRequest("POST", "/api/cart", {
        productId: product.id,
        quantity: quantity,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Added to cart",
        description: `${quantity} × ${product?.name} added to your cart`,
      });
      setQuantity(1); // Reset quantity after successful add
      setCartOpen(true);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    },
  });

  const handleAddToCart = () => {
    addToCartMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Product not found</h2>
          <Link href="/shop">
            <Button>Back to Shop</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Normalize numeric values with fallbacks
  const productPrice = Number(product.price) || 0;
  const productStock = Number(product.stock) || 0;
  const productRating = Number(product.rating) || 0;

  const images = product.images || [product.image];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/">
            <a className="text-2xl font-bold text-foreground hover-elevate active-elevate-2 px-3 py-1 rounded-md" data-testid="link-home">
              ShopHub
            </a>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/shop">
              <Button variant="ghost" data-testid="button-shop">Shop</Button>
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
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link href="/shop">
            <a className="hover-elevate px-2 py-1 rounded-md">Shop</a>
          </Link>
          <span>/</span>
          <span>{product.categoryName}</span>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </div>

        {/* Product Content */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Images */}
          <div>
            <div className="aspect-square bg-card rounded-lg overflow-hidden mb-4">
              <img 
                src={images[selectedImage]} 
                alt={product.name}
                className="w-full h-full object-cover"
                data-testid="img-product-main"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-md overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? 'border-primary' : 'border-border hover-elevate'
                  }`}
                  data-testid={`button-thumbnail-${index}`}
                >
                  <img 
                    src={image} 
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-4xl font-bold mb-4" data-testid="text-product-name">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-5 w-5 ${
                      i < Math.floor(productRating) 
                        ? 'fill-yellow-400 text-yellow-400' 
                        : 'text-muted-foreground'
                    }`}
                  />
                ))}
              </div>
              <span className="text-muted-foreground">
                {productRating.toFixed(1)} ({product.reviewCount || 0} reviews)
              </span>
            </div>

            <div className="text-4xl font-bold text-primary mb-6" data-testid="text-product-price">
              ${productPrice.toFixed(2)}
            </div>

            <div className="mb-6">
              <p className="text-muted-foreground mb-2">Sold by</p>
              <p className="font-semibold text-lg" data-testid="text-seller-name">{product.sellerName}</p>
            </div>

            <div className="mb-8">
              <p className="text-sm text-muted-foreground mb-1">Availability</p>
              {productStock > 0 ? (
                <p className="text-green-600 font-medium" data-testid="text-stock-status">
                  In Stock ({productStock} available)
                </p>
              ) : (
                <p className="text-destructive font-medium" data-testid="text-stock-status">Out of Stock</p>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="mb-8">
              <p className="font-medium mb-3">Quantity</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-md">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    data-testid="button-quantity-decrease"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-6 py-2 font-medium" data-testid="text-quantity">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(prev => Math.min(productStock, prev + 1))}
                    disabled={productStock === 0 || quantity >= productStock}
                    data-testid="button-quantity-increase"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="flex gap-4">
              <Button 
                size="lg" 
                className="flex-1"
                disabled={productStock === 0}
                onClick={handleAddToCart}
                data-testid="button-add-to-cart"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <Card className="p-6 mb-16">
          <Tabs defaultValue="description">
            <TabsList className="mb-6">
              <TabsTrigger value="description" data-testid="tab-description">Description</TabsTrigger>
              <TabsTrigger value="seller" data-testid="tab-seller">Seller Info</TabsTrigger>
              <TabsTrigger value="reviews" data-testid="tab-reviews">Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="prose max-w-none">
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            </TabsContent>
            <TabsContent value="seller">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">{product.sellerName}</h3>
                <p className="text-muted-foreground">
                  A trusted seller with hundreds of satisfied customers. Browse more products from this seller.
                </p>
                <Button variant="outline">View Seller Profile</Button>
              </div>
            </TabsContent>
            <TabsContent value="reviews">
              <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div>
            <h2 className="text-3xl font-semibold mb-8">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.slice(0, 4).map((relatedProduct) => (
                <Link key={relatedProduct.id} href={`/product/${relatedProduct.id}`}>
                  <Card className="overflow-hidden hover-elevate active-elevate-2 transition-transform hover:scale-105 cursor-pointer" data-testid={`card-related-${relatedProduct.id}`}>
                    <div className="aspect-square bg-card overflow-hidden">
                      <img 
                        src={relatedProduct.image} 
                        alt={relatedProduct.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="font-medium mb-2 line-clamp-1">{relatedProduct.name}</h3>
                      <p className="text-lg font-semibold">${Number(relatedProduct.price).toFixed(2)}</p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </div>
  );
}
