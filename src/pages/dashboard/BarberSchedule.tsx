import { useState, useEffect } from 'react';
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, parseISO } from 'date-fns';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, Filter } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

import DashboardLayout from '@/components/layout/DashboardLayout';
import AppointmentCard from '@/components/ui/AppointmentCard';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Booking, BookingStatus } from '@/types';

// Generate mock appointments for a month
const generateMockAppointments = (): Booking[] => {
  const appointments: Booking[] = [];
  const today = new Date();
  const startDate = startOfMonth(today);
  const endDate = addDays(endOfMonth(today), 15); // Include 15 days of next month
  
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  
  // Customer IDs
  const customerIds = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6'];
  // Service IDs
  const serviceIds = ['s1', 's2', 's3', 's4'];
  
  // Generate 2-4 appointments for random days
  days.forEach(day => {
    // Skip some days randomly
    if (Math.random() > 0.7) return;
    
    // Generate 1-4 appointments for this day
    const appointmentCount = Math.floor(Math.random() * 4) + 1;
    
    for (let i = 0; i < appointmentCount; i++) {
      // Generate random time between 9 AM and 7 PM
      const hour = Math.floor(Math.random() * 10) + 9;
      const minute = Math.random() > 0.5 ? 30 : 0;
      const startTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      
      // Service duration (30, 45, or 60 minutes)
      const durations = [30, 45, 60];
      const duration = durations[Math.floor(Math.random() * durations.length)];
      
      // Calculate end time
      let endHour = hour;
      let endMinute = minute + duration;
      if (endMinute >= 60) {
        endHour += Math.floor(endMinute / 60);
        endMinute = endMinute % 60;
      }
      const endTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
      
      // Random customer and service
      const customerId = customerIds[Math.floor(Math.random() * customerIds.length)];
      const serviceId = serviceIds[Math.floor(Math.random() * serviceIds.length)];
      
      // Random price between 300 and 800
      const totalPrice = Math.floor(Math.random() * 500) + 300;
      const downPayment = Math.round(totalPrice * 0.3);
      const remainingPayment = totalPrice - downPayment;
      
      // Random status (more likely to be confirmed for future dates)
      let status: BookingStatus;
      if (isSameDay(day, today)) {
        // Today's appointments are mostly confirmed or completed
        const statuses: BookingStatus[] = ['confirmed', 'confirmed', 'completed', 'no_show'];
        status = statuses[Math.floor(Math.random() * statuses.length)];
      } else if (day < today) {
        // Past appointments are completed, cancelled, or no-show
        const statuses: BookingStatus[] = ['completed', 'completed', 'completed', 'cancelled', 'no_show'];
        status = statuses[Math.floor(Math.random() * statuses.length)];
      } else {
        // Future appointments are mostly confirmed or pending
        const statuses: BookingStatus[] = ['confirmed', 'confirmed', 'confirmed', 'pending', 'cancelled'];
        status = statuses[Math.floor(Math.random() * statuses.length)];
      }
      
      // Payment status based on appointment status
      let paymentStatus: 'not_paid' | 'partial' | 'paid';
      if (status === 'completed') {
        paymentStatus = Math.random() > 0.2 ? 'paid' : 'partial';
      } else if (status === 'cancelled') {
        paymentStatus = 'not_paid';
      } else {
        paymentStatus = 'partial';
      }
      
      appointments.push({
        id: `appointment-${day.getTime()}-${i}`,
        customerId,
        barberId: 'b1',
        serviceId,
        date: format(day, 'yyyy-MM-dd'),
        startTime,
        endTime,
        status,
        totalPrice,
        downPayment,
        remainingPayment,
        paymentStatus,
      });
    }
  });
  
  return appointments;
};

