import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Package, 
  DollarSign, 
  ShoppingCart, 
  TrendingUp,
  Plus,
  Eye
} from "lucide-react";
import { SellerLayout } from "@/components/seller-layout";
import type { Product, Order } from "@shared/schema";

export default function SellerDashboard() {
  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/seller/products"],
  });

  const { data: orders = [] } = useQuery<Order[]>({
    queryKey: ["/api/seller/orders"],
  });

  const activeListings = products.filter(p => p.status === 'active').length;
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total), 0);
  
  const recentOrders = orders.slice(0, 5);

  return (
    <SellerLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2" data-testid="text-dashboard-title">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your business overview.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-stat-revenue">
                ${totalRevenue.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">All time earnings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-stat-listings">
                {activeListings}
              </div>
              <p className="text-xs text-muted-foreground">Products available</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-stat-orders">
                {totalOrders}
              </div>
              <p className="text-xs text-muted-foreground">All time orders</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-stat-avg-order">
                ${totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : '0.00'}
              </div>
              <p className="text-xs text-muted-foreground">Per order average</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Link href="/seller/products/new">
              <Button data-testid="button-add-product">
                <Plus className="mr-2 h-4 w-4" />
                Add New Product
              </Button>
            </Link>
            <Link href="/seller/products">
              <Button variant="outline" data-testid="button-view-products">
                <Eye className="mr-2 h-4 w-4" />
                View All Products
              </Button>
            </Link>
          </div>
        </Card>

        {/* Recent Orders */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Recent Orders</h2>
            <Button variant="outline" size="sm">View All</Button>
          </div>
          
          {recentOrders.length > 0 ? (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div 
                  key={order.id} 
                  className="flex items-center justify-between p-4 border rounded-md hover-elevate"
                  data-testid={`order-${order.id}`}
                >
                  <div className="flex-1">
                    <p className="font-medium" data-testid={`text-order-buyer-${order.id}`}>
                      {order.buyerName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {order.buyerEmail}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold" data-testid={`text-order-total-${order.id}`}>
                      ${Number(order.total).toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {order.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No orders yet
            </div>
          )}
        </Card>
      </div>
    </SellerLayout>
  );
}
