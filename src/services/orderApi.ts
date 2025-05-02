
import { supabase } from "@/integrations/supabase/client";
import { Order, OrderItem } from "../types/medicine";

export async function createOrder(
  userId: string, 
  shippingAddress: string, 
  totalAmount: number, 
  items: { medicineId: string, quantity: number, pricePerUnit: number, totalPrice: number }[]
): Promise<string> {
  try {
    // First create the order
    const { data: orderData, error: orderError } = await supabase
      .from('medicine_orders')
      .insert([
        { user_id: userId, shipping_address: shippingAddress, total_amount: totalAmount }
      ])
      .select();
      
    if (orderError) throw orderError;
    
    const orderId = orderData[0].id;
    
    // Then create the order items
    const orderItems = items.map(item => ({
      order_id: orderId,
      medicine_id: item.medicineId,
      quantity: item.quantity,
      price_per_unit: item.pricePerUnit,
      total_price: item.totalPrice
    }));
    
    const { error: itemsError } = await supabase
      .from('medicine_order_items')
      .insert(orderItems);
      
    if (itemsError) throw itemsError;
    
    // Update stock levels
    for (const item of items) {
      // Define type-safe parameters
      const params = {
        medicine_id: item.medicineId,
        quantity: item.quantity
      };
      
      // Use type assertion with unknown as intermediate step
      const { error: updateError } = await supabase
        .rpc('decrement_medicine_stock' as unknown as string, params as unknown as Record<string, unknown>);
        
      if (updateError) {
        console.error('Failed to update stock for medicine:', item.medicineId, updateError);
      }
    }
    
    return orderId;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

export async function getUserOrders(userId: string): Promise<Order[]> {
  try {
    // First get the orders
    const { data: orders, error: ordersError } = await supabase
      .from('medicine_orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (ordersError) throw ordersError;
    
    if (!orders || orders.length === 0) return [];
    
    // Then get all order items with medicine details
    const { data: orderItems, error: itemsError } = await supabase
      .from('medicine_order_items')
      .select('*, medicines(name)')
      .in('order_id', orders.map(order => order.id));
      
    if (itemsError) throw itemsError;
    
    // Convert to our interface format and merge the data
    const formattedOrders: Order[] = orders.map(order => ({
      id: order.id,
      userId: order.user_id,
      status: order.status as 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled',
      totalAmount: order.total_amount,
      shippingAddress: order.shipping_address,
      createdAt: order.created_at,
      updatedAt: order.updated_at,
      items: orderItems
        .filter(item => item.order_id === order.id)
        .map(item => ({
          id: item.id,
          orderId: item.order_id,
          medicineId: item.medicine_id,
          medicineName: item.medicines?.name,
          quantity: item.quantity,
          pricePerUnit: item.price_per_unit,
          totalPrice: item.total_price
        }))
    }));
    
    return formattedOrders;
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw error;
  }
}

export async function getAllOrders(): Promise<Order[]> {
  try {
    // Fix: Modify the query to correctly join profiles
    const { data: orders, error: ordersError } = await supabase
      .from('medicine_orders')
      .select(`
        *,
        profiles(name)
      `)
      .order('created_at', { ascending: false });
      
    if (ordersError) throw ordersError;
    
    if (!orders || orders.length === 0) return [];
    
    // Then get all order items
    const { data: orderItems, error: itemsError } = await supabase
      .from('medicine_order_items')
      .select('*, medicines(name)')
      .in('order_id', orders.map(order => order.id));
      
    if (itemsError) throw itemsError;
    
    // Convert to our interface format and merge the data
    const formattedOrders: Order[] = orders.map(order => {
      let customerName: string | undefined = undefined;
      
      // Fix: Proper type checking and null handling for profiles data
      if (order.profiles) {
        // First cast to unknown, then to the expected type structure
        const profileData = order.profiles as unknown;
        
        if (profileData && typeof profileData === 'object') {
          // Now check if it has a name property
          const profileObj = profileData as { name?: string };
          if (profileObj.name && typeof profileObj.name === 'string') {
            customerName = profileObj.name;
          }
        }
      }

      return {
        id: order.id,
        userId: order.user_id,
        status: order.status as 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled',
        totalAmount: order.total_amount,
        shippingAddress: order.shipping_address,
        createdAt: order.created_at,
        updatedAt: order.updated_at,
        customerName,
        items: orderItems
          .filter(item => item.order_id === order.id)
          .map(item => ({
            id: item.id,
            orderId: item.order_id,
            medicineId: item.medicine_id,
            medicineName: item.medicines?.name,
            quantity: item.quantity,
            pricePerUnit: item.price_per_unit,
            totalPrice: item.total_price
          }))
      };
    });
    
    return formattedOrders;
  } catch (error) {
    console.error('Error fetching all orders:', error);
    throw error;
  }
}

export async function updateOrderStatus(orderId: string, status: string) {
  try {
    const { error } = await supabase
      .from('medicine_orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', orderId);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
}
