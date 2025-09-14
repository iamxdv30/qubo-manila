import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, addDays, isBefore, isToday } from 'date-fns';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  DollarSign, 
  Users, 
  ArrowRight, 
  Clock3, 
  ImagePlus, 
  Scissors 
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

import DashboardLayout from '@/components/layout/DashboardLayout';
import AppointmentCard from '@/components/ui/AppointmentCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Booking, BookingStatus } from '@/types';

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
    status: 'confirmed',
    totalPrice: 500,
    downPayment: 150,
    remainingPayment: 350,
    paymentStatus: 'partial',
  },
  {
    id: '2',
    customerId: 'c2',
    barberId: 'b1',
    serviceId: 's2',
    date: format(new Date(), 'yyyy-MM-dd'),
    startTime: '11:30',
    endTime: '12:00',
    status: 'confirmed',
    totalPrice: 300,
    downPayment: 90,
    remainingPayment: 210,
    paymentStatus: 'partial',
  },
  {
    id: '3',
    customerId: 'c3',
    barberId: 'b1',
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
];

// Mock data for customer information
const mockCustomers = {
  'c1': { name: 'John Smith', email: 'john@example.com', phone: '+63 917 123 4567' },
  'c2': { name: 'Maria Garcia', email: 'maria@example.com', phone: '+63 917 234 5678' },
  'c3': { name: 'David Lee', email: 'david@example.com', phone: '+63 917 345 6789' },
};

// Mock data for services
const mockServices = {
  's1': { name: 'Classic Haircut', price: 500 },
  's2': { name: 'Beard Trim', price: 300 },
  's3': { name: 'Hair & Beard Combo', price: 700 },
};

const BarberDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [todayAppointments, setTodayAppointments] = useState<Booking[]>([]);
  const [upcomingAppointment, setUpcomingAppointment] = useState<Booking | null>(null);
  const [stats, setStats] = useState({
    todayAppointments: 0,
    weeklyEarnings: 0,
    clientsServed: 0,
  });

  useEffect(() => {
    // In a real app, fetch data from API
    // Simulate API call
    setTimeout(() => {
      setTodayAppointments(mockTodayAppointments);
      
      // Find the next upcoming appointment
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentTimeString = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
      
      const upcoming = mockTodayAppointments.find(appointment => 
        appointment.startTime > currentTimeString && appointment.status === 'confirmed'
      ) || null;
      
      setUpcomingAppointment(upcoming);
      
      // Set mock stats
      setStats({
        todayAppointments: mockTodayAppointments.length,
        weeklyEarnings: 8500,
        clientsServed: 42,
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

  const getServiceName = (serviceId: string) => {
    return mockServices[serviceId as keyof typeof mockServices]?.name || 'Unknown Service';
  };

  const getServicePrice = (serviceId: string) => {
    return mockServices[serviceId as keyof typeof mockServices]?.price || 0;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-heading font-bold">Welcome, {user?.name}</h1>
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
                Today's Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <CalendarIcon className="h-5 w-5 text-accent mr-2" />
                <span className="text-2xl font-bold">{stats.todayAppointments}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                This Week's Earnings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 text-accent mr-2" />
                <span className="text-2xl font-bold">₱{stats.weeklyEarnings.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Clients Served
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Users className="h-5 w-5 text-accent mr-2" />
                <span className="text-2xl font-bold">{stats.clientsServed}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Next Appointment */}
        <Card>
          <CardHeader>
            <CardTitle>Next Appointment</CardTitle>
            <CardDescription>Your upcoming appointment for today</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingAppointment ? (
              <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-medium">
                        {getServiceName(upcomingAppointment.serviceId)}
                      </h3>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>
                          {upcomingAppointment.startTime} - {upcomingAppointment.endTime}
                        </span>
                      </div>
                      <p className="text-sm mt-1">
                        Client: {getCustomerName(upcomingAppointment.customerId)}
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate('/dashboard/schedule')}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground">No more appointments scheduled for today</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Today's Schedule */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-heading font-semibold">Today's Schedule</h2>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/dashboard/schedule')}
            >
              View Full Schedule
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
                  barberName={user?.name || 'You'}
                  serviceName={getServiceName(appointment.serviceId)}
                  servicePrice={getServicePrice(appointment.serviceId)}
                  date={new Date()}
                  startTime={appointment.startTime}
                  endTime={appointment.endTime}
                  status={appointment.status}
                  paymentStatus={appointment.paymentStatus}
                  userRole="barber"
                  onStatusChange={handleStatusChange}
                />
              ))
            ) : (
              <div className="col-span-2 text-center py-10 bg-card border border-border rounded-lg">
                <p className="text-muted-foreground">No appointments scheduled for today</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h2 className="text-xl font-heading font-semibold">Quick Actions</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="hover:border-accent/50 transition-colors cursor-pointer" onClick={() => navigate('/dashboard/schedule')}>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mb-3">
                  <CalendarIcon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-medium">View Full Schedule</h3>
                <p className="text-sm text-muted-foreground mt-1">See all your upcoming appointments</p>
              </CardContent>
            </Card>
            
            <Card className="hover:border-accent/50 transition-colors cursor-pointer" onClick={() => navigate('/dashboard/requests')}>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mb-3">
                  <Clock3 className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-medium">Request Time Off</h3>
                <p className="text-sm text-muted-foreground mt-1">Submit PTO or sick leave requests</p>
              </CardContent>
            </Card>
            
            <Card className="hover:border-accent/50 transition-colors cursor-pointer" onClick={() => navigate('/dashboard/portfolio')}>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mb-3">
                  <ImagePlus className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-medium">Upload Portfolio</h3>
                <p className="text-sm text-muted-foreground mt-1">Add new images to your portfolio</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BarberDashboard;
