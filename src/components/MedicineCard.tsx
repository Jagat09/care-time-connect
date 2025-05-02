
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Medicine } from '@/types/medicine';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, Plus } from 'lucide-react';

interface MedicineCardProps {
  medicine: Medicine;
}

const MedicineCard: React.FC<MedicineCardProps> = ({ medicine }) => {
  const { addItem } = useCart();
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(medicine, 1);
  };
  
  return (
    <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
      <Link to={`/medicines/${medicine.id}`} className="flex-grow flex flex-col">
        <div className="w-full h-48 overflow-hidden bg-gray-100">
          {medicine.image ? (
            <img 
              src={medicine.image} 
              alt={medicine.name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No image available
            </div>
          )}
        </div>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{medicine.name}</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-gray-600 line-clamp-2">
            {medicine.description || "No description available"}
          </p>
          <div className="mt-4 flex justify-between items-center">
            <p className="text-lg font-semibold">${medicine.price.toFixed(2)}</p>
            <p className={`text-sm ${medicine.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {medicine.stock > 0 ? `${medicine.stock} in stock` : 'Out of stock'}
            </p>
          </div>
        </CardContent>
      </Link>
      <CardFooter className="pt-0">
        <Button 
          onClick={handleAddToCart} 
          className="w-full" 
          disabled={medicine.stock < 1}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MedicineCard;
