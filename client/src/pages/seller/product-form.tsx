import { useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { SellerLayout } from "@/components/seller-layout";
import { insertProductSchema, type InsertProduct, type Product } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

export default function ProductForm() {
  const { id } = useParams<{ id?: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const isEditing = !!id && id !== 'new';

  const { data: product } = useQuery<Product>({
    queryKey: [`/api/products/${id}`],
    enabled: isEditing,
  });

  const { data: categories = [] } = useQuery<Array<{ id: string; name: string }>>({
    queryKey: ["/api/categories"],
  });

  const form = useForm<InsertProduct>({
    resolver: zodResolver(insertProductSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      categoryId: "",
      categoryName: "",
      image: "",
      images: [],
      sellerId: "seller-1",
      sellerName: "Your Store",
      stock: 0,
      status: "active",
    },
  });

  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name,
        description: product.description,
        price: product.price,
        categoryId: product.categoryId,
        categoryName: product.categoryName,
        image: product.image,
        images: product.images,
        sellerId: product.sellerId,
        sellerName: product.sellerName,
        stock: product.stock,
        status: product.status,
      });
    }
  }, [product, form]);

  const createProductMutation = useMutation({
    mutationFn: async (data: InsertProduct) => {
      return apiRequest("POST", "/api/products", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/seller/products"] });
      toast({
        title: "Product created",
        description: "Your product has been added successfully",
      });
      setLocation("/seller/products");
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async (data: InsertProduct) => {
      return apiRequest("PATCH", `/api/products/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/seller/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products", id] });
      toast({
        title: "Product updated",
        description: "Your changes have been saved",
      });
      setLocation("/seller/products");
    },
  });

  const onSubmit = (data: InsertProduct) => {
    const selectedCategory = categories.find(c => c.id === data.categoryId);
    const formData = {
      ...data,
      categoryName: selectedCategory?.name || "",
      images: data.image ? [data.image] : [],
    };

    if (isEditing) {
      updateProductMutation.mutate(formData);
    } else {
      createProductMutation.mutate(formData);
    }
  };

  const isPending = createProductMutation.isPending || updateProductMutation.isPending;

  return (
    <SellerLayout>
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Link href="/seller/products">
            <Button variant="ghost" size="icon" data-testid="button-back">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold mb-2" data-testid="text-form-title">
              {isEditing ? "Edit Product" : "Add New Product"}
            </h1>
            <p className="text-muted-foreground">
              {isEditing ? "Update your product details" : "Fill in the details to create a new product"}
            </p>
          </div>
        </div>

        <Card className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter product name" 
                        {...field} 
                        data-testid="input-product-name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe your product"
                        className="min-h-[120px]"
                        {...field}
                        data-testid="textarea-product-description"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price ($)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                          data-testid="input-product-price"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock Quantity</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          placeholder="0"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          data-testid="input-product-stock"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-product-category">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Image URL</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://example.com/image.jpg"
                        {...field}
                        data-testid="input-product-image"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch("image") && (
                <div className="rounded-md border p-4">
                  <p className="text-sm font-medium mb-2">Preview</p>
                  <div className="aspect-square max-w-xs bg-card rounded-md overflow-hidden">
                    <img 
                      src={form.watch("image")} 
                      alt="Product preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <Button 
                  type="submit" 
                  disabled={isPending}
                  data-testid="button-submit"
                >
                  {isPending ? "Saving..." : isEditing ? "Update Product" : "Create Product"}
                </Button>
                <Link href="/seller/products">
                  <Button 
                    type="button" 
                    variant="outline"
                    data-testid="button-cancel"
                  >
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </Form>
        </Card>
      </div>
    </SellerLayout>
  );
}
