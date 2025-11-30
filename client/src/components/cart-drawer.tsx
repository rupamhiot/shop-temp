import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ShoppingBag, Minus, Plus, Trash2 } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { CartItem, Product } from "@shared/schema";

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface CartItemWithProduct extends CartItem {
  product?: Product;
  session?: {}
}

export function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const { toast } = useToast();

  const { data: cartItems = [] } = useQuery<CartItemWithProduct[]>({
    queryKey: ["/api/cart"],
  });

  console.log(cartItems)

  const updateQuantityMutation = useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: string; quantity: number }) => {
      return apiRequest("PATCH", `/api/cart/${itemId}`, { itemId, quantity });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: async (itemId: string) => {
      return apiRequest("DELETE", `/api/cart/${itemId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Item removed",
        description: "Item removed from cart",
      });
    },
  });

  const subtotal = cartItems.reduce((sum, item) => {
    return sum + (item.product ? Number(item.product.price) * item.session?.quantity : 0);
  }, 0);

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantityMutation.mutate({ itemId, quantity: newQuantity });
  };

  const handleRemoveItem = (itemId: string) => {
    removeItemMutation.mutate(itemId);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2" data-testid="text-cart-title">
            <ShoppingBag className="h-5 w-5" />
            Shopping Cart ({cartItems.length})
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-6">
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-6">Your cart is empty</p>
              <Button onClick={() => onOpenChange(false)} data-testid="button-continue-shopping">
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4" data-testid={`cart-item-${item.id}`}>
                  {item.product && (
                    <>
                      <div className="w-20 h-20 flex-shrink-0 rounded-md overflow-hidden bg-card">
                        <img 
                          src={item.product.image} 
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium line-clamp-1 mb-1" data-testid={`text-cart-item-name-${item.id}`}>
                          {item.product.name}
                        </h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          ${Number(item.product.price).toFixed(2)}
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center border rounded-md">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => handleUpdateQuantity(item.product.id, item.session?.quantity - 1)}
                              disabled={updateQuantityMutation.isPending}
                              data-testid={`button-cart-decrease-${item.id}`}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="px-3 text-sm" data-testid={`text-cart-quantity-${item?.product.id}`}>
                              {item.session?.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => handleUpdateQuantity(item.product?.id, item.session?.quantity + 1)}
                              disabled={updateQuantityMutation.isPending}
                              data-testid={`button-cart-increase-${item.id}`}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleRemoveItem(item.product.id)}
                            disabled={removeItemMutation.isPending}
                            data-testid={`button-cart-remove-${item.id}`}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="font-semibold" data-testid={`text-cart-item-total-${item.productId}`}>
                        ${(Number(item.product.price) * item.session?.quantity).toFixed(2)}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="border-t pt-6 space-y-4">
            <div className="flex justify-between text-lg font-semibold">
              <span>Subtotal</span>
              <span data-testid="text-cart-subtotal">${subtotal.toFixed(2)}</span>
            </div>
            <Button className="w-full" size="lg" data-testid="button-checkout">
              Proceed to Checkout
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => onOpenChange(false)}
              data-testid="button-continue-shopping-footer"
            >
              Continue Shopping
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
