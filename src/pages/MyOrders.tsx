
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserOrders } from "@/services/orderApi";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Package } from "lucide-react";
import OrderCard from "@/components/OrderCard";

const MyOrders: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const { data: orders, isLoading, error } = useQuery({
    queryKey: ["orders", user?.id],
    queryFn: () => getUserOrders(user!.id),
    enabled: !!user,
    meta: {
      onError: () => {
        toast({
          variant: "destructive",
          title: "Failed to load orders",
          description: "Could not retrieve your order history. Please try again later."
        });
      }
    }
  });

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
        <p className="text-gray-600">Please login to view your orders.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>
      
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-md h-40 animate-pulse"></div>
          ))}
        </div>
      ) : orders && orders.length > 0 ? (
        <div className="max-w-3xl mx-auto space-y-4">
          {orders.map(order => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <Package className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders found</h2>
          <p className="text-gray-600">
            {error ? "An error occurred while loading your orders" : "You haven't placed any orders yet."}
          </p>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
