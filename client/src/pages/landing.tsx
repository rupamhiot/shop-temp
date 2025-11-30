import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShoppingBag, Package, TrendingUp, Users, Star, ArrowRight } from "lucide-react";
import type { Product, Category } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import heroImage from "@assets/generated_images/hero_lifestyle_product_collection.png";
import sellerWorkspace from "@assets/generated_images/seller_success_workspace.png";
import sellerCommunity from "@assets/generated_images/seller_community_benefits.png";



export default function Landing() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { data: products, isLoading } = useQuery<Product[]>({
      queryKey: ["/api/products", { category: selectedCategory, search: searchTerm }],
    });
  const { data: categories} = useQuery<Category[]>({
      queryKey: ["/api/categories", {}],
    });
  const { data: testimonials} = useQuery({
      queryKey: ["/api/review", {}],
    });
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/">
            <a className="text-2xl font-bold text-foreground hover-elevate active-elevate-2 px-3 py-1 rounded-md" data-testid="link-home">
              ShopHub
            </a>
          </Link>
          <nav className="hidden md:flex items-center gap-2">
            <Link href="/shop">
              <Button variant="ghost" data-testid="button-shop">Shop</Button>
            </Link>
            <Link href="/seller/dashboard">
              <Button variant="ghost" data-testid="button-sell">Sell</Button>
            </Link>
            <Link href="/shop">
              <Button variant="default" data-testid="button-get-started">Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        </div>
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6" data-testid="text-hero-title">
            Discover Unique Products<br />From Independent Sellers
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Shop curated collections or start selling your own products to thousands of customers
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/shop">
              <Button 
                size="lg" 
                className="bg-white/10 border border-white/20 text-white backdrop-blur-md hover-elevate active-elevate-2"
                data-testid="button-hero-shop"
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                Shop Now
              </Button>
            </Link>
            <Link href="/seller/dashboard">
              <Button 
                size="lg" 
                className="bg-primary border border-primary-border text-primary-foreground"
                data-testid="button-hero-sell"
              >
                <Package className="mr-2 h-5 w-5" />
                Start Selling
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4" data-testid="text-featured-title">Featured Products</h2>
            <p className="text-muted-foreground text-lg">Handpicked items from our top sellers</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products?.map((product) => (
              <Link key={product.id} href={`/product/${product.id}`}>
                <Card className="overflow-hidden hover-elevate active-elevate-2 transition-transform hover:scale-105 cursor-pointer" data-testid={`card-product-${product.id}`}>
                  <div className="aspect-square bg-card overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-medium text-lg mb-2 line-clamp-1" data-testid={`text-product-name-${product.id}`}>{product.name}</h3>
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-muted-foreground">{product.rating}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{product.sellerName}</p>
                    <p className="text-xl font-semibold" data-testid={`text-product-price-${product.id}`}>${product.price}</p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 md:py-24 bg-card">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4" data-testid="text-categories-title">Shop by Category</h2>
            <p className="text-muted-foreground text-lg">Explore our curated collections</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories?.map((category) => (
              <Link key={category.slug} href={`/shop?category=${category.slug}`}>
                <Card className="overflow-hidden relative h-64 hover-elevate active-elevate-2 cursor-pointer transition-transform hover:scale-105" data-testid={`card-category-${category.slug}`}>
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end">
                    <h3 className="text-white text-2xl font-semibold p-6" data-testid={`text-category-${category.slug}`}>
                      {category.name}
                    </h3>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Seller Benefits */}
      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4" data-testid="text-seller-benefits-title">Why Sell With Us?</h2>
            <p className="text-muted-foreground text-lg">Join thousands of successful sellers</p>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <Card className="p-6 text-center">
              <div className="text-4xl font-bold text-primary mb-2" data-testid="text-stat-sellers">10,000+</div>
              <p className="text-muted-foreground">Active Sellers</p>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-4xl font-bold text-primary mb-2" data-testid="text-stat-customers">500,000+</div>
              <p className="text-muted-foreground">Happy Customers</p>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-4xl font-bold text-primary mb-2" data-testid="text-stat-revenue">$5M+</div>
              <p className="text-muted-foreground">Monthly Revenue</p>
            </Card>
          </div>

          {/* Benefits Grid */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-12">
            <div>
              <img 
                src={sellerWorkspace} 
                alt="Seller workspace"
                className="rounded-lg w-full"
              />
            </div>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Grow Your Business</h3>
                  <p className="text-muted-foreground">Access powerful tools and analytics to scale your sales and reach new customers.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Join a Community</h3>
                  <p className="text-muted-foreground">Connect with other sellers, share tips, and learn from the best in the business.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Easy Management</h3>
                  <p className="text-muted-foreground">Intuitive dashboard to manage inventory, orders, and customer interactions seamlessly.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 space-y-4">
              <h3 className="text-2xl font-semibold">Start Selling in Minutes</h3>
              <p className="text-muted-foreground text-lg">Our streamlined onboarding process gets you up and running quickly. No complicated setup or hidden fees.</p>
              <Link href="/seller/dashboard">
                <Button size="lg" data-testid="button-become-seller">
                  Become a Seller
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            <div className="order-1 md:order-2">
              <img 
                src={sellerCommunity} 
                alt="Seller community"
                className="rounded-lg w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 bg-card">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4" data-testid="text-how-it-works-title">How It Works</h2>
            <p className="text-muted-foreground text-lg">Simple steps to start buying or selling</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Browse Products</h3>
              <p className="text-muted-foreground">Explore thousands of unique items from independent sellers</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Add to Cart</h3>
              <p className="text-muted-foreground">Select your favorites and proceed to secure checkout</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Enjoy Your Purchase</h3>
              <p className="text-muted-foreground">Fast shipping and excellent customer support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4" data-testid="text-testimonials-title">What People Are Saying</h2>
            <p className="text-muted-foreground text-lg">Real stories from our community</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {testimonials?.map((testimonial, index) => (
              <Card key={index} className="p-8 relative" data-testid={`card-testimonial-${index}`}>
                <div className="flex items-start gap-4 mb-4">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
                <p className="text-muted-foreground italic">"{testimonial.quote}"</p>
                <div className="flex gap-1 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-lg mb-4">Categories</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="/shop?category=fashion"><a className="hover-elevate px-2 py-1 rounded-md inline-block">Fashion</a></Link></li>
                <li><Link href="/shop?category=home-decor"><a className="hover-elevate px-2 py-1 rounded-md inline-block">Home & Living</a></Link></li>
                <li><Link href="/shop?category=electronics"><a className="hover-elevate px-2 py-1 rounded-md inline-block">Electronics</a></Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Company</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover-elevate px-2 py-1 rounded-md inline-block">About Us</a></li>
                <li><a href="#" className="hover-elevate px-2 py-1 rounded-md inline-block">Careers</a></li>
                <li><a href="#" className="hover-elevate px-2 py-1 rounded-md inline-block">Press</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Support</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover-elevate px-2 py-1 rounded-md inline-block">Help Center</a></li>
                <li><a href="#" className="hover-elevate px-2 py-1 rounded-md inline-block">Contact Us</a></li>
                <li><a href="#" className="hover-elevate px-2 py-1 rounded-md inline-block">Shipping Info</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Newsletter</h3>
              <p className="text-muted-foreground mb-4">Get the latest updates and offers</p>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Your email"
                  className="flex-1 px-4 py-2 rounded-md bg-background border border-input"
                  data-testid="input-newsletter-email"
                />
                <Button data-testid="button-subscribe">Subscribe</Button>
              </div>
            </div>
          </div>
          <div className="border-t pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 ShopHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
