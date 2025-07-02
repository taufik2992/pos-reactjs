import { User } from '../types';

export const users: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@restaurant.com',
    role: 'admin',
    password: 'admin123',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    createdAt: '2024-01-01T00:00:00Z',
    isActive: true,
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@restaurant.com',
    role: 'cashier',
    password: 'cashier123',
    avatar: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    createdAt: '2024-01-01T00:00:00Z',
    isActive: true,
  },
  {
    id: '3',
    name: 'Mike Chen',
    email: 'mike@restaurant.com',
    role: 'cashier',
    password: 'cashier123',
    avatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    createdAt: '2024-01-02T00:00:00Z',
    isActive: true,
  },
];