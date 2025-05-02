
export interface Medicine {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  image: string | null;
  created_at: string;
}

export interface CartItem {
  medicine: Medicine;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  shippingAddress: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  medicineId: string;
  medicineName?: string;
  quantity: number;
  pricePerUnit: number;
  totalPrice: number;
}
