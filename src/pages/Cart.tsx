
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import CartItemComponent from "@/components/CartItem";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, ShoppingCart, Package } from "lucide-react";
import { createOrder } from "@/services/medicineService";

const Cart: React.FC = () => {
  const { items, total, clearCart } = useCart();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [shippingAddress, setShippingAddress] = useState("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  
  const handlePlaceOrder = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please login to place an order."
      });
      navigate("/login", { state: { from: "/cart" } });
      return;
    }
    
    if (!shippingAddress.trim()) {
      toast({
        variant: "destructive",
        title: "Shipping address required",
        description: "Please enter a shipping address."
      });
      return;
    }
    
    if (items.length === 0) {
      toast({
        variant: "destructive",
        title: "Cart is empty",
        description: "Please add items to your cart before placing an order."
      });
      return;
    }
    
    try {
      setIsPlacingOrder(true);
      
      const orderItems = items.map(item => ({
        medicineId: item.medicine.id,
        quantity: item.quantity,
        pricePerUnit: item.medicine.price,
        totalPrice: item.medicine.price * item.quantity
      }));
      
      await createOrder(
        user.id,
        shippingAddress,
        total,
        orderItems
      );
      
      clearCart();
      
      toast({
        title: "Order placed successfully",
        description: "Your order has been placed. Thank you for your purchase!"
      });
      
      navigate("/my-orders");
    } catch (error) {
      console.error("Error placing order:", error);
      toast({
        variant: "destructive",
        title: "Failed to place order",
        description: "An error occurred while placing your order. Please try again."
      });
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Button 
        variant="ghost" 
        className="mb-6" 
        onClick={() => navigate("/medicines")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Continue Shopping
      </Button>
      
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
      
      {items.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="space-y-1">
                {items.map(item => (
                  <CartItemComponent key={item.medicine.id} item={item} />
                ))}
              </div>
            </Card>
          </div>
          
          <div className="lg:col-span-1">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>Free</span>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="flex justify-between font-bold text-lg mb-6">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              
              <div className="mb-6">
                <label htmlFor="shipping-address" className="block text-sm font-medium text-gray-700 mb-2">
                  Shipping Address
                </label>
                <Textarea
                  id="shipping-address"
                  placeholder="Enter your full address"
                  rows={4}
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="w-full"
                />
              </div>
              
              <Button 
                className="w-full" 
                size="lg" 
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder}
              >
                {isPlacingOrder ? (
                  "Processing..."
                ) : (
                  <>
                    <Package className="mr-2 h-5 w-5" />
                    Place Order
                  </>
                )}
              </Button>
            </Card>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <ShoppingCart className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Looks like you haven't added any medicines to your cart yet.</p>
          <Button onClick={() => navigate("/medicines")}>Browse Medicines</Button>
        </div>
      )}
    </div>
  );
};

export default Cart;
