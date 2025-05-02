
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CartItem as CartItemType } from '@/types/medicine';
import { useCart } from '@/context/CartContext';
import { Plus, Minus, X } from 'lucide-react';

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeItem } = useCart();
  const { medicine, quantity } = item;

  const handleIncrement = () => {
    updateQuantity(medicine.id, quantity + 1);
  };

  const handleDecrement = () => {
    updateQuantity(medicine.id, quantity - 1);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value);
    if (!isNaN(newQuantity)) {
      updateQuantity(medicine.id, newQuantity);
    }
  };

  return (
    <div className="flex items-center space-x-4 py-4 border-b last:border-b-0">
      <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
        {medicine.image ? (
          <img src={medicine.image} alt={medicine.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
            No image
          </div>
        )}
      </div>
      
      <div className="flex-grow">
        <h3 className="font-medium">{medicine.name}</h3>
        <p className="text-sm text-gray-500 mt-1">
          ${medicine.price.toFixed(2)} each
        </p>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button 
          variant="outline" 
          size="icon" 
          className="h-8 w-8" 
          onClick={handleDecrement}
          disabled={quantity <= 1}
        >
          <Minus className="h-4 w-4" />
        </Button>
        
        <Input
          type="number"
          value={quantity}
          onChange={handleQuantityChange}
          className="w-16 text-center"
          min="1"
          max={medicine.stock}
        />
        
        <Button 
          variant="outline" 
          size="icon" 
          className="h-8 w-8" 
          onClick={handleIncrement}
          disabled={quantity >= medicine.stock}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="w-24 text-right font-medium">
        ${(medicine.price * quantity).toFixed(2)}
      </div>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="text-gray-500 hover:text-red-600" 
        onClick={() => removeItem(medicine.id)}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default CartItem;
