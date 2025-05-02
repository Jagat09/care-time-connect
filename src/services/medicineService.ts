
import { supabase } from "@/integrations/supabase/client";
import { Medicine, Order, OrderItem } from "../types/medicine";

export async function getMedicines(): Promise<Medicine[]> {
  try {
    const { data, error } = await supabase
      .from('medicines')
      .select('*')
      .order('name');
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching medicines:', error);
    throw error;
  }
}

export async function getMedicineById(id: string): Promise<Medicine | null> {
  try {
    const { data, error } = await supabase
      .from('medicines')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching medicine:', error);
    throw error;
  }
}

export async function createMedicine(medicine: Omit<Medicine, 'id' | 'created_at'>) {
  try {
    const { data, error } = await supabase
      .from('medicines')
      .insert([medicine])
      .select();
      
    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error creating medicine:', error);
    throw error;
  }
}

export async function updateMedicine(id: string, medicine: Partial<Omit<Medicine, 'id' | 'created_at'>>) {
  try {
    const { data, error } = await supabase
      .from('medicines')
      .update(medicine)
      .eq('id', id)
      .select();
      
    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error updating medicine:', error);
    throw error;
  }
}

export async function deleteMedicine(id: string) {
  try {
    const { error } = await supabase
      .from('medicines')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting medicine:', error);
    throw error;
  }
}

// Orders
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
      // Fix: Use more specific type assertion to address the 'never' type error
      const params = {
        medicine_id: item.medicineId,
        quantity: item.quantity
      };
      
      const { error: updateError } = await supabase
        .rpc('decrement_medicine_stock', params as any);
        
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
    // Fix: Adjust the query to properly join medicine_orders with profiles
    const { data: orders, error: ordersError } = await supabase
      .from('medicine_orders')
      .select(`
        *,
        profiles:user_id(name)
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
      // Fix: Handle potential null values and type issues with profiles
      let customerName: string | undefined = undefined;
      // Fix: Add null check and proper type guard
      if (order.profiles && typeof order.profiles === 'object' && order.profiles !== null) {
        // First check if it has the name property
        if ('name' in order.profiles && typeof order.profiles.name === 'string') {
          customerName = order.profiles.name;
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
