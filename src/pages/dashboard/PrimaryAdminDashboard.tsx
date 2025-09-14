import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { 
  BarChart3, 
  Users, 
  AlertTriangle, 
  ArrowRight, 
  Settings, 
  Building,
  Bell,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Loader2,
  Shield,
  UserCog
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
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// Mock data for revenue analytics
const revenueData = [
  { name: 'Jan', revenue: 125000 },
  { name: 'Feb', revenue: 98000 },
  { name: 'Mar', revenue: 112000 },
  { name: 'Apr', revenue: 143000 },
  { name: 'May', revenue: 185000 },
  { name: 'Jun', revenue: 220000 },
  { name: 'Jul', revenue: 156000 },
  { name: 'Aug', revenue: 172000 },
  { name: 'Sep', revenue: 190000 },
];

// Mock data for branches
const branchesData = [
  { 
    id: 'branch1', 
    name: 'Makati Branch', 
    monthlyRevenue: 158000, 
    monthlyAppointments: 320,
    yearlyTrend: 'up',
    yearlyChange: 12.5,
  },
  { 
    id: 'branch2', 
    name: 'BGC Branch', 
    monthlyRevenue: 182000, 
    monthlyAppointments: 350,
    yearlyTrend: 'up',
    yearlyChange: 18.3,
  },
  { 
    id: 'branch3', 
    name: 'Ortigas Branch', 
    monthlyRevenue: 125000, 
    monthlyAppointments: 280,
    yearlyTrend: 'down',
    yearlyChange: 3.2,
  },
];

// Mock data for user roles distribution
const userRolesData = [
  { name: 'Barbers', value: 15, color: '#3b82f6' },
  { name: 'Cashiers', value: 5, color: '#10b981' },
  { name: 'General Admins', value: 3, color: '#f97316' },
  { name: 'Primary Admins', value: 1, color: '#8b5cf6' },
];

// Mock data for critical alerts
const criticalAlertsData = [
  { 
    id: 'alert1', 
    type: 'security', 
    title: 'Multiple failed login attempts', 
    description: 'Multiple failed login attempts detected for user admin@qubomanl.com from IP 203.45.67.89',
    timestamp: new Date(2025, 8, 14, 15, 23),
    severity: 'high',
  },
  { 
    id: 'alert2', 
    type: 'financial', 
    title: 'Unusual refund pattern detected', 
    description: 'Unusual number of refunds processed at BGC Branch in the last 24 hours',
    timestamp: new Date(2025, 8, 15, 9, 45),
    severity: 'medium',
  },
  { 
    id: 'alert3', 
    type: 'system', 
    title: 'Database backup failure', 
    description: 'Automatic database backup failed for the third consecutive day',
    timestamp: new Date(2025, 8, 15, 2, 30),
    severity: 'high',
  },
];

const PrimaryAdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('overview');
  
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalAppointments: 0,
    activeUsers: 0,
    criticalAlerts: 0,
  });

  useEffect(() => {
    // In a real app, fetch data from API
    // Simulate API call
    setTimeout(() => {
      setStats({
        totalRevenue: 1039000,
        totalAppointments: 950,
        activeUsers: 24,
        criticalAlerts: criticalAlertsData.length,
      });
      
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filter data based on selected branch
  const getFilteredData = () => {
    if (selectedBranch === 'all') {
      return {
        revenue: revenueData,
      };
    }
    
    // In a real app, this would filter data by branch
    // For demo, just return the same data
    return {
      revenue: revenueData,
    };
  };

  const filteredData = getFilteredData();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-heading font-bold">Primary Admin Dashboard</h1>
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
                    Year-to-Date Revenue
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
                    Year-to-Date Appointments
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
                    Active Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-accent mr-2" />
                    <span className="text-2xl font-bold">{stats.activeUsers}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Critical Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                    <span className="text-2xl font-bold">{stats.criticalAlerts}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="overview" onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="overview">Financial Overview</TabsTrigger>
                <TabsTrigger value="users">User Management</TabsTrigger>
                <TabsTrigger value="alerts">System Alerts</TabsTrigger>
              </TabsList>
              
              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                {/* Revenue Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Analytics</CardTitle>
                    <CardDescription>
                      Year-to-date revenue breakdown by month
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

                {/* Branches Overview */}
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
                            <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                            <p className="text-xl font-bold">₱{branch.monthlyRevenue.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Appointments</p>
                            <p className="text-xl font-bold">{branch.monthlyAppointments}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <p className="text-sm text-muted-foreground mr-2">Yearly Trend:</p>
                          <div className="flex items-center">
                            {branch.yearlyTrend === 'up' ? (
                              <>
                                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                                <span className="text-green-500">+{branch.yearlyChange}%</span>
                              </>
                            ) : (
                              <>
                                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                                <span className="text-red-500">-{branch.yearlyChange}%</span>
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
                          onClick={() => navigate(`/dashboard/branches/${branch.id}`)}
                        >
                          View Details
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>

                {/* Quick Actions */}
                <div className="space-y-4">
                  <h2 className="text-xl font-heading font-semibold">Quick Actions</h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Card className="hover:border-accent/50 transition-colors cursor-pointer" onClick={() => navigate('/dashboard/users')}>
                      <CardContent className="p-6 flex flex-col items-center text-center">
                        <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mb-3">
                          <UserCog className="h-6 w-6 text-accent" />
                        </div>
                        <h3 className="font-medium">User Management</h3>
                        <p className="text-sm text-muted-foreground mt-1">Manage user accounts and roles</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="hover:border-accent/50 transition-colors cursor-pointer" onClick={() => navigate('/dashboard/settings')}>
                      <CardContent className="p-6 flex flex-col items-center text-center">
                        <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mb-3">
                          <Settings className="h-6 w-6 text-accent" />
                        </div>
                        <h3 className="font-medium">System Settings</h3>
                        <p className="text-sm text-muted-foreground mt-1">Configure system-wide settings</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="hover:border-accent/50 transition-colors cursor-pointer" onClick={() => navigate('/dashboard/review-requests')}>
                      <CardContent className="p-6 flex flex-col items-center text-center">
                        <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mb-3">
                          <Shield className="h-6 w-6 text-accent" />
                        </div>
                        <h3 className="font-medium">Security</h3>
                        <p className="text-sm text-muted-foreground mt-1">Review security logs and settings</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
              
              {/* Users Tab */}
              <TabsContent value="users" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>User Role Distribution</CardTitle>
                    <CardDescription>
                      Breakdown of user roles across the system
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={userRolesData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {userRolesData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value: number) => [`${value} users`, 'Count']} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => navigate('/dashboard/users')}
                    >
                      <UserCog className="h-4 w-4 mr-2" />
                      Manage Users
                    </Button>
                  </CardFooter>
                </Card>

                {/* Recent User Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent User Activity</CardTitle>
                    <CardDescription>
                      Latest user actions in the system
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* This would be populated with actual user activity data */}
                      <div className="p-4 border border-border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                              <Users className="h-4 w-4 text-blue-500" />
                            </div>
                            <div>
                              <p className="font-medium">New user created</p>
                              <p className="text-sm text-muted-foreground">James Wilson (Barber) was added to the system</p>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">2 hours ago</p>
                        </div>
                      </div>
                      
                      <div className="p-4 border border-border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center mr-3">
                              <Settings className="h-4 w-4 text-amber-500" />
                            </div>
                            <div>
                              <p className="font-medium">Role changed</p>
                              <p className="text-sm text-muted-foreground">Mike Smith was promoted from Junior to Senior Barber</p>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">Yesterday</p>
                        </div>
                      </div>
                      
                      <div className="p-4 border border-border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center mr-3">
                              <X className="h-4 w-4 text-red-500" />
                            </div>
                            <div>
                              <p className="font-medium">User deactivated</p>
                              <p className="text-sm text-muted-foreground">Sarah Johnson (Cashier) was deactivated</p>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">2 days ago</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Alerts Tab */}
              <TabsContent value="alerts" className="space-y-6">
                {/* Critical Alerts */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center">
                        <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
                        Critical Alerts
                      </CardTitle>
                      <CardDescription>
                        Issues requiring immediate attention
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="bg-red-500/20 text-red-500 border-red-500/50">
                      {criticalAlertsData.length} Alerts
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {criticalAlertsData.map((alert) => (
                        <div 
                          key={alert.id} 
                          className="p-4 border border-border rounded-lg hover:border-red-500/50 transition-colors"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <div>
                              <h3 className="font-medium flex items-center">
                                {alert.type === 'security' && (
                                  <>
                                    <Shield className="h-4 w-4 mr-2 text-red-500" />
                                    Security Alert
                                  </>
                                )}
                                {alert.type === 'financial' && (
                                  <>
                                    <DollarSign className="h-4 w-4 mr-2 text-amber-500" />
                                    Financial Alert
                                  </>
                                )}
                                {alert.type === 'system' && (
                                  <>
                                    <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
                                    System Alert
                                  </>
                                )}
                                <span className="ml-2">{alert.title}</span>
                              </h3>
                              <p className="text-sm text-muted-foreground mt-1">
                                {alert.description}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {format(alert.timestamp, 'MMM d, yyyy h:mm a')}
                              </p>
                            </div>
                            <Badge variant={
                              alert.severity === 'high' ? 'destructive' : 'outline'
                            } className={
                              alert.severity === 'high' 
                                ? '' 
                                : 'bg-amber-500/20 text-amber-500 border-amber-500/50'
                            }>
                              {alert.severity === 'high' ? 'High Priority' : 'Medium Priority'}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* System Health */}
                <Card>
                  <CardHeader>
                    <CardTitle>System Health</CardTitle>
                    <CardDescription>
                      Current status of system components
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-green-500 mr-3"></div>
                          <span>Database</span>
                        </div>
                        <Badge variant="outline" className="bg-green-500/20 text-green-500 border-green-500/50">
                          Operational
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-green-500 mr-3"></div>
                          <span>API Services</span>
                        </div>
                        <Badge variant="outline" className="bg-green-500/20 text-green-500 border-green-500/50">
                          Operational
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-amber-500 mr-3"></div>
                          <span>Backup System</span>
                        </div>
                        <Badge variant="outline" className="bg-amber-500/20 text-amber-500 border-amber-500/50">
                          Degraded
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-green-500 mr-3"></div>
                          <span>Payment Processing</span>
                        </div>
                        <Badge variant="outline" className="bg-green-500/20 text-green-500 border-green-500/50">
                          Operational
                        </Badge>
                      </div>
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

export default PrimaryAdminDashboard;
