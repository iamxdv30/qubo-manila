import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { 
  Calendar as CalendarIcon, 
  DollarSign, 
  Users, 
  ArrowRight, 
  CreditCard, 
  FileText, 
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

import DashboardLayout from '@/components/layout/DashboardLayout';
import AppointmentCard from '@/components/ui/AppointmentCard';
import PaymentModal from '@/components/ui/PaymentModal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Booking, BookingStatus, PaymentMethod } from '@/types';

// Mock data for today's appointments
const mockTodayAppointments: Booking[] = [
  {
    id: '1',
    customerId: 'c1',
    barberId: 'b1',
    serviceId: 's1',
    date: format(new Date(), 'yyyy-MM-dd'),
    startTime: '10:00',
    endTime: '10:45',
    status: 'completed',
    totalPrice: 500,
    downPayment: 150,
    remainingPayment: 350,
    paymentStatus: 'partial',
  },
  {
    id: '2',
    customerId: 'c2',
    barberId: 'b2',
    serviceId: 's2',
    date: format(new Date(), 'yyyy-MM-dd'),
    startTime: '11:30',
    endTime: '12:00',
    status: 'completed',
    totalPrice: 300,
    downPayment: 90,
    remainingPayment: 210,
    paymentStatus: 'partial',
  },
  {
    id: '3',
    customerId: 'c3',
    barberId: 'b3',
    serviceId: 's3',
    date: format(new Date(), 'yyyy-MM-dd'),
    startTime: '14:00',
    endTime: '15:00',
    status: 'confirmed',
    totalPrice: 700,
    downPayment: 210,
    remainingPayment: 490,
    paymentStatus: 'partial',
  },
  {
    id: '4',
    customerId: 'c4',
    barberId: 'b1',
    serviceId: 's4',
    date: format(new Date(), 'yyyy-MM-dd'),
    startTime: '16:00',
    endTime: '16:45',
    status: 'confirmed',
    totalPrice: 450,
    downPayment: 135,
    remainingPayment: 315,
    paymentStatus: 'partial',
  },
];

// Mock data for recent transactions
const mockRecentTransactions = [
  {
    id: 't1',
    bookingId: '1',
    customerId: 'c1',
    amount: 350,
    paymentMethod: 'cash' as PaymentMethod,
    timestamp: new Date(new Date().setHours(new Date().getHours() - 1)),
    type: 'payment',
  },
  {
    id: 't2',
    bookingId: '5',
    customerId: 'c5',
    amount: 500,
    paymentMethod: 'card' as PaymentMethod,
    timestamp: new Date(new Date().setHours(new Date().getHours() - 3)),
    type: 'payment',
  },
  {
    id: 't3',
    bookingId: '6',
    customerId: 'c6',
    amount: 150,
    paymentMethod: 'gcash' as PaymentMethod,
    timestamp: new Date(new Date().setHours(new Date().getHours() - 4)),
    type: 'refund',
  },
];

// Mock data for customer information
const mockCustomers = {
  'c1': { name: 'John Smith', email: 'john@example.com', phone: '+63 917 123 4567' },
  'c2': { name: 'Maria Garcia', email: 'maria@example.com', phone: '+63 917 234 5678' },
  'c3': { name: 'David Lee', email: 'david@example.com', phone: '+63 917 345 6789' },
  'c4': { name: 'Sarah Johnson', email: 'sarah@example.com', phone: '+63 917 456 7890' },
  'c5': { name: 'Michael Brown', email: 'michael@example.com', phone: '+63 917 567 8901' },
  'c6': { name: 'Jennifer Wilson', email: 'jennifer@example.com', phone: '+63 917 678 9012' },
};

// Mock data for barbers
const mockBarbers = {
  'b1': { name: 'John Doe', profileImage: 'https://i.pravatar.cc/300?img=1' },
  'b2': { name: 'Mike Smith', profileImage: 'https://i.pravatar.cc/300?img=2' },
  'b3': { name: 'David Chen', profileImage: 'https://i.pravatar.cc/300?img=3' },
};

// Mock data for services
const mockServices = {
  's1': { name: 'Classic Haircut', price: 500 },
  's2': { name: 'Beard Trim', price: 300 },
  's3': { name: 'Hair & Beard Combo', price: 700 },
  's4': { name: 'Hot Towel Shave', price: 450 },
};

const CashierDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [todayAppointments, setTodayAppointments] = useState<Booking[]>([]);
  const [pendingPayments, setPendingPayments] = useState<Booking[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<{
    id: string;
    bookingId: string;
    customerName: string;
    amount: number;
    paymentMethod: PaymentMethod;
    timestamp: Date;
    type: 'payment' | 'refund';
  }[]>([]);
  const [activeTab, setActiveTab] = useState('appointments');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  
  const [stats, setStats] = useState({
    todayRevenue: 0,
    completedAppointments: 0,
    noShows: 0,
  });

  useEffect(() => {
    // In a real app, fetch data from API
    // Simulate API call
    setTimeout(() => {
      setTodayAppointments(mockTodayAppointments);
      
      // Filter appointments that need payment
      const pending = mockTodayAppointments.filter(
        appointment => appointment.status === 'completed' && appointment.paymentStatus !== 'paid'
      );
      setPendingPayments(pending);
      
      setRecentTransactions(mockRecentTransactions);
      
      // Calculate stats
      setStats({
        todayRevenue: 2850,
        completedAppointments: 5,
        noShows: 1,
      });
    }, 500);
  }, []);

  const handleStatusChange = (id: string, status: BookingStatus) => {
    // In a real app, update status via API
    setTodayAppointments(prev => 
      prev.map(appointment => 
        appointment.id === id ? { ...appointment, status } : appointment
      )
    );
    
    // Update pending payments if needed
    if (status === 'completed') {
      const appointment = todayAppointments.find(a => a.id === id);
      if (appointment && appointment.paymentStatus !== 'paid') {
        setPendingPayments(prev => [...prev, { ...appointment, status }]);
      }
    }
  };

  const handlePaymentComplete = (bookingId: string, method: PaymentMethod, amount: number) => {
    // In a real app, process payment via API
    // Update appointment payment status
    setTodayAppointments(prev => 
      prev.map(appointment => 
        appointment.id === bookingId 
          ? { 
              ...appointment, 
              paymentStatus: amount >= appointment.remainingPayment ? 'paid' : 'partial',
              remainingPayment: Math.max(0, appointment.remainingPayment - amount)
            } 
          : appointment
      )
    );
    
    // Update pending payments
    setPendingPayments(prev => {
      const updated = prev.map(appointment => 
        appointment.id === bookingId 
          ? { 
              ...appointment, 
              paymentStatus: amount >= appointment.remainingPayment ? 'paid' : 'partial',
              remainingPayment: Math.max(0, appointment.remainingPayment - amount)
            } 
          : appointment
      );
      
      // Remove if fully paid
      return updated.filter(appointment => appointment.paymentStatus !== 'paid');
    });
    
    // Add to recent transactions
    const newTransaction = {
      id: `t${Date.now()}`,
      bookingId,
      customerId: selectedBooking?.customerId || '',
      amount,
      paymentMethod: method,
      timestamp: new Date(),
      type: 'payment',
    };
    
    setRecentTransactions(prev => [newTransaction, ...prev]);
    
    // Update stats
    setStats(prev => ({
      ...prev,
      todayRevenue: prev.todayRevenue + amount,
    }));
    
    // Close modal
    setIsPaymentModalOpen(false);
    setSelectedBooking(null);
  };

  const openPaymentModal = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsPaymentModalOpen(true);
  };

  const getCustomerName = (customerId: string) => {
    return mockCustomers[customerId as keyof typeof mockCustomers]?.name || 'Unknown Customer';
  };

  const getCustomerEmail = (customerId: string) => {
    return mockCustomers[customerId as keyof typeof mockCustomers]?.email;
  };

  const getCustomerPhone = (customerId: string) => {
    return mockCustomers[customerId as keyof typeof mockCustomers]?.phone;
  };

  const getBarberName = (barberId: string) => {
    return mockBarbers[barberId as keyof typeof mockBarbers]?.name || 'Unknown Barber';
  };

  const getBarberImage = (barberId: string) => {
    return mockBarbers[barberId as keyof typeof mockBarbers]?.profileImage;
  };

  const getServiceName = (serviceId: string) => {
    return mockServices[serviceId as keyof typeof mockServices]?.name || 'Unknown Service';
  };

  const getServicePrice = (serviceId: string) => {
    return mockServices[serviceId as keyof typeof mockServices]?.price || 0;
  };

  const formatPaymentMethod = (method: PaymentMethod) => {
    switch (method) {
      case 'cash':
        return 'Cash';
      case 'card':
        return 'Card';
      case 'gcash':
        return 'GCash';
      case 'maya':
        return 'Maya';
      default:
        return 'Unknown';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-heading font-bold">Cashier Dashboard</h1>
            <p className="text-muted-foreground">
              Today is {format(new Date(), 'EEEE, MMMM d, yyyy')}
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Today's Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 text-accent mr-2" />
                <span className="text-2xl font-bold">₱{stats.todayRevenue.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Completed Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-2xl font-bold">{stats.completedAppointments}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                No-Shows
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <XCircle className="h-5 w-5 text-red-500 mr-2" />
                <span className="text-2xl font-bold">{stats.noShows}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="appointments" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="appointments">Today's Appointments</TabsTrigger>
            <TabsTrigger value="payments">Pending Payments</TabsTrigger>
            <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
          </TabsList>
          
          {/* Today's Appointments Tab */}
          <TabsContent value="appointments" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-heading font-semibold">Today's Appointments</h2>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/dashboard/payments')}
              >
                View All Payments
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {todayAppointments.length > 0 ? (
                todayAppointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    id={appointment.id}
                    customerName={getCustomerName(appointment.customerId)}
                    customerEmail={getCustomerEmail(appointment.customerId)}
                    customerPhone={getCustomerPhone(appointment.customerId)}
                    barberName={getBarberName(appointment.barberId)}
                    barberImage={getBarberImage(appointment.barberId)}
                    serviceName={getServiceName(appointment.serviceId)}
                    servicePrice={getServicePrice(appointment.serviceId)}
                    date={new Date()}
                    startTime={appointment.startTime}
                    endTime={appointment.endTime}
                    status={appointment.status}
                    paymentStatus={appointment.paymentStatus}
                    userRole="cashier"
                    onStatusChange={handleStatusChange}
                    onViewDetails={() => {
                      if (appointment.status === 'completed' && appointment.paymentStatus !== 'paid') {
                        openPaymentModal(appointment);
                      }
                    }}
                  />
                ))
              ) : (
                <div className="col-span-2 text-center py-10 bg-card border border-border rounded-lg">
                  <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No appointments scheduled for today</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* Pending Payments Tab */}
          <TabsContent value="payments" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-heading font-semibold">Pending Payments</h2>
              <Badge variant="outline" className="bg-amber-500/20 text-amber-500 border-amber-500/50">
                {pendingPayments.length} pending
              </Badge>
            </div>
            
            <div className="space-y-4">
              {pendingPayments.length > 0 ? (
                pendingPayments.map((appointment) => (
                  <Card key={appointment.id}>
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full overflow-hidden mr-4">
                            <img 
                              src={getBarberImage(appointment.barberId)} 
                              alt={getBarberName(appointment.barberId)} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="font-medium">{getCustomerName(appointment.customerId)}</h3>
                            <p className="text-sm text-muted-foreground">
                              {getServiceName(appointment.serviceId)} with {getBarberName(appointment.barberId)}
                            </p>
                            <div className="flex items-center text-sm mt-1">
                              <CalendarIcon className="h-3 w-3 mr-1 text-muted-foreground" />
                              <span className="text-muted-foreground">
                                {format(new Date(), 'MMM d')} • {appointment.startTime}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Remaining</p>
                            <p className="font-semibold">₱{appointment.remainingPayment}</p>
                          </div>
                          <Button 
                            size="sm"
                            onClick={() => openPaymentModal(appointment)}
                          >
                            <CreditCard className="h-4 w-4 mr-2" />
                            Process Payment
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-10 bg-card border border-border rounded-lg">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <p className="text-muted-foreground">No pending payments</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* Recent Transactions Tab */}
          <TabsContent value="transactions" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-heading font-semibold">Recent Transactions</h2>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/dashboard/reports')}
              >
                View Reports
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
            
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-4 font-medium">Customer</th>
                        <th className="text-left p-4 font-medium">Amount</th>
                        <th className="text-left p-4 font-medium">Method</th>
                        <th className="text-left p-4 font-medium">Type</th>
                        <th className="text-left p-4 font-medium">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentTransactions.map((transaction) => (
                        <tr key={transaction.id} className="border-b border-border hover:bg-muted/50">
                          <td className="p-4">
                            {getCustomerName(transaction.customerId)}
                          </td>
                          <td className="p-4 font-medium">
                            ₱{transaction.amount}
                          </td>
                          <td className="p-4">
                            {formatPaymentMethod(transaction.paymentMethod)}
                          </td>
                          <td className="p-4">
                            <Badge variant="outline" className={
                              transaction.type === 'payment' 
                                ? 'bg-green-500/20 text-green-500 border-green-500/50' 
                                : 'bg-amber-500/20 text-amber-500 border-amber-500/50'
                            }>
                              {transaction.type === 'payment' ? 'Payment' : 'Refund'}
                            </Badge>
                          </td>
                          <td className="p-4 text-muted-foreground">
                            {format(transaction.timestamp, 'h:mm a')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h2 className="text-xl font-heading font-semibold">Quick Actions</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="hover:border-accent/50 transition-colors cursor-pointer" onClick={() => navigate('/dashboard/payments')}>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mb-3">
                  <CreditCard className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-medium">Payment Management</h3>
                <p className="text-sm text-muted-foreground mt-1">Process payments and refunds</p>
              </CardContent>
            </Card>
            
            <Card className="hover:border-accent/50 transition-colors cursor-pointer" onClick={() => navigate('/dashboard/reports')}>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mb-3">
                  <FileText className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-medium">Reports</h3>
                <p className="text-sm text-muted-foreground mt-1">View daily and monthly reports</p>
              </CardContent>
            </Card>
            
            <Card className="hover:border-accent/50 transition-colors cursor-pointer" onClick={() => setActiveTab('payments')}>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mb-3">
                  <TrendingUp className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-medium">Pending Payments</h3>
                <p className="text-sm text-muted-foreground mt-1">View and process pending payments</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {selectedBooking && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => {
            setIsPaymentModalOpen(false);
            setSelectedBooking(null);
          }}
          bookingId={selectedBooking.id}
          customerName={getCustomerName(selectedBooking.customerId)}
          serviceName={getServiceName(selectedBooking.serviceId)}
          totalAmount={selectedBooking.totalPrice}
          remainingAmount={selectedBooking.remainingPayment}
          onPaymentComplete={handlePaymentComplete}
        />
      )}
    </DashboardLayout>
  );
};

export default CashierDashboard;
