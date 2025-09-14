import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { 
  BarChart3, 
  Users, 
  AlertTriangle, 
  ArrowRight, 
  Scissors, 
  MessageSquare, 
  FileText,
  Building,
  Bell,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Loader2
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
  LineChart,
  Line
} from 'recharts';

// Mock data for revenue analytics
const revenueData = [
  { name: 'Mon', revenue: 12500 },
  { name: 'Tue', revenue: 9800 },
  { name: 'Wed', revenue: 11200 },
  { name: 'Thu', revenue: 14300 },
  { name: 'Fri', revenue: 18500 },
  { name: 'Sat', revenue: 22000 },
  { name: 'Sun', revenue: 15600 },
];

// Mock data for barber performance
const barberPerformanceData = [
  { name: 'John Doe', appointments: 28, revenue: 15400 },
  { name: 'Mike Smith', appointments: 24, revenue: 12800 },
  { name: 'David Chen', appointments: 19, revenue: 9500 },
  { name: 'Alex Johnson', appointments: 26, revenue: 14200 },
  { name: 'Carlos Rodriguez', appointments: 22, revenue: 11900 },
];

// Mock data for pending requests
const pendingRequestsData = [
  { 
    id: 'req1', 
    type: 'pto', 
    barber: 'John Doe', 
    date: '2025-09-20 to 2025-09-25', 
    reason: 'Family vacation',
    createdAt: new Date(2025, 8, 10),
  },
  { 
    id: 'req2', 
    type: 'sick', 
    barber: 'Mike Smith', 
    date: '2025-09-16', 
    reason: 'Flu symptoms',
    createdAt: new Date(2025, 8, 14),
  },
  { 
    id: 'req3', 
    type: 'price', 
    barber: 'David Chen', 
    service: 'Classic Haircut', 
    currentPrice: 500,
    requestedPrice: 550,
    reason: 'Increased cost of supplies',
    createdAt: new Date(2025, 8, 12),
  },
  { 
    id: 'req4', 
    type: 'pto', 
    barber: 'Alex Johnson', 
    date: '2025-09-18 to 2025-09-19', 
    reason: 'Personal matters',
    createdAt: new Date(2025, 8, 13),
  },
  { 
    id: 'req5', 
    type: 'price', 
    barber: 'Carlos Rodriguez', 
    service: 'Hair Coloring', 
    currentPrice: 800,
    requestedPrice: 900,
    reason: 'Additional training completed',
    createdAt: new Date(2025, 8, 11),
  },
];

// Mock data for system alerts
const systemAlertsData = [
  { 
    id: 'alert1', 
    type: 'no_show', 
    customer: 'John Smith', 
    barber: 'John Doe', 
    date: '2025-09-14', 
    time: '10:00 AM',
    service: 'Classic Haircut',
  },
  { 
    id: 'alert2', 
    type: 'power_tripper', 
    customer: 'Michael Brown', 
    barber: 'Mike Smith', 
    date: '2025-09-13', 
    time: '3:30 PM',
    service: 'Hair & Beard Combo',
    frequency: 3,
  },
  { 
    id: 'alert3', 
    type: 'technical', 
    issue: 'Payment system error', 
    date: '2025-09-15', 
    time: '11:45 AM',
    details: 'Card payments failing to process',
  },
];

// Mock data for branches
const branchesData = [
  { 
    id: 'branch1', 
    name: 'Makati Branch', 
    todayRevenue: 15800, 
    todayAppointments: 12,
    weeklyTrend: 'up',
    weeklyChange: 8.5,
  },
  { 
    id: 'branch2', 
    name: 'BGC Branch', 
    todayRevenue: 18200, 
    todayAppointments: 15,
    weeklyTrend: 'up',
    weeklyChange: 12.3,
  },
  { 
    id: 'branch3', 
    name: 'Ortigas Branch', 
    todayRevenue: 12500, 
    todayAppointments: 10,
    weeklyTrend: 'down',
    weeklyChange: 3.2,
  },
];

const GeneralAdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('overview');
  
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalAppointments: 0,
    pendingRequests: 0,
    systemAlerts: 0,
  });

  useEffect(() => {
    // In a real app, fetch data from API
    // Simulate API call
    setTimeout(() => {
      setStats({
        totalRevenue: 103900,
        totalAppointments: 119,
        pendingRequests: pendingRequestsData.length,
        systemAlerts: systemAlertsData.length,
      });
      
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filter data based on selected branch
  const getFilteredData = () => {
    if (selectedBranch === 'all') {
      return {
        revenue: revenueData,
        barbers: barberPerformanceData,
      };
    }
    
    // In a real app, this would filter data by branch
    // For demo, just return the same data
    return {
      revenue: revenueData,
      barbers: barberPerformanceData,
    };
  };

  const filteredData = getFilteredData();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-heading font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.name}. Today is {format(new Date(), 'EEEE, MMMM d, yyyy')}
            </p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <Select
              value={selectedBranch}
              onValueChange={setSelectedBranch}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select branch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Branches</SelectItem>
                <SelectItem value="branch1">Makati Branch</SelectItem>
                <SelectItem value="branch2">BGC Branch</SelectItem>
                <SelectItem value="branch3">Ortigas Branch</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
          </div>
        ) : (
          <>
            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Weekly Revenue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <DollarSign className="h-5 w-5 text-accent mr-2" />
                    <span className="text-2xl font-bold">₱{stats.totalRevenue.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Weekly Appointments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-accent mr-2" />
                    <span className="text-2xl font-bold">{stats.totalAppointments}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Pending Requests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-amber-500 mr-2" />
                    <span className="text-2xl font-bold">{stats.pendingRequests}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    System Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                    <span className="text-2xl font-bold">{stats.systemAlerts}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="overview" onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="branches">Branches</TabsTrigger>
                <TabsTrigger value="alerts">Alerts & Requests</TabsTrigger>
              </TabsList>
              
              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                {/* Revenue Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Analytics</CardTitle>
                    <CardDescription>
                      Weekly revenue breakdown
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={filteredData.revenue}
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

                {/* Barber Performance */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Barber Performance</CardTitle>
                      <CardDescription>
                        Weekly performance metrics by barber
                      </CardDescription>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate('/dashboard/manage-barbers')}
                    >
                      Manage Barbers
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left p-4 font-medium">Barber</th>
                            <th className="text-left p-4 font-medium">Appointments</th>
                            <th className="text-left p-4 font-medium">Revenue</th>
                            <th className="text-left p-4 font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredData.barbers.map((barber, index) => (
                            <tr key={index} className="border-b border-border hover:bg-muted/50">
                              <td className="p-4 font-medium">{barber.name}</td>
                              <td className="p-4">{barber.appointments}</td>
                              <td className="p-4">₱{barber.revenue.toLocaleString()}</td>
                              <td className="p-4">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => navigate(`/dashboard/manage-barbers/${index + 1}`)}
                                >
                                  View Details
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <div className="space-y-4">
                  <h2 className="text-xl font-heading font-semibold">Quick Actions</h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Card className="hover:border-accent/50 transition-colors cursor-pointer" onClick={() => navigate('/dashboard/manage-barbers')}>
                      <CardContent className="p-6 flex flex-col items-center text-center">
                        <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mb-3">
                          <Scissors className="h-6 w-6 text-accent" />
                        </div>
                        <h3 className="font-medium">Manage Barbers</h3>
                        <p className="text-sm text-muted-foreground mt-1">Add, edit, or view barber information</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="hover:border-accent/50 transition-colors cursor-pointer" onClick={() => navigate('/dashboard/announcements')}>
                      <CardContent className="p-6 flex flex-col items-center text-center">
                        <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mb-3">
                          <MessageSquare className="h-6 w-6 text-accent" />
                        </div>
                        <h3 className="font-medium">Announcements</h3>
                        <p className="text-sm text-muted-foreground mt-1">Create and manage announcements</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="hover:border-accent/50 transition-colors cursor-pointer" onClick={() => navigate('/dashboard/review-requests')}>
                      <CardContent className="p-6 flex flex-col items-center text-center">
                        <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mb-3">
                          <FileText className="h-6 w-6 text-accent" />
                        </div>
                        <h3 className="font-medium">Review Requests</h3>
                        <p className="text-sm text-muted-foreground mt-1">Handle PTO, sick leave, and price requests</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
              
              {/* Branches Tab */}
              <TabsContent value="branches" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {branchesData.map((branch) => (
                    <Card key={branch.id}>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Building className="h-5 w-5 mr-2 text-accent" />
                          {branch.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm text-muted-foreground">Today's Revenue</p>
                            <p className="text-xl font-bold">₱{branch.todayRevenue.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Appointments</p>
                            <p className="text-xl font-bold">{branch.todayAppointments}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <p className="text-sm text-muted-foreground mr-2">Weekly Trend:</p>
                          <div className="flex items-center">
                            {branch.weeklyTrend === 'up' ? (
                              <>
                                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                                <span className="text-green-500">+{branch.weeklyChange}%</span>
                              </>
                            ) : (
                              <>
                                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                                <span className="text-red-500">-{branch.weeklyChange}%</span>
                              </>
                            )}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={() => setSelectedBranch(branch.id)}
                        >
                          View Details
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Branch Comparison</CardTitle>
                    <CardDescription>
                      Weekly revenue comparison across branches
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="Makati" 
                            stroke="#3b82f6" 
                            activeDot={{ r: 8 }} 
                          />
                          <Line 
                            type="monotone" 
                            dataKey="BGC" 
                            stroke="#10b981" 
                            activeDot={{ r: 8 }} 
                          />
                          <Line 
                            type="monotone" 
                            dataKey="Ortigas" 
                            stroke="#f97316" 
                            activeDot={{ r: 8 }} 
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Alerts & Requests Tab */}
              <TabsContent value="alerts" className="space-y-6">
                {/* System Alerts */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center">
                        <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
                        System Alerts
                      </CardTitle>
                      <CardDescription>
                        Issues requiring your attention
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="bg-red-500/20 text-red-500 border-red-500/50">
                      {systemAlertsData.length} Alerts
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {systemAlertsData.map((alert) => (
                        <div 
                          key={alert.id} 
                          className="p-4 border border-border rounded-lg hover:border-red-500/50 transition-colors"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <div>
                              <h3 className="font-medium flex items-center">
                                {alert.type === 'no_show' && (
                                  <>
                                    <Calendar className="h-4 w-4 mr-2 text-amber-500" />
                                    No-Show Alert
                                  </>
                                )}
                                {alert.type === 'power_tripper' && (
                                  <>
                                    <Users className="h-4 w-4 mr-2 text-red-500" />
                                    Power Tripper Alert
                                  </>
                                )}
                                {alert.type === 'technical' && (
                                  <>
                                    <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
                                    Technical Issue
                                  </>
                                )}
                              </h3>
                              {alert.type === 'no_show' && (
                                <p className="text-sm text-muted-foreground mt-1">
                                  Customer {alert.customer} didn't show up for their {alert.service} appointment with {alert.barber} on {alert.date} at {alert.time}
                                </p>
                              )}
                              {alert.type === 'power_tripper' && (
                                <p className="text-sm text-muted-foreground mt-1">
                                  Customer {alert.customer} has cancelled {alert.frequency} appointments last-minute with {alert.barber}
                                </p>
                              )}
                              {alert.type === 'technical' && (
                                <p className="text-sm text-muted-foreground mt-1">
                                  {alert.issue}: {alert.details}
                                </p>
                              )}
                            </div>
                            <Button variant="outline" size="sm">
                              Handle Issue
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Pending Requests */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center">
                        <FileText className="h-5 w-5 mr-2 text-amber-500" />
                        Pending Requests
                      </CardTitle>
                      <CardDescription>
                        Requests awaiting your approval
                      </CardDescription>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate('/dashboard/review-requests')}
                    >
                      View All
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {pendingRequestsData.slice(0, 3).map((request) => (
                        <div 
                          key={request.id} 
                          className="p-4 border border-border rounded-lg hover:border-amber-500/50 transition-colors"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <div>
                              <h3 className="font-medium flex items-center">
                                {request.type === 'pto' && (
                                  <>
                                    <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                                    PTO Request
                                  </>
                                )}
                                {request.type === 'sick' && (
                                  <>
                                    <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
                                    Sick Leave
                                  </>
                                )}
                                {request.type === 'price' && (
                                  <>
                                    <DollarSign className="h-4 w-4 mr-2 text-green-500" />
                                    Price Increase
                                  </>
                                )}
                              </h3>
                              <p className="text-sm font-medium mt-1">
                                {request.barber}
                              </p>
                              {request.type === 'pto' && (
                                <p className="text-sm text-muted-foreground">
                                  Dates: {request.date}
                                </p>
                              )}
                              {request.type === 'sick' && (
                                <p className="text-sm text-muted-foreground">
                                  Date: {request.date}
                                </p>
                              )}
                              {request.type === 'price' && (
                                <p className="text-sm text-muted-foreground">
                                  {request.service}: ₱{request.currentPrice} → ₱{request.requestedPrice}
                                </p>
                              )}
                              <p className="text-xs text-muted-foreground mt-1">
                                Submitted {format(request.createdAt, 'MMM d, yyyy')}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                Deny
                              </Button>
                              <Button size="sm">
                                Approve
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {pendingRequestsData.length > 3 && (
                        <div className="text-center">
                          <Button 
                            variant="link" 
                            onClick={() => navigate('/dashboard/review-requests')}
                          >
                            View {pendingRequestsData.length - 3} more requests
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default GeneralAdminDashboard;
