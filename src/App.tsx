import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

// Auth Pages
import Index from "./pages/Index";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";

// Customer Booking Flow
import BarbersListing from "./pages/booking/BarbersListing";
import BarberProfile from "./pages/booking/BarberProfile";
import BookingFlow from "./pages/booking/BookingFlow";

// Barber Dashboard
import BarberDashboard from "./pages/dashboard/BarberDashboard";
import BarberSchedule from "./pages/dashboard/BarberSchedule";
import BarberPortfolio from "./pages/dashboard/BarberPortfolio";
import BarberRequests from "./pages/dashboard/BarberRequests";

// Cashier Dashboard
import CashierDashboard from "./pages/dashboard/CashierDashboard";
import PaymentManagement from "./pages/dashboard/PaymentManagement";
import CashierReports from "./pages/dashboard/CashierReports";

// General Admin Dashboard
import GeneralAdminDashboard from "./pages/dashboard/GeneralAdminDashboard";
import ManageBarbers from "./pages/dashboard/ManageBarbers";
import ManageAnnouncements from "./pages/dashboard/ManageAnnouncements";
import ReviewRequests from "./pages/dashboard/ReviewRequests";

// Primary Admin Dashboard
import PrimaryAdminDashboard from "./pages/dashboard/PrimaryAdminDashboard";
import UserManagement from "./pages/dashboard/UserManagement";
import SystemSettings from "./pages/dashboard/SystemSettings";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ element, allowedRoles = [] }: { element: React.ReactNode, allowedRoles?: string[] }) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    // Redirect based on role if not authorized
    switch (user.role) {
      case 'barber':
        return <Navigate to="/dashboard/barber" replace />;
      case 'cashier':
        return <Navigate to="/dashboard/cashier" replace />;
      case 'general_admin':
        return <Navigate to="/dashboard/admin" replace />;
      case 'primary_admin':
        return <Navigate to="/dashboard/primary-admin" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }
  
  return <>{element}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          {/* Customer Booking Flow */}
          <Route path="/barbers" element={<BarbersListing />} />
          <Route path="/barber/:barberId" element={<BarberProfile />} />
          <Route path="/booking/:barberId" element={<BookingFlow />} />
          
          {/* Protected Routes - Profile */}
          <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
          
          {/* Barber Dashboard */}
          <Route path="/dashboard/barber" element={<ProtectedRoute element={<BarberDashboard />} allowedRoles={['barber']} />} />
          <Route path="/dashboard/schedule" element={<ProtectedRoute element={<BarberSchedule />} allowedRoles={['barber']} />} />
          <Route path="/dashboard/portfolio" element={<ProtectedRoute element={<BarberPortfolio />} allowedRoles={['barber']} />} />
          <Route path="/dashboard/requests" element={<ProtectedRoute element={<BarberRequests />} allowedRoles={['barber']} />} />
          
          {/* Cashier Dashboard */}
          <Route path="/dashboard/cashier" element={<ProtectedRoute element={<CashierDashboard />} allowedRoles={['cashier']} />} />
          <Route path="/dashboard/payments" element={<ProtectedRoute element={<PaymentManagement />} allowedRoles={['cashier']} />} />
          <Route path="/dashboard/reports" element={<ProtectedRoute element={<CashierReports />} allowedRoles={['cashier']} />} />
          
          {/* General Admin Dashboard */}
          <Route path="/dashboard/admin" element={<ProtectedRoute element={<GeneralAdminDashboard />} allowedRoles={['general_admin']} />} />
          <Route path="/dashboard/manage-barbers" element={<ProtectedRoute element={<ManageBarbers />} allowedRoles={['general_admin']} />} />
          <Route path="/dashboard/announcements" element={<ProtectedRoute element={<ManageAnnouncements />} allowedRoles={['general_admin']} />} />
          <Route path="/dashboard/review-requests" element={<ProtectedRoute element={<ReviewRequests />} allowedRoles={['general_admin']} />} />
          
          {/* Primary Admin Dashboard */}
          <Route path="/dashboard/primary-admin" element={<ProtectedRoute element={<PrimaryAdminDashboard />} allowedRoles={['primary_admin']} />} />
          <Route path="/dashboard/users" element={<ProtectedRoute element={<UserManagement />} allowedRoles={['primary_admin']} />} />
          <Route path="/dashboard/settings" element={<ProtectedRoute element={<SystemSettings />} allowedRoles={['primary_admin']} />} />
          
          {/* Catch-all route for 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
