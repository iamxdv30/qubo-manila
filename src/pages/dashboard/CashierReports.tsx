import { useState, useEffect } from 'react';
import { format, subDays, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { 
  Calendar as CalendarIcon, 
  Download, 
  FileText, 
  BarChart3, 
  PieChart, 
  ArrowUpDown,
  Loader2
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { PaymentMethod } from '@/types';

// Import Recharts components
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';

// Generate mock data for daily revenue
const generateDailyRevenueData = () => {
  const today = new Date();
  const data = [];
  
  for (let i = 6; i >= 0; i--) {
    const date = subDays(today, i);
    const dayName = format(date, 'EEE');
    
    // Random revenue between 5000 and 15000
    const revenue = Math.floor(Math.random() * 10000) + 5000;
    
    // Random completed appointments between 5 and 15
    const appointments = Math.floor(Math.random() * 10) + 5;
    
    data.push({
      name: dayName,
      date: format(date, 'MMM dd'),
      revenue,
      appointments,
    });
  }
  
  return data;
};

// Generate mock data for monthly revenue
const generateMonthlyRevenueData = () => {
  const today = new Date();
  const start = startOfMonth(today);
  const end = endOfMonth(today);
  
  const days = eachDayOfInterval({ start, end });
  
  return days.map(day => {
    // Random revenue between 3000 and 12000
    const revenue = Math.floor(Math.random() * 9000) + 3000;
    
    // Random completed appointments between 3 and 12
    const appointments = Math.floor(Math.random() * 9) + 3;
    
    return {
      name: format(day, 'd'),
      date: format(day, 'MMM dd'),
      revenue,
      appointments,
    };
  });
};

// Generate mock data for payment methods
const generatePaymentMethodData = () => {
  // Random distribution of payment methods
  const cash = Math.floor(Math.random() * 30) + 30; // 30-60%
  const gcash = Math.floor(Math.random() * 20) + 15; // 15-35%
  const card = Math.floor(Math.random() * 15) + 10; // 10-25%
  const maya = 100 - cash - gcash - card; // Remainder
  
  return [
    { name: 'Cash', value: cash, color: '#10b981' },
    { name: 'GCash', value: gcash, color: '#3b82f6' },
    { name: 'Card', value: card, color: '#f97316' },
    { name: 'Maya', value: maya, color: '#8b5cf6' },
  ];
};

// Generate mock data for barber performance
const generateBarberPerformanceData = () => {
  const barbers = [
    { name: 'John Doe', id: 'b1' },
    { name: 'Mike Smith', id: 'b2' },
    { name: 'David Chen', id: 'b3' },
    { name: 'Alex Johnson', id: 'b4' },
    { name: 'Carlos Rodriguez', id: 'b5' },
  ];
  
  return barbers.map(barber => {
    // Random revenue between 20000 and 50000
    const revenue = Math.floor(Math.random() * 30000) + 20000;
    
    // Random clients between 20 and 50
    const clients = Math.floor(Math.random() * 30) + 20;
    
    // Random average rating between 4.0 and 5.0
    const rating = (Math.random() * 1 + 4).toFixed(1);
    
    return {
      id: barber.id,
      name: barber.name,
      revenue,
      clients,
      rating: parseFloat(rating),
    };
  });
};

// Generate mock data for service popularity
const generateServicePopularityData = () => {
  return [
    { name: 'Classic Haircut', value: Math.floor(Math.random() * 30) + 30, color: '#10b981' },
    { name: 'Beard Trim', value: Math.floor(Math.random() * 20) + 15, color: '#3b82f6' },
    { name: 'Hair & Beard Combo', value: Math.floor(Math.random() * 15) + 10, color: '#f97316' },
    { name: 'Hot Towel Shave', value: Math.floor(Math.random() * 10) + 5, color: '#8b5cf6' },
    { name: 'Hair Coloring', value: Math.floor(Math.random() * 10) + 5, color: '#ec4899' },
  ];
};

const CashierReports = () => {
  const { user } = useAuth();
  
  const [isLoading, setIsLoading] = useState(true);
  const [reportType, setReportType] = useState<'daily' | 'monthly'>('daily');
  const [exportFormat, setExportFormat] = useState<'pdf' | 'excel'>('pdf');
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: subDays(new Date(), 6),
    to: new Date(),
  });
  
  const [dailyRevenueData, setDailyRevenueData] = useState<any[]>([]);
  const [monthlyRevenueData, setMonthlyRevenueData] = useState<any[]>([]);
  const [paymentMethodData, setPaymentMethodData] = useState<any[]>([]);
  const [barberPerformanceData, setBarberPerformanceData] = useState<any[]>([]);
  const [servicePopularityData, setServicePopularityData] = useState<any[]>([]);
  
  const [summaryStats, setSummaryStats] = useState({
    totalRevenue: 0,
    totalAppointments: 0,
    averageTicket: 0,
    topBarber: '',
    topService: '',
  });

  useEffect(() => {
    // In a real app, fetch report data from API based on date range
    // Simulate API call
    setTimeout(() => {
      const dailyData = generateDailyRevenueData();
      const monthlyData = generateMonthlyRevenueData();
      const paymentData = generatePaymentMethodData();
      const barberData = generateBarberPerformanceData();
      const serviceData = generateServicePopularityData();
      
      setDailyRevenueData(dailyData);
      setMonthlyRevenueData(monthlyData);
      setPaymentMethodData(paymentData);
      setBarberPerformanceData(barberData);
      setServicePopularityData(serviceData);
      
      // Calculate summary stats
      const totalRevenue = dailyData.reduce((sum, day) => sum + day.revenue, 0);
      const totalAppointments = dailyData.reduce((sum, day) => sum + day.appointments, 0);
      
      setSummaryStats({
        totalRevenue,
        totalAppointments,
        averageTicket: Math.round(totalRevenue / totalAppointments),
        topBarber: barberData.sort((a, b) => b.revenue - a.revenue)[0].name,
        topService: serviceData.sort((a, b) => b.value - a.value)[0].name,
      });
      
      setIsLoading(false);
    }, 1500);
  }, [dateRange]);

  const handleExportReport = () => {
    // In a real app, this would generate and download a report
    console.log(`Exporting ${reportType} report as ${exportFormat}...`);
    console.log('Date range:', dateRange);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-heading font-bold">Reports</h1>
            <p className="text-muted-foreground">
              View revenue, performance, and customer statistics
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <Select
              value={reportType}
              onValueChange={(value) => setReportType(value as 'daily' | 'monthly')}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Report Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily Report</SelectItem>
                <SelectItem value="monthly">Monthly Report</SelectItem>
              </SelectContent>
            </Select>
            
            <Select
              value={exportFormat}
              onValueChange={(value) => setExportFormat(value as 'pdf' | 'excel')}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Export Format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="excel">Excel</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              onClick={handleExportReport}
              disabled={isLoading}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Date Range Picker */}
        <Card>
          <CardHeader>
            <CardTitle>Date Range</CardTitle>
            <CardDescription>
              Select a date range to view reports for
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="border border-border rounded-md p-2">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={setDateRange as any}
                  className="mx-auto"
                  disabled={(date) => date > new Date()}
                />
              </div>
              
              <div className="flex-1 flex flex-col justify-center">
                <div className="bg-muted/30 border border-border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Selected Range</h3>
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <CalendarIcon className="h-4 w-4" />
                    <span>
                      {dateRange.from ? format(dateRange.from, 'MMMM d, yyyy') : 'Start date'} 
                      {' - '} 
                      {dateRange.to ? format(dateRange.to, 'MMMM d, yyyy') : 'End date'}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                  <div className="bg-card border border-border rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                    <p className="text-2xl font-bold">₱{summaryStats.totalRevenue.toLocaleString()}</p>
                  </div>
                  <div className="bg-card border border-border rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">Appointments</p>
                    <p className="text-2xl font-bold">{summaryStats.totalAppointments}</p>
                  </div>
                  <div className="bg-card border border-border rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">Avg. Ticket</p>
                    <p className="text-2xl font-bold">₱{summaryStats.averageTicket.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
          </div>
        ) : (
          <>
            {/* Revenue Charts */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
                <CardDescription>
                  {reportType === 'daily' ? 'Daily revenue for the selected period' : 'Monthly revenue breakdown'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={reportType === 'daily' ? dailyRevenueData : monthlyRevenueData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value: number) => [`₱${value.toLocaleString()}`, 'Revenue']} />
                      <Legend />
                      <Bar dataKey="revenue" name="Revenue" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Payment Methods and Service Popularity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>
                    Distribution of payment methods used
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={paymentMethodData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {paymentMethodData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => [`${value}%`, 'Percentage']} />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Service Popularity</CardTitle>
                  <CardDescription>
                    Most popular services by number of bookings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={servicePopularityData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {servicePopularityData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => [`${value}%`, 'Percentage']} />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Barber Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Barber Performance</CardTitle>
                <CardDescription>
                  Revenue and client metrics by barber
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-4 font-medium">Barber</th>
                        <th className="text-left p-4 font-medium">
                          <div className="flex items-center cursor-pointer">
                            Revenue
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </div>
                        </th>
                        <th className="text-left p-4 font-medium">
                          <div className="flex items-center cursor-pointer">
                            Clients
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </div>
                        </th>
                        <th className="text-left p-4 font-medium">
                          <div className="flex items-center cursor-pointer">
                            Avg. Rating
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </div>
                        </th>
                        <th className="text-left p-4 font-medium">Performance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {barberPerformanceData.map((barber) => (
                        <tr key={barber.id} className="border-b border-border hover:bg-muted/50">
                          <td className="p-4 font-medium">{barber.name}</td>
                          <td className="p-4">₱{barber.revenue.toLocaleString()}</td>
                          <td className="p-4">{barber.clients}</td>
                          <td className="p-4">{barber.rating}</td>
                          <td className="p-4">
                            <Badge variant="outline" className={
                              barber.rating >= 4.7 
                                ? 'bg-green-500/20 text-green-500 border-green-500/50' 
                                : barber.rating >= 4.3
                                ? 'bg-blue-500/20 text-blue-500 border-blue-500/50'
                                : 'bg-amber-500/20 text-amber-500 border-amber-500/50'
                            }>
                              {barber.rating >= 4.7 
                                ? 'Excellent' 
                                : barber.rating >= 4.3
                                ? 'Good'
                                : 'Average'}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Appointments Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Appointments Trend</CardTitle>
                <CardDescription>
                  Number of appointments over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={reportType === 'daily' ? dailyRevenueData : monthlyRevenueData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="appointments" 
                        name="Appointments" 
                        stroke="#8b5cf6" 
                        activeDot={{ r: 8 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CashierReports;
