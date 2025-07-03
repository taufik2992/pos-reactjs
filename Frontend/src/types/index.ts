export interface User {
  id: string;
  nama: string;
  email: string;
  role: 'admin' | 'cashier';
  avatar?: string;
  createdAt: string;
  isActive: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  isAvailable: boolean;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Order {
  id: string;
  cashierId: string;
  items: OrderItem[];
  total: number;
  paymentMethod: 'cash' | 'card' | 'digital' | 'midtrans';
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: string;
  customerName?: string;
  customerPhone?: string;
  notes?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface DashboardStats {
  todaySales: number;
  todayOrders: number;
  lowStock: number;
  totalUsers: number;
}

export interface SalesData {
  date: string;
  sales: number;
  orders: number;
}