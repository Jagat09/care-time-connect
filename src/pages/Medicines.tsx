
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMedicines } from "@/services/medicineService";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Search, ShoppingCart } from "lucide-react";
import MedicineCard from "@/components/MedicineCard";
import { useCart } from "@/context/CartContext";
import { Link } from "react-router-dom";

const Medicines: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const { itemCount } = useCart();
  
  const { data: medicines, isLoading, error } = useQuery({
    queryKey: ["medicines"],
    queryFn: getMedicines
  });

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Error loading medicines",
        description: "Failed to load medicines. Please try again later."
      });
    }
  }, [error, toast]);

  const filteredMedicines = medicines?.filter(medicine =>
    medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (medicine.description && medicine.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Medicines</h1>
          <p className="text-gray-600">Browse our selection of high-quality medicines</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              className="pl-10 w-full sm:w-64"
              placeholder="Search medicines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Link to="/cart">
            <Button variant="outline" className="relative">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Cart
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-medical-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Button>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-md h-80 animate-pulse"></div>
          ))}
        </div>
      ) : filteredMedicines && filteredMedicines.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMedicines.map((medicine) => (
            <MedicineCard key={medicine.id} medicine={medicine} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">
            {searchTerm ? "No medicines match your search" : "No medicines available"}
          </p>
        </div>
      )}
    </div>
  );
};

export default Medicines;
