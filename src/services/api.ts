import axios, { AxiosInstance } from 'axios';
import { User, LoginFormValues, ForgotPasswordFormValues } from '@/types';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: '/api', // This would be replaced with the actual API URL in production
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token in requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('qubo_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    
    // Handle authentication errors
    if (response && response.status === 401) {
      localStorage.removeItem('qubo_token');
      localStorage.removeItem('qubo_user');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// Mock data and helper functions for development
const MOCK_DELAY = 800; // ms

const mockResponse = <T>(data: T): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, MOCK_DELAY);
  });
};

// Mock users for development
const mockUsers = [
  {
    id: '1',
    email: 'admin@qubomanl.com',
    name: 'Admin User',
    role: 'primary_admin',
    profileImage: 'https://i.pravatar.cc/150?u=admin',
  },
  {
    id: '2',
    email: 'manager@qubomanl.com',
    name: 'Manager User',
    role: 'general_admin',
    profileImage: 'https://i.pravatar.cc/150?u=manager',
  },
  {
    id: '3',
    email: 'barber1@qubomanl.com',
    name: 'John Barber',
    role: 'barber',
    profileImage: 'https://i.pravatar.cc/150?u=barber1',
  },
  {
    id: '4',
    email: 'cashier@qubomanl.com',
    name: 'Cash Handler',
    role: 'cashier',
    profileImage: 'https://i.pravatar.cc/150?u=cashier',
  },
  {
    id: '5',
    email: 'customer@example.com',
    name: 'Regular Customer',
    role: 'customer',
    profileImage: 'https://i.pravatar.cc/150?u=customer',
  }
] as User[];

// Auth API endpoints
export const authAPI = {
  login: async (data: LoginFormValues): Promise<{ user: User; token: string }> => {
    // In a real app, this would be an actual API call
    // const response = await api.post('/auth/login', data);
    // return response.data;
    
    // Mock implementation
    const user = mockUsers.find(u => u.email === data.email);
    
    if (!user || data.password !== 'password123') {
      throw new Error('Invalid email or password');
    }
    
    const token = `mock-jwt-token-${Date.now()}`;
    
    return mockResponse({ user, token });
  },
  
  forgotPassword: async (data: ForgotPasswordFormValues): Promise<{ success: boolean }> => {
    // In a real app, this would be an actual API call
    // const response = await api.post('/auth/forgot-password', data);
    // return response.data;
    
    // Mock implementation
    const user = mockUsers.find(u => u.email === data.email);
    
    if (!user) {
      throw new Error('No account found with this email');
    }
    
    console.log(`Password reset email would be sent to ${data.email}`);
    
    return mockResponse({ success: true });
  },
  
  logout: async (): Promise<void> => {
    // In a real app, this would be an actual API call
    // await api.post('/auth/logout');
    
    // Mock implementation
    localStorage.removeItem('qubo_token');
    localStorage.removeItem('qubo_user');
    
    return mockResponse(undefined);
  },
  
  getCurrentUser: async (): Promise<User | null> => {
    try {
      // In a real app, this would be an actual API call
      // const response = await api.get('/auth/me');
      // return response.data;
      
      // Mock implementation
      const userJson = localStorage.getItem('qubo_user');
      if (!userJson) return null;
      
      const user = JSON.parse(userJson) as User;
      return mockResponse(user);
    } catch (error) {
      console.error('Failed to get current user:', error);
      return null;
    }
  }
};

export default api;
