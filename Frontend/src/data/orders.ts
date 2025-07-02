import { Order } from '../types';

export const orders: Order[] = [
  {
    id: '1',
    cashierId: '2',
    items: [
      {
        id: '1',
        menuItemId: '1',
        quantity: 2,
        price: 2.50,
        subtotal: 5.00,
      },
      {
        id: '2',
        menuItemId: '2',
        quantity: 1,
        price: 4.00,
        subtotal: 4.00,
      },
    ],
    total: 9.00,
    paymentMethod: 'cash',
    status: 'completed',
    createdAt: '2024-01-15T08:30:00Z',
    customerName: 'John Doe',
  },
  {
    id: '2',
    cashierId: '3',
    items: [
      {
        id: '3',
        menuItemId: '5',
        quantity: 1,
        price: 12.99,
        subtotal: 12.99,
      },
      {
        id: '4',
        menuItemId: '8',
        quantity: 2,
        price: 3.99,
        subtotal: 7.98,
      },
    ],
    total: 20.97,
    paymentMethod: 'qr',
    status: 'completed',
    createdAt: '2024-01-15T10:15:00Z',
    customerName: 'Jane Smith',
  },
  {
    id: '3',
    cashierId: '2',
    items: [
      {
        id: '5',
        menuItemId: '6',
        quantity: 1,
        price: 9.99,
        subtotal: 9.99,
      },
      {
        id: '6',
        menuItemId: '7',
        quantity: 1,
        price: 5.99,
        subtotal: 5.99,
      },
    ],
    total: 15.98,
    paymentMethod: 'cash',
    status: 'completed',
    createdAt: '2024-01-15T14:20:00Z',
    customerName: 'Bob Wilson',
  },
];