// Mock data for customer information
const mockCustomers = {
  'c1': { name: 'John Smith', email: 'john@example.com', phone: '+63 917 123 4567' },
  'c2': { name: 'Maria Garcia', email: 'maria@example.com', phone: '+63 917 234 5678' },
  'c3': { name: 'David Lee', email: 'david@example.com', phone: '+63 917 345 6789' },
  'c4': { name: 'Sarah Johnson', email: 'sarah@example.com', phone: '+63 917 456 7890' },
  'c5': { name: 'Michael Brown', email: 'michael@example.com', phone: '+63 917 567 8901' },
  'c6': { name: 'Jennifer Wilson', email: 'jennifer@example.com', phone: '+63 917 678 9012' },
};

// Mock data for services
const mockServices = {
  's1': { name: 'Classic Haircut', price: 500 },
  's2': { name: 'Beard Trim', price: 300 },
  's3': { name: 'Hair & Beard Combo', price: 700 },
  's4': { name: 'Hot Towel Shave', price: 450 },
};

const BarberSchedule = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Booking[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Booking[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<'day' | 'month'>('day');
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>('all');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    // In a real app, fetch appointments from API
    // Simulate API call
    setTimeout(() => {
      const mockAppointments = generateMockAppointments();
      setAppointments(mockAppointments);
    }, 500);
  }, []);

  useEffect(() => {
    if (!appointments.length || !selectedDate) return;
    
    let filtered = appointments;
    
    // Filter by date if in day view
    if (view === 'day' && selectedDate) {
      filtered = filtered.filter(appointment => 
        appointment.date === format(selectedDate, 'yyyy-MM-dd')
      );
    }
    
    // Filter by status if not 'all'
    if (statusFilter !== 'all') {
      filtered = filtered.filter(appointment => appointment.status === statusFilter);
    }
    
    // Sort by time
    filtered.sort((a, b) => {
      if (a.date !== b.date) {
        return parseISO(a.date).getTime() - parseISO(b.date).getTime();
      }
      return a.startTime.localeCompare(b.startTime);
    });
    
    setFilteredAppointments(filtered);
  }, [appointments, selectedDate, view, statusFilter]);

  const handleStatusChange = (id: string, status: BookingStatus) => {
    // In a real app, update status via API
    setAppointments(prev => 
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

  // Function to check if a date has appointments
  const hasAppointments = (date: Date) => {
    return appointments.some(appointment => 
      appointment.date === format(date, 'yyyy-MM-dd')
    );
  };

  // Function to get appointment count for a date
  const getAppointmentCount = (date: Date) => {
    return appointments.filter(appointment => 
      appointment.date === format(date, 'yyyy-MM-dd')
    ).length;
  };

  // Navigate to previous/next day
  const navigateDay = (direction: 'prev' | 'next') => {
    if (!selectedDate) return;
    
    const newDate = direction === 'prev' 
      ? addDays(selectedDate, -1) 
      : addDays(selectedDate, 1);
    
    setSelectedDate(newDate);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-heading font-bold">Schedule</h1>
            <p className="text-muted-foreground">
              Manage your appointments and schedule
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Tabs 
              value={view} 
              onValueChange={(value) => setView(value as 'day' | 'month')}
              className="w-[200px]"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="day">Day</TabsTrigger>
                <TabsTrigger value="month">Month</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Filter className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                  <SheetDescription>
                    Filter your schedule by status
                  </SheetDescription>
                </SheetHeader>
                <div className="py-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Status</h3>
                      <Select
                        value={statusFilter}
                        onValueChange={(value) => setStatusFilter(value as BookingStatus | 'all')}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Statuses</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                          <SelectItem value="no_show">No Show</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            
            <div className="hidden md:block">
              <Select
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value as BookingStatus | 'all')}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="no_show">No Show</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="md:col-span-1">
            <div className="bg-card border border-border rounded-lg p-4">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
                modifiers={{
                  hasAppointments: hasAppointments,
                  today: isToday,
                }}
                modifiersClassNames={{
                  hasAppointments: "bg-accent/20 font-medium",
                  today: "bg-primary text-primary-foreground",
                }}
                components={{
                  DayContent: (props) => {
                    const count = getAppointmentCount(props.date);
                    return (
                      <div className="relative w-full h-full flex items-center justify-center">
                        {props.date.getDate()}
                        {count > 0 && (
                          <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-accent rounded-full" />
                        )}
                      </div>
                    );
                  },
                }}
              />
            </div>
          </div>

          {/* Appointments */}
          <div className="md:col-span-2">
            {view === 'day' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigateDay('prev')}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <h2 className="text-lg font-medium">
                    {selectedDate ? format(selectedDate, 'EEEE, MMMM d, yyyy') : ''}
                    {isToday(selectedDate!) && (
                      <Badge variant="outline" className="ml-2 bg-primary/10 text-primary border-primary/30">
                        Today
                      </Badge>
                    )}
                  </h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigateDay('next')}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                {filteredAppointments.length > 0 ? (
                  <div className="space-y-4">
                    {filteredAppointments.map((appointment) => (
                      <AppointmentCard
                        key={appointment.id}
                        id={appointment.id}
                        customerName={getCustomerName(appointment.customerId)}
                        customerEmail={getCustomerEmail(appointment.customerId)}
                        customerPhone={getCustomerPhone(appointment.customerId)}
                        barberName={user?.name || 'You'}
                        serviceName={getServiceName(appointment.serviceId)}
                        servicePrice={getServicePrice(appointment.serviceId)}
                        date={parseISO(appointment.date)}
                        startTime={appointment.startTime}
                        endTime={appointment.endTime}
                        status={appointment.status}
                        paymentStatus={appointment.paymentStatus}
                        userRole="barber"
                        onStatusChange={handleStatusChange}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-card border border-border rounded-lg p-8 text-center">
                    <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-medium text-lg mb-2">No Appointments</h3>
                    <p className="text-muted-foreground">
                      {view === 'day'
                        ? `You don't have any appointments on ${format(selectedDate!, 'MMMM d, yyyy')}`
                        : 'No appointments match your current filters'}
                    </p>
                  </div>
                )}
              </div>
            )}

            {view === 'month' && (
              <div className="space-y-4">
                <h2 className="text-lg font-medium">
                  {selectedDate ? format(selectedDate, 'MMMM yyyy') : ''}
                </h2>

                {filteredAppointments.length > 0 ? (
                  <div className="space-y-6">
                    {/* Group appointments by date */}
                    {Array.from(
                      new Set(filteredAppointments.map(a => a.date))
                    ).sort().map(date => {
                      const dateAppointments = filteredAppointments.filter(a => a.date === date);
                      return (
                        <div key={date} className="space-y-3">
                          <h3 className="font-medium flex items-center">
                            <CalendarIcon className="h-4 w-4 mr-2 text-accent" />
                            {format(parseISO(date), 'EEEE, MMMM d, yyyy')}
                            {isToday(parseISO(date)) && (
                              <Badge variant="outline" className="ml-2 bg-primary/10 text-primary border-primary/30">
                                Today
                              </Badge>
                            )}
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {dateAppointments.map(appointment => (
                              <AppointmentCard
                                key={appointment.id}
                                id={appointment.id}
                                customerName={getCustomerName(appointment.customerId)}
                                customerEmail={getCustomerEmail(appointment.customerId)}
                                customerPhone={getCustomerPhone(appointment.customerId)}
                                barberName={user?.name || 'You'}
                                serviceName={getServiceName(appointment.serviceId)}
                                servicePrice={getServicePrice(appointment.serviceId)}
                                date={parseISO(appointment.date)}
                                startTime={appointment.startTime}
                                endTime={appointment.endTime}
                                status={appointment.status}
                                paymentStatus={appointment.paymentStatus}
                                userRole="barber"
                                onStatusChange={handleStatusChange}
                              />
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="bg-card border border-border rounded-lg p-8 text-center">
                    <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-medium text-lg mb-2">No Appointments</h3>
                    <p className="text-muted-foreground">
                      No appointments match your current filters
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BarberSchedule;
