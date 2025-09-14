import { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Clock, 
  Edit, 
  Save, 
  Loader2, 
  Lock,
  Camera
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Mock user data
interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  profileImage?: string;
  role: 'customer' | 'barber' | 'cashier' | 'general_admin' | 'primary_admin';
  createdAt: string;
}

// Mock appointment history
interface Appointment {
  id: string;
  date: string;
  time: string;
  barberName: string;
  serviceName: string;
  price: number;
  status: 'completed' | 'cancelled' | 'upcoming';
}

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  
  const [profile, setProfile] = useState<UserProfile>({
    id: '1',
    name: 'John Smith',
    email: 'john@example.com',
    phone: '+63 917 123 4567',
    address: '123 Main St, Makati City',
    profileImage: 'https://i.pravatar.cc/300?img=1',
    role: 'customer',
    createdAt: '2025-01-15T08:00:00Z',
  });
  
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    // In a real app, fetch user profile from API
    // Simulate API call
    setTimeout(() => {
      // Set form data from profile
      setFormData({
        name: profile.name,
        phone: profile.phone,
        address: profile.address,
      });
      
      // Mock appointment history
      const mockAppointments: Appointment[] = [
        {
          id: 'app1',
          date: '2025-09-10',
          time: '10:00 AM',
          barberName: 'John Doe',
          serviceName: 'Classic Haircut',
          price: 500,
          status: 'completed',
        },
        {
          id: 'app2',
          date: '2025-08-25',
          time: '2:30 PM',
          barberName: 'Mike Smith',
          serviceName: 'Beard Trim',
          price: 300,
          status: 'completed',
        },
        {
          id: 'app3',
          date: '2025-07-15',
          time: '11:15 AM',
          barberName: 'David Chen',
          serviceName: 'Hair & Beard Combo',
          price: 700,
          status: 'cancelled',
        },
        {
          id: 'app4',
          date: '2025-09-20',
          time: '3:00 PM',
          barberName: 'John Doe',
          serviceName: 'Classic Haircut',
          price: 500,
          status: 'upcoming',
        },
      ];
      
      setAppointments(mockAppointments);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = () => {
    setIsSaving(true);
    
    // In a real app, save to API
    setTimeout(() => {
      // Update profile with form data
      setProfile(prev => ({
        ...prev,
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
      }));
      
      setIsSaving(false);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    }, 1500);
  };

  const handleChangePassword = () => {
    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "New password and confirmation must match.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSaving(true);
    
    // In a real app, save to API
    setTimeout(() => {
      setIsSaving(false);
      setIsChangePasswordOpen(false);
      
      // Reset password fields
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      
      toast({
        title: "Password changed",
        description: "Your password has been successfully updated.",
      });
    }, 1500);
  };

  const getStatusBadge = (status: 'completed' | 'cancelled' | 'upcoming') => {
    switch (status) {
      case 'completed':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Completed</span>;
      case 'cancelled':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Cancelled</span>;
      case 'upcoming':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Upcoming</span>;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="container max-w-4xl py-8 mx-auto">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>
      
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      ) : (
        <Tabs defaultValue="profile" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="appointments">Appointment History</TabsTrigger>
          </TabsList>
          
          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>
                      Update your personal details and contact information
                    </CardDescription>
                  </div>
                  
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={profile.profileImage} alt={profile.name} />
                      <AvatarFallback>{getInitials(profile.name)}</AvatarFallback>
                    </Avatar>
                    <Button 
                      size="icon" 
                      variant="secondary" 
                      className="absolute bottom-0 right-0 rounded-full h-8 w-8"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">
                    Email address cannot be changed. Contact support for assistance.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter your address"
                  />
                </div>
                
                <div className="flex items-center gap-2 pt-4">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Member since {formatDate(profile.createdAt)}</span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Dialog open={isChangePasswordOpen} onOpenChange={setIsChangePasswordOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Lock className="h-4 w-4 mr-2" />
                      Change Password
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Change Password</DialogTitle>
                      <DialogDescription>
                        Enter your current password and a new password below.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input
                          id="currentPassword"
                          name="currentPassword"
                          type="password"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                          id="newPassword"
                          name="newPassword"
                          type="password"
                          value={passwordData.newPassword}
                          onChange={handlePasswordInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordInputChange}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button 
                        variant="outline" 
                        onClick={() => setIsChangePasswordOpen(false)}
                        disabled={isSaving}
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleChangePassword}
                        disabled={
                          isSaving || 
                          !passwordData.currentPassword || 
                          !passwordData.newPassword || 
                          !passwordData.confirmPassword
                        }
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Save Password
                          </>
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                
                <Button 
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Appointments Tab */}
          <TabsContent value="appointments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Appointment History</CardTitle>
                <CardDescription>
                  View your past and upcoming appointments
                </CardDescription>
              </CardHeader>
              <CardContent>
                {appointments.length > 0 ? (
                  <div className="space-y-6">
                    {/* Upcoming Appointments */}
                    <div>
                      <h3 className="font-medium mb-4">Upcoming Appointments</h3>
                      {appointments.filter(app => app.status === 'upcoming').length > 0 ? (
                        <div className="space-y-4">
                          {appointments
                            .filter(app => app.status === 'upcoming')
                            .map(appointment => (
                              <div 
                                key={appointment.id} 
                                className="flex flex-col md:flex-row md:items-center md:justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                              >
                                <div>
                                  <div className="flex items-center gap-2 mb-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium">{formatDate(appointment.date)}</span>
                                    <span className="mx-2">•</span>
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <span>{appointment.time}</span>
                                  </div>
                                  <p className="font-medium">{appointment.serviceName}</p>
                                  <p className="text-sm text-muted-foreground">with {appointment.barberName}</p>
                                </div>
                                <div className="mt-4 md:mt-0 flex flex-col items-end">
                                  <p className="font-medium">₱{appointment.price}</p>
                                  <div className="mt-2">
                                    {getStatusBadge(appointment.status)}
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">No upcoming appointments</p>
                      )}
                    </div>
                    
                    <Separator />
                    
                    {/* Past Appointments */}
                    <div>
                      <h3 className="font-medium mb-4">Past Appointments</h3>
                      <div className="space-y-4">
                        {appointments
                          .filter(app => app.status !== 'upcoming')
                          .map(appointment => (
                            <div 
                              key={appointment.id} 
                              className="flex flex-col md:flex-row md:items-center md:justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                            >
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <Calendar className="h-4 w-4 text-muted-foreground" />
                                  <span className="font-medium">{formatDate(appointment.date)}</span>
                                  <span className="mx-2">•</span>
                                  <Clock className="h-4 w-4 text-muted-foreground" />
                                  <span>{appointment.time}</span>
                                </div>
                                <p className="font-medium">{appointment.serviceName}</p>
                                <p className="text-sm text-muted-foreground">with {appointment.barberName}</p>
                              </div>
                              <div className="mt-4 md:mt-0 flex flex-col items-end">
                                <p className="font-medium">₱{appointment.price}</p>
                                <div className="mt-2">
                                  {getStatusBadge(appointment.status)}
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-medium text-lg mb-2">No Appointments</h3>
                    <p className="text-muted-foreground">
                      You haven't made any appointments yet
                    </p>
                    <Button className="mt-4">
                      Book an Appointment
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default Profile;
