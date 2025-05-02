
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getMedicineById } from "@/services/medicineService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, Minus, Plus, ArrowLeft } from "lucide-react";

const MedicineDetails: React.FC = () => {
  const { id = "" } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const { data: medicine, isLoading, error } = useQuery({
    queryKey: ["medicine", id],
    queryFn: () => getMedicineById(id),
    enabled: !!id
  });

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      const maxQuantity = medicine ? medicine.stock : 1;
      setQuantity(Math.min(value, maxQuantity));
    }
  };

  const incrementQuantity = () => {
    if (medicine && quantity < medicine.stock) {
      setQuantity(prev => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (medicine) {
      addItem(medicine, quantity);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col lg:flex-row animate-pulse">
            <div className="lg:w-1/2 bg-gray-200 h-96 rounded-lg"></div>
            <div className="lg:w-1/2 lg:pl-8 mt-8 lg:mt-0 space-y-4">
              <div className="h-10 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-10 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !medicine) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Medicine Not Found</h2>
        <p className="text-gray-600 mb-8">The medicine you are looking for does not exist or has been removed.</p>
        <Button onClick={() => navigate("/medicines")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to All Medicines
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Button 
        variant="ghost" 
        className="mb-6" 
        onClick={() => navigate("/medicines")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Medicines
      </Button>
      
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-1/2">
            <Card className="overflow-hidden">
              {medicine.image ? (
                <img
                  src={medicine.image}
                  alt={medicine.name}
                  className="w-full h-96 object-cover object-center"
                />
              ) : (
                <div className="w-full h-96 bg-gray-100 flex items-center justify-center text-gray-400">
                  No image available
                </div>
              )}
            </Card>
          </div>
          
          <div className="lg:w-1/2 lg:pl-8 mt-8 lg:mt-0">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{medicine.name}</h1>
            <div className="text-2xl font-semibold text-medical-500 mb-4">
              ${medicine.price.toFixed(2)}
            </div>
            
            <Separator className="my-4" />
            
            <div className="mb-6">
              <p className="text-gray-700 whitespace-pre-line">{medicine.description}</p>
            </div>
            
            <div className="mb-4">
              <p className={`${medicine.stock > 0 ? 'text-green-600' : 'text-red-600'} font-medium`}>
                {medicine.stock > 0 
                  ? `${medicine.stock} in stock` 
                  : 'Out of stock'}
              </p>
            </div>
            
            {medicine.stock > 0 && (
              <div className="mb-6">
                <div className="flex items-center space-x-4">
                  <p className="text-gray-700">Quantity:</p>
                  <div className="flex items-center">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-10 w-10 rounded-r-none" 
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      type="number"
                      value={quantity}
                      onChange={handleQuantityChange}
                      className="w-16 rounded-none text-center"
                      min="1"
                      max={medicine.stock}
                    />
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-10 w-10 rounded-l-none" 
                      onClick={incrementQuantity}
                      disabled={quantity >= medicine.stock}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            <Button 
              className="w-full" 
              size="lg"
              disabled={medicine.stock < 1}
              onClick={handleAddToCart}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicineDetails;
