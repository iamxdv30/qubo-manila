import { useState, useEffect } from 'react';
import { format, parseISO, isToday, isThisWeek, isThisMonth } from 'date-fns';
import { 
  Search, 
  Filter, 
  CreditCard, 
  Loader2, 
  Download, 
  RefreshCw, 
  ArrowUpDown,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

import DashboardLayout from '@/components/layout/DashboardLayout';
import PaymentModal from '@/components/ui/PaymentModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Booking, BookingStatus, PaymentMethod } from '@/types';

// Generate mock bookings data
const generateMockBookings = (): Booking[] => {
  const bookings: Booking[] = [];
  const statuses: BookingStatus[] = ['confirmed', 'completed', 'cancelled', 'no_show'];
  const paymentStatuses: ('not_paid' | 'partial' | 'paid')[] = ['not_paid', 'partial', 'paid'];
  const serviceIds = ['s1', 's2', 's3', 's4'];
  const barberIds = ['b1', 'b2', 'b3'];
  const customerIds = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6'];
  
  // Generate 30 random bookings
  for (let i = 0; i < 30; i++) {
    // Random date within the last 30 days
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    
    // Random time
    const hour = Math.floor(Math.random() * 10) + 9; // 9 AM to 6 PM
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
    
    // Random status
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    // Payment status based on booking status
    let paymentStatus: 'not_paid' | 'partial' | 'paid';
    if (status === 'completed') {
      paymentStatus = paymentStatuses[Math.floor(Math.random() * 3)];
    } else if (status === 'cancelled' || status === 'no_show') {
      paymentStatus = Math.random() > 0.5 ? 'not_paid' : 'paid';
    } else {
      paymentStatus = 'partial'; // Down payment made for confirmed bookings
    }
    
    // Random service
    const serviceId = serviceIds[Math.floor(Math.random() * serviceIds.length)];
    
    // Random price based on service
    let totalPrice = 0;
    switch (serviceId) {
      case 's1': totalPrice = 500; break;
      case 's2': totalPrice = 300; break;
      case 's3': totalPrice = 700; break;
      case 's4': totalPrice = 450; break;
    }
    
    // Calculate down payment and remaining payment
    const downPayment = Math.round(totalPrice * 0.3);
    let remainingPayment = totalPrice - downPayment;
    
    // If fully paid, remaining is 0
    if (paymentStatus === 'paid') {
      remainingPayment = 0;
    }
    
    bookings.push({
      id: `booking-${i + 1}`,
      customerId: customerIds[Math.floor(Math.random() * customerIds.length)],
      barberId: barberIds[Math.floor(Math.random() * barberIds.length)],
      serviceId,
      date: format(date, 'yyyy-MM-dd'),
      startTime,
      endTime,
      status,
      totalPrice,
      downPayment,
      remainingPayment,
      paymentStatus,
    });
  }
  
  return bookings;
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

const PaymentManagement = () => {
  const { user } = useAuth();
  
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>('all');
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'paid' | 'partial' | 'not_paid'>('all');
  const [timeFilter, setTimeFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'price'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [refundAmount, setRefundAmount] = useState<number>(0);
  const [isProcessingRefund, setIsProcessingRefund] = useState(false);

  useEffect(() => {
    // In a real app, fetch bookings from API
    // Simulate API call
    setTimeout(() => {
      const mockBookings = generateMockBookings();
      setBookings(mockBookings);
      setFilteredBookings(mockBookings);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (!bookings.length) return;
    
    let result = [...bookings];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(booking => {
        const customerName = getCustomerName(booking.customerId).toLowerCase();
        const barberName = getBarberName(booking.barberId).toLowerCase();
        const serviceName = getServiceName(booking.serviceId).toLowerCase();
        const searchLower = searchTerm.toLowerCase();
        
        return customerName.includes(searchLower) || 
               barberName.includes(searchLower) || 
               serviceName.includes(searchLower) ||
               booking.id.toLowerCase().includes(searchLower);
      });
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(booking => booking.status === statusFilter);
    }
    
    // Apply payment filter
    if (paymentFilter !== 'all') {
      result = result.filter(booking => booking.paymentStatus === paymentFilter);
    }
    
    // Apply time filter
    if (timeFilter !== 'all') {
      result = result.filter(booking => {
        const bookingDate = parseISO(booking.date);
        
        if (timeFilter === 'today') {
          return isToday(bookingDate);
        } else if (timeFilter === 'week') {
          return isThisWeek(bookingDate);
        } else if (timeFilter === 'month') {
          return isThisMonth(bookingDate);
        }
        
        return true;
      });
    }
    
    // Apply sorting
    result.sort((a, b) => {
      if (sortBy === 'date') {
        const dateA = new Date(`${a.date} ${a.startTime}`).getTime();
        const dateB = new Date(`${b.date} ${b.startTime}`).getTime();
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      } else {
        return sortOrder === 'asc' 
          ? a.totalPrice - b.totalPrice 
          : b.totalPrice - a.totalPrice;
      }
    });
    
    setFilteredBookings(result);
  }, [bookings, searchTerm, statusFilter, paymentFilter, timeFilter, sortBy, sortOrder]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    
    // In a real app, fetch fresh data from API
    // Simulate API call
    setTimeout(() => {
      const mockBookings = generateMockBookings();
      setBookings(mockBookings);
      setIsRefreshing(false);
    }, 1000);
  };

  const handlePaymentComplete = (bookingId: string, method: PaymentMethod, amount: number) => {
    // In a real app, process payment via API
    // Update booking payment status
    setBookings(prev => 
      prev.map(booking => 
        booking.id === bookingId 
          ? { 
              ...booking, 
              paymentStatus: amount >= booking.remainingPayment ? 'paid' : 'partial',
              remainingPayment: Math.max(0, booking.remainingPayment - amount)
            } 
          : booking
      )
    );
    
    // Close modal
    setIsPaymentModalOpen(false);
    setSelectedBooking(null);
  };

  const handleRefund = () => {
    if (!selectedBooking) return;
    
    setIsProcessingRefund(true);
    
    // In a real app, process refund via API
    // Simulate API call
    setTimeout(() => {
      // Update booking payment status
      setBookings(prev => 
        prev.map(booking => 
          booking.id === selectedBooking.id 
            ? { 
                ...booking,
                status: 'cancelled',
                paymentStatus: 'not_paid',
                remainingPayment: 0
              } 
            : booking
        )
      );
      
      setIsProcessingRefund(false);
      setIsRefundModalOpen(false);
      setSelectedBooking(null);
      setRefundAmount(0);
    }, 1500);
  };

  const openPaymentModal = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsPaymentModalOpen(true);
  };

  const openRefundModal = (booking: Booking) => {
    setSelectedBooking(booking);
    setRefundAmount(booking.totalPrice - booking.remainingPayment);
    setIsRefundModalOpen(true);
  };

  const getCustomerName = (customerId: string) => {
    return mockCustomers[customerId as keyof typeof mockCustomers]?.name || 'Unknown Customer';
  };

  const getBarberName = (barberId: string) => {
    return mockBarbers[barberId as keyof typeof mockBarbers]?.name || 'Unknown Barber';
  };

  const getServiceName = (serviceId: string) => {
    return mockServices[serviceId as keyof typeof mockServices]?.name || 'Unknown Service';
  };

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-blue-500/20 text-blue-500 border-blue-500/50">Pending</Badge>;
      case 'confirmed':
        return <Badge variant="outline" className="bg-blue-500/20 text-blue-500 border-blue-500/50">Confirmed</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-500/20 text-green-500 border-green-500/50">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-500/20 text-red-500 border-red-500/50">Cancelled</Badge>;
      case 'no_show':
        return <Badge variant="outline" className="bg-amber-500/20 text-amber-500 border-amber-500/50">No Show</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: 'not_paid' | 'partial' | 'paid') => {
    switch (status) {
      case 'paid':
        return <Badge variant="outline" className="bg-green-500/20 text-green-500 border-green-500/50">Paid</Badge>;
      case 'partial':
        return <Badge variant="outline" className="bg-amber-500/20 text-amber-500 border-amber-500/50">Partial</Badge>;
      case 'not_paid':
        return <Badge variant="outline" className="bg-red-500/20 text-red-500 border-red-500/50">Not Paid</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const renderFilters = () => (
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
      
      <div>
        <h3 className="text-sm font-medium mb-2">Payment Status</h3>
        <Select
          value={paymentFilter}
          onValueChange={(value) => setPaymentFilter(value as 'all' | 'paid' | 'partial' | 'not_paid')}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by payment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Payments</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="partial">Partial</SelectItem>
            <SelectItem value="not_paid">Not Paid</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2">Time Period</h3>
        <Select
          value={timeFilter}
          onValueChange={(value) => setTimeFilter(value as 'all' | 'today' | 'week' | 'month')}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by time" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-heading font-bold">Payment Management</h1>
            <p className="text-muted-foreground">
              Process payments, refunds, and view booking payment status
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              {isRefreshing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              disabled={filteredBookings.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters - Desktop */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <Card>
              <CardContent className="p-6">
                <h2 className="font-heading font-semibold text-lg mb-4">Filters</h2>
                {renderFilters()}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="space-y-4">
              {/* Search and Sort Controls */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search by name, service, or booking ID..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <Select
                    value={`${sortBy}-${sortOrder}`}
                    onValueChange={(value) => {
                      const [by, order] = value.split('-');
                      setSortBy(by as 'date' | 'price');
                      setSortOrder(order as 'asc' | 'desc');
                    }}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date-desc">Date (Newest)</SelectItem>
                      <SelectItem value="date-asc">Date (Oldest)</SelectItem>
                      <SelectItem value="price-desc">Price (High to Low)</SelectItem>
                      <SelectItem value="price-asc">Price (Low to High)</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {/* Mobile filter button */}
                  <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="md:hidden">
                        <Filter className="h-4 w-4 mr-2" />
                        Filters
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right">
                      <SheetHeader>
                        <SheetTitle>Filters</SheetTitle>
                        <SheetDescription>
                          Filter bookings by status, payment, and time
                        </SheetDescription>
                      </SheetHeader>
                      <div className="py-6">
                        {renderFilters()}
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>

              {/* Bookings Table */}
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-accent" />
                </div>
              ) : filteredBookings.length > 0 ? (
                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left p-4 font-medium">Customer</th>
                            <th className="text-left p-4 font-medium">Service</th>
                            <th className="text-left p-4 font-medium">Date & Time</th>
                            <th className="text-left p-4 font-medium">Status</th>
                            <th className="text-left p-4 font-medium">Payment</th>
                            <th className="text-left p-4 font-medium">Amount</th>
                            <th className="text-left p-4 font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredBookings.map((booking) => (
                            <tr key={booking.id} className="border-b border-border hover:bg-muted/50">
                              <td className="p-4">
                                <div>
                                  <p className="font-medium">{getCustomerName(booking.customerId)}</p>
                                  <p className="text-sm text-muted-foreground">ID: {booking.id}</p>
                                </div>
                              </td>
                              <td className="p-4">
                                <div>
                                  <p>{getServiceName(booking.serviceId)}</p>
                                  <p className="text-sm text-muted-foreground">with {getBarberName(booking.barberId)}</p>
                                </div>
                              </td>
                              <td className="p-4">
                                <div>
                                  <p>{format(parseISO(booking.date), 'MMM d, yyyy')}</p>
                                  <p className="text-sm text-muted-foreground">{booking.startTime} - {booking.endTime}</p>
                                </div>
                              </td>
                              <td className="p-4">
                                {getStatusBadge(booking.status)}
                              </td>
                              <td className="p-4">
                                {getPaymentStatusBadge(booking.paymentStatus)}
                              </td>
                              <td className="p-4">
                                <div>
                                  <p className="font-medium">₱{booking.totalPrice}</p>
                                  {booking.paymentStatus === 'partial' && (
                                    <p className="text-sm text-muted-foreground">
                                      Remaining: ₱{booking.remainingPayment}
                                    </p>
                                  )}
                                </div>
                              </td>
                              <td className="p-4">
                                <div className="flex items-center gap-2">
                                  {booking.status === 'completed' && booking.paymentStatus !== 'paid' && (
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={() => openPaymentModal(booking)}
                                    >
                                      <CreditCard className="h-4 w-4 mr-1" />
                                      Pay
                                    </Button>
                                  )}
                                  
                                  {(booking.status === 'confirmed' || booking.status === 'completed') && 
                                   booking.paymentStatus !== 'not_paid' && (
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={() => openRefundModal(booking)}
                                    >
                                      Refund
                                    </Button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="bg-card border border-border rounded-lg p-8 text-center">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium text-lg mb-2">No Bookings Found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your filters or search criteria
                  </p>
                </div>
              )}
            </div>
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

      {/* Refund Modal */}
      <Dialog open={isRefundModalOpen} onOpenChange={setIsRefundModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Process Refund</DialogTitle>
            <DialogDescription>
              {selectedBooking && (
                <>
                  Refund for {getCustomerName(selectedBooking.customerId)}'s {getServiceName(selectedBooking.serviceId)}
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="space-y-4">
              <div className="bg-muted/30 p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">Total Amount:</span>
                  <span className="font-medium">₱{selectedBooking?.totalPrice}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">Amount Paid:</span>
                  <span className="font-medium">₱{selectedBooking ? selectedBooking.totalPrice - selectedBooking.remainingPayment : 0}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-border">
                  <span className="font-medium">Refund Amount:</span>
                  <span className="font-medium text-red-500">₱{refundAmount}</span>
                </div>
              </div>
              
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 text-sm">
                <h4 className="font-medium flex items-center text-amber-600 mb-2">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Important
                </h4>
                <p className="text-muted-foreground">
                  This action will mark the booking as cancelled and process a refund. This cannot be undone.
                </p>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsRefundModalOpen(false)}
              disabled={isProcessingRefund}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleRefund}
              disabled={isProcessingRefund}
            >
              {isProcessingRefund ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                'Process Refund'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default PaymentManagement;
