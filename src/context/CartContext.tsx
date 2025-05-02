
import React, { createContext, useContext, useState, useEffect } from "react";
import { CartItem, Medicine } from "../types/medicine";
import { useToast } from "@/components/ui/use-toast";

interface CartContextType {
  items: CartItem[];
  addItem: (medicine: Medicine, quantity?: number) => void;
  removeItem: (medicineId: string) => void;
  updateQuantity: (medicineId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { toast } = useToast();
  
  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setItems(parsedCart);
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error);
      }
    }
  }, []);
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addItem = (medicine: Medicine, quantity = 1) => {
    if (quantity <= 0) return;
    
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.medicine.id === medicine.id);
      
      if (existingItem) {
        // Check if we're adding more than available stock
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > medicine.stock) {
          toast({
            title: "Cannot add more",
            description: `Only ${medicine.stock} items available in stock.`,
            variant: "destructive",
          });
          return prevItems;
        }
        
        // Update existing item
        return prevItems.map(item => 
          item.medicine.id === medicine.id 
            ? { ...item, quantity: newQuantity } 
            : item
        );
      } else {
        // Check if quantity exceeds stock
        if (quantity > medicine.stock) {
          toast({
            title: "Cannot add that many",
            description: `Only ${medicine.stock} items available in stock.`,
            variant: "destructive",
          });
          quantity = medicine.stock;
        }
        
        // Add new item
        return [...prevItems, { medicine, quantity }];
      }
    });
    
    toast({
      title: "Added to cart",
      description: `${quantity} ${quantity > 1 ? 'items' : 'item'} added to your cart.`,
    });
  };

  const removeItem = (medicineId: string) => {
    setItems(prevItems => prevItems.filter(item => item.medicine.id !== medicineId));
    
    toast({
      title: "Removed from cart",
      description: "Item removed from your cart.",
    });
  };

  const updateQuantity = (medicineId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(medicineId);
      return;
    }
    
    setItems(prevItems => {
      const item = prevItems.find(item => item.medicine.id === medicineId);
      if (!item) return prevItems;
      
      // Check against available stock
      if (quantity > item.medicine.stock) {
        toast({
          title: "Cannot add more",
          description: `Only ${item.medicine.stock} items available in stock.`,
          variant: "destructive",
        });
        quantity = item.medicine.stock;
      }
      
      return prevItems.map(item => 
        item.medicine.id === medicineId 
          ? { ...item, quantity } 
          : item
      );
    });
  };

  const clearCart = () => {
    setItems([]);
  };

  const total = items.reduce((acc, item) => acc + (item.medicine.price * item.quantity), 0);
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        total,
        itemCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
