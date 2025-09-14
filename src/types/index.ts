// User related types
export type UserRole = 'customer' | 'barber' | 'cashier' | 'general_admin' | 'primary_admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  profileImage?: string;
}

// Auth related types
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Barber related types
export type BarberRank = 'junior' | 'senior' | 'master';

export interface Barber {
  id: string;
  userId: string;
  name: string;
  rank: BarberRank;
  profileImage: string;
  portfolioImages: string[];
  bio: string;
  experience: number; // years
  startingPrice: number;
  rating: number;
  services: Service[];
  availability: Availability[];
}

// Service related types
export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // minutes
  category: string;
}

// Availability related types
export interface Availability {
  id: string;
  barberId: string;
  date: string; // YYYY-MM-DD
  slots: TimeSlot[];
}

export interface TimeSlot {
  id: string;
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  isBooked: boolean;
  isPTO: boolean;
}

// Booking related types
export interface Booking {
  id: string;
  customerId: string;
  barberId: string;
  serviceId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  status: BookingStatus;
  totalPrice: number;
  downPayment: number;
  remainingPayment: number;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
}

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
export type PaymentStatus = 'not_paid' | 'partial' | 'paid';
export type PaymentMethod = 'gcash' | 'maya' | 'card' | 'cash';

// Form related types
export interface LoginFormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface ForgotPasswordFormValues {
  email: string;
}

export interface BookingFormValues {
  serviceId: string;
  date: string;
  timeSlot: string;
  name: string;
  email: string;
  phone: string;
  verificationCode: string;
  paymentMethod: PaymentMethod;
}

// Dashboard related types
export interface DashboardStats {
  todayAppointments: number;
  weeklyEarnings: number;
  clientsServed: number;
}

// PTO Request types
export interface PTORequest {
  id: string;
  barberId: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: RequestStatus;
}

export type RequestStatus = 'pending' | 'approved' | 'denied';

// Announcement types
export interface Announcement {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  publishedAt: string;
  expiresAt?: string;
  isActive: boolean;
}
