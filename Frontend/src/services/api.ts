import axios from 'axios';
import toast from 'react-hot-toast';

// Base URL untuk API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor untuk menambahkan token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor untuk handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth-token');
      localStorage.removeItem('pos-user');
      window.location.href = '/login';
      toast.error('Session expired. Please login again.');
    } else if (error.response?.status === 403) {
      toast.error('Access denied. Insufficient permissions.');
    } else if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.');
    }
    return Promise.reject(error);
  }
);

export default api;

// API endpoints
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
};

export const menuAPI = {
  getAll: (params?: any) => api.get('/menu', { params }),
  getById: (id: string) => api.get(`/menu/${id}`),
  create: (data: FormData) => api.post('/menu', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id: string, data: FormData) => api.put(`/menu/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id: string) => api.delete(`/menu/${id}`),
  updateStock: (id: string, stock: number) => api.patch(`/menu/${id}/stock`, { stock }),
  getCategories: () => api.get('/menu/categories'),
};

export const orderAPI = {
  getAll: (params?: any) => api.get('/orders', { params }),
  getById: (id: string) => api.get(`/orders/${id}`),
  create: (data: any) => api.post('/orders', data),
  updateStatus: (id: string, status: string) => api.patch(`/orders/${id}/status`, { status }),
  getStats: (params?: any) => api.get('/orders/stats', { params }),
};

export const userAPI = {
  getAll: (params?: any) => api.get('/users', { params }),
  create: (data: FormData) => api.post('/users', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id: string, data: FormData) => api.put(`/users/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id: string) => api.delete(`/users/${id}`),
  toggleStatus: (id: string) => api.patch(`/users/${id}/toggle-status`),
};

export const shiftAPI = {
  getCurrent: () => api.get('/shifts/current'),
  getAll: (params?: any) => api.get('/shifts', { params }),
  clockOut: () => api.post('/shifts/clock-out'),
  getStats: (params?: any) => api.get('/shifts/stats', { params }),
};

export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getRevenueReport: (params?: any) => api.get('/dashboard/reports/revenue', { params }),
  getProductReport: (params?: any) => api.get('/dashboard/reports/products', { params }),
  getStaffReport: (params?: any) => api.get('/dashboard/reports/staff', { params }),
  getCustomerReport: (params?: any) => api.get('/dashboard/reports/customers', { params }),
};

export const paymentAPI = {
  create: (orderId: string) => api.post('/payment/create', { orderId }),
  getStatus: (orderId: string) => api.get(`/payment/status/${orderId}`),
};