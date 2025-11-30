import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, Search, MoreVertical, Edit, Trash2, Eye } from "lucide-react";
import { SellerLayout } from "@/components/seller-layout";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@shared/schema";

export default function SellerProducts() {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/seller/products"],
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (productId: string) => {
      return apiRequest("DELETE", `/api/products/${productId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/seller/products"] });
      toast({
        title: "Product deleted",
        description: "The product has been removed successfully",
      });
    },
  });

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <SellerLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2" data-testid="text-products-title">Products</h1>
            <p className="text-muted-foreground">Manage your product inventory</p>
          </div>
          <Link href="/seller/products/new">
            <Button data-testid="button-add-product">
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </Link>
        </div>

        <Card className="p-6">
          <div className="mb-6">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="input-search-products"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : filteredProducts.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id} data-testid={`row-product-${product.id}`}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-12 h-12 rounded-md object-cover"
                          />
                          <div>
                            <p className="font-medium" data-testid={`text-product-name-${product.id}`}>
                              {product.name}
                            </p>
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {product.description}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell data-testid={`text-product-price-${product.id}`}>
                        ${Number(product.price).toFixed(2)}
                      </TableCell>
                      <TableCell data-testid={`text-product-stock-${product.id}`}>
                        {product.stock}
                      </TableCell>
                      <TableCell>{product.categoryName}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={product.status === 'active' ? 'default' : 'secondary'}
                          data-testid={`badge-status-${product.id}`}
                        >
                          {product.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              data-testid={`button-actions-${product.id}`}
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <Link href={`/product/${product.id}`}>
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </DropdownMenuItem>
                            </Link>
                            <Link href={`/seller/products/${product.id}/edit`}>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                            </Link>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => deleteProductMutation.mutate(product.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-6">
                {searchTerm ? 'No products found' : 'No products yet'}
              </p>
              {!searchTerm && (
                <Link href="/seller/products/new">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Product
                  </Button>
                </Link>
              )}
            </div>
          )}
        </Card>
      </div>
    </SellerLayout>
  );
}
