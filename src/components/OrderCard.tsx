
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Order } from '@/types/medicine';
import { formatDistanceToNow } from 'date-fns';

interface OrderCardProps {
  order: Order;
  isAdmin?: boolean;
  onStatusChange?: (orderId: string, status: string) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, isAdmin = false, onStatusChange }) => {
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    shipped: "bg-indigo-100 text-indigo-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800"
  };
  
  const formatDate = (dateStr: string) => {
    try {
      return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
    } catch (error) {
      return "Invalid date";
    }
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onStatusChange) {
      onStatusChange(order.id, e.target.value);
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-500">Order #{order.id.slice(0, 8)}</p>
            <CardTitle className="flex items-center gap-2">
              <span>Order {formatDate(order.createdAt)}</span>
            </CardTitle>
            {isAdmin && order.customerName && (
              <p className="text-sm mt-1">Customer: {order.customerName}</p>
            )}
          </div>
          <div className="flex flex-col items-end">
            {isAdmin ? (
              <select
                value={order.status}
                onChange={handleStatusChange}
                className="text-sm border rounded p-1"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            ) : (
              <Badge className={statusColors[order.status as keyof typeof statusColors]}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
            )}
            <p className="text-lg font-bold mt-1">${order.totalAmount.toFixed(2)}</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm font-medium">Shipping Address:</p>
          <p className="text-sm text-gray-600">{order.shippingAddress}</p>
          
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Items:</p>
            <div className="space-y-2">
              {order.items.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>
                    {item.quantity} x {item.medicineName || "Unknown Product"}
                  </span>
                  <span>${item.totalPrice.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="border-t pt-4">
        <div className="text-sm text-gray-500">
          {order.status === 'pending' && "Your order is being processed."}
          {order.status === 'confirmed' && "Your order has been confirmed and is being prepared."}
          {order.status === 'shipped' && "Your order is on its way!"}
          {order.status === 'delivered' && "Your order has been delivered."}
          {order.status === 'cancelled' && "Your order has been cancelled."}
        </div>
      </CardFooter>
    </Card>
  );
};

export default OrderCard;
