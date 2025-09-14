import { useState, useEffect } from 'react';
import { 
  Save, 
  Loader2, 
  Settings, 
  Clock, 
  Calendar, 
  DollarSign, 
  Mail,
  Shield,
  Database,
  Cloud,
  AlertTriangle,
  Check,
  X
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

interface SystemConfig {
  businessName: string;
  businessEmail: string;
  businessPhone: string;
  businessAddress: string;
  businessLogo: string;
  
  // Booking settings
  minAdvanceBookingDays: number;
  maxAdvanceBookingDays: number;
  defaultAppointmentDuration: number;
  allowSameTimeBookings: boolean;
  requireDownPayment: boolean;
  downPaymentPercentage: number;
  
  // Email settings
  emailNotifications: boolean;
  bookingConfirmationTemplate: string;
  reminderTemplate: string;
  
  // Security settings
  requireEmailVerification: boolean;
  sessionTimeout: number;
  maxLoginAttempts: number;
  
  // Backup settings
  autoBackup: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
  backupTime: string;
  retentionDays: number;
}

const SystemSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  const [config, setConfig] = useState<SystemConfig>({
    businessName: 'QuboMNL',
    businessEmail: 'info@qubomanl.com',
    businessPhone: '+63 917 123 4567',
    businessAddress: '123 Main Street, Makati City, Metro Manila',
    businessLogo: '/path/to/logo.png',
    
    // Booking settings
    minAdvanceBookingDays: 1,
    maxAdvanceBookingDays: 30,
    defaultAppointmentDuration: 45,
    allowSameTimeBookings: false,
    requireDownPayment: true,
    downPaymentPercentage: 30,
    
    // Email settings
    emailNotifications: true,
    bookingConfirmationTemplate: 'Thank you for booking with QuboMNL! Your appointment is confirmed for {{date}} at {{time}} with {{barber}}.',
    reminderTemplate: 'Reminder: You have an appointment scheduled for {{date}} at {{time}} with {{barber}}.',
    
    // Security settings
    requireEmailVerification: true,
    sessionTimeout: 60,
    maxLoginAttempts: 5,
    
    // Backup settings
    autoBackup: true,
    backupFrequency: 'daily',
    backupTime: '02:00',
    retentionDays: 30,
  });

  useEffect(() => {
    // In a real app, fetch config from API
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setConfig(prev => ({ ...prev, [name]: value }));
    setHasUnsavedChanges(true);
  };

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConfig(prev => ({ ...prev, [name]: Number(value) }));
    setHasUnsavedChanges(true);
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setConfig(prev => ({ ...prev, [name]: checked }));
    setHasUnsavedChanges(true);
  };

  const handleSelectChange = (name: string, value: string) => {
    setConfig(prev => ({ ...prev, [name]: value }));
    setHasUnsavedChanges(true);
  };

  const handleSaveSettings = () => {
    setIsSaving(true);
    
    // In a real app, save to API
    setTimeout(() => {
      setIsSaving(false);
      setHasUnsavedChanges(false);
      
      toast({
        title: "Settings saved",
        description: "Your changes have been successfully saved.",
      });
    }, 1500);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-heading font-bold">System Settings</h1>
            <p className="text-muted-foreground">
              Configure system-wide settings and preferences
            </p>
          </div>
          
          <Button 
            onClick={handleSaveSettings}
            disabled={isSaving || !hasUnsavedChanges}
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
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
          </div>
        ) : (
          <Tabs defaultValue="general" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-5 w-full">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="booking">Booking</TabsTrigger>
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="backup">Backup</TabsTrigger>
            </TabsList>
            
            {/* General Settings */}
            <TabsContent value="general" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Business Information</CardTitle>
                  <CardDescription>
                    Basic information about your business
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input
                      id="businessName"
                      name="businessName"
                      value={config.businessName}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="businessEmail">Business Email</Label>
                      <Input
                        id="businessEmail"
                        name="businessEmail"
                        type="email"
                        value={config.businessEmail}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="businessPhone">Business Phone</Label>
                      <Input
                        id="businessPhone"
                        name="businessPhone"
                        value={config.businessPhone}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="businessAddress">Business Address</Label>
                    <Textarea
                      id="businessAddress"
                      name="businessAddress"
                      value={config.businessAddress}
                      onChange={handleInputChange}
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="businessLogo">Business Logo</Label>
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 border border-border rounded-md flex items-center justify-center overflow-hidden">
                        <img 
                          src="/placeholder.svg" 
                          alt="Logo preview" 
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <Button variant="outline">
                        Upload New Logo
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Booking Settings */}
            <TabsContent value="booking" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-accent" />
                    Appointment Settings
                  </CardTitle>
                  <CardDescription>
                    Configure how appointments are scheduled
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="minAdvanceBookingDays">Minimum Advance Booking (days)</Label>
                      <Input
                        id="minAdvanceBookingDays"
                        name="minAdvanceBookingDays"
                        type="number"
                        min={0}
                        value={config.minAdvanceBookingDays}
                        onChange={handleNumberInputChange}
                      />
                      <p className="text-xs text-muted-foreground">
                        Minimum number of days in advance a customer can book an appointment
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maxAdvanceBookingDays">Maximum Advance Booking (days)</Label>
                      <Input
                        id="maxAdvanceBookingDays"
                        name="maxAdvanceBookingDays"
                        type="number"
                        min={1}
                        value={config.maxAdvanceBookingDays}
                        onChange={handleNumberInputChange}
                      />
                      <p className="text-xs text-muted-foreground">
                        Maximum number of days in advance a customer can book an appointment
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="defaultAppointmentDuration">Default Appointment Duration (minutes)</Label>
                    <Select
                      value={config.defaultAppointmentDuration.toString()}
                      onValueChange={(value) => handleSelectChange('defaultAppointmentDuration', value)}
                    >
                      <SelectTrigger id="defaultAppointmentDuration">
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="45">45 minutes</SelectItem>
                        <SelectItem value="60">60 minutes</SelectItem>
                        <SelectItem value="90">90 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="allowSameTimeBookings"
                      checked={config.allowSameTimeBookings}
                      onCheckedChange={(checked) => handleSwitchChange('allowSameTimeBookings', checked)}
                    />
                    <Label htmlFor="allowSameTimeBookings">Allow multiple bookings at the same time slot</Label>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="h-5 w-5 mr-2 text-accent" />
                    Payment Settings
                  </CardTitle>
                  <CardDescription>
                    Configure payment requirements for bookings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="requireDownPayment"
                      checked={config.requireDownPayment}
                      onCheckedChange={(checked) => handleSwitchChange('requireDownPayment', checked)}
                    />
                    <Label htmlFor="requireDownPayment">Require down payment for bookings</Label>
                  </div>
                  
                  {config.requireDownPayment && (
                    <div className="space-y-2">
                      <Label htmlFor="downPaymentPercentage">Down Payment Percentage (%)</Label>
                      <Input
                        id="downPaymentPercentage"
                        name="downPaymentPercentage"
                        type="number"
                        min={1}
                        max={100}
                        value={config.downPaymentPercentage}
                        onChange={handleNumberInputChange}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Email Settings */}
            <TabsContent value="email" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Mail className="h-5 w-5 mr-2 text-accent" />
                    Email Notifications
                  </CardTitle>
                  <CardDescription>
                    Configure email notification settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="emailNotifications"
                      checked={config.emailNotifications}
                      onCheckedChange={(checked) => handleSwitchChange('emailNotifications', checked)}
                    />
                    <Label htmlFor="emailNotifications">Enable email notifications</Label>
                  </div>
                  
                  {config.emailNotifications && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="bookingConfirmationTemplate">Booking Confirmation Template</Label>
                        <Textarea
                          id="bookingConfirmationTemplate"
                          name="bookingConfirmationTemplate"
                          value={config.bookingConfirmationTemplate}
                          onChange={handleInputChange}
                          rows={4}
                        />
                        <p className="text-xs text-muted-foreground">
                          Available variables: &#123;&#123;date&#125;&#125;, &#123;&#123;time&#125;&#125;, &#123;&#123;barber&#125;&#125;, &#123;&#123;service&#125;&#125;, &#123;&#123;price&#125;&#125;
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="reminderTemplate">Appointment Reminder Template</Label>
                        <Textarea
                          id="reminderTemplate"
                          name="reminderTemplate"
                          value={config.reminderTemplate}
                          onChange={handleInputChange}
                          rows={4}
                        />
                        <p className="text-xs text-muted-foreground">
                          Available variables: &#123;&#123;date&#125;&#125;, &#123;&#123;time&#125;&#125;, &#123;&#123;barber&#125;&#125;, &#123;&#123;service&#125;&#125;, &#123;&#123;price&#125;&#125;
                        </p>
                      </div>
                      
                      <div className="bg-muted/30 p-4 rounded-lg">
                        <h3 className="font-medium mb-2">Test Email Notifications</h3>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            Send Test Confirmation
                          </Button>
                          <Button variant="outline" size="sm">
                            Send Test Reminder
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Security Settings */}
            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-accent" />
                    Security Settings
                  </CardTitle>
                  <CardDescription>
                    Configure security and authentication settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="requireEmailVerification"
                      checked={config.requireEmailVerification}
                      onCheckedChange={(checked) => handleSwitchChange('requireEmailVerification', checked)}
                    />
                    <Label htmlFor="requireEmailVerification">Require email verification for new accounts</Label>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                    <Input
                      id="sessionTimeout"
                      name="sessionTimeout"
                      type="number"
                      min={5}
                      value={config.sessionTimeout}
                      onChange={handleNumberInputChange}
                    />
                    <p className="text-xs text-muted-foreground">
                      Time of inactivity before a user is automatically logged out
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="maxLoginAttempts">Maximum Login Attempts</Label>
                    <Input
                      id="maxLoginAttempts"
                      name="maxLoginAttempts"
                      type="number"
                      min={1}
                      value={config.maxLoginAttempts}
                      onChange={handleNumberInputChange}
                    />
                    <p className="text-xs text-muted-foreground">
                      Number of failed login attempts before account is temporarily locked
                    </p>
                  </div>
                  
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Security Audit</h3>
                    <Button variant="outline">
                      Run Security Audit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Backup Settings */}
            <TabsContent value="backup" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Database className="h-5 w-5 mr-2 text-accent" />
                    Database Backup
                  </CardTitle>
                  <CardDescription>
                    Configure automated database backup settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="autoBackup"
                      checked={config.autoBackup}
                      onCheckedChange={(checked) => handleSwitchChange('autoBackup', checked)}
                    />
                    <Label htmlFor="autoBackup">Enable automated backups</Label>
                  </div>
                  
                  {config.autoBackup && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="backupFrequency">Backup Frequency</Label>
                        <Select
                          value={config.backupFrequency}
                          onValueChange={(value) => handleSelectChange('backupFrequency', value)}
                        >
                          <SelectTrigger id="backupFrequency">
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="backupTime">Backup Time</Label>
                        <Input
                          id="backupTime"
                          name="backupTime"
                          type="time"
                          value={config.backupTime}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="retentionDays">Retention Period (days)</Label>
                        <Input
                          id="retentionDays"
                          name="retentionDays"
                          type="number"
                          min={1}
                          value={config.retentionDays}
                          onChange={handleNumberInputChange}
                        />
                        <p className="text-xs text-muted-foreground">
                          Number of days to keep backups before they are automatically deleted
                        </p>
                      </div>
                    </>
                  )}
                  
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Manual Backup</h3>
                    <div className="flex items-center gap-2">
                      <Button variant="outline">
                        <Cloud className="h-4 w-4 mr-2" />
                        Create Backup Now
                      </Button>
                      <Button variant="outline">
                        View Backup History
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-amber-500">
                    <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
                    Danger Zone
                  </CardTitle>
                  <CardDescription>
                    Actions that can have destructive consequences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="border border-destructive/50 rounded-lg p-4">
                    <h3 className="font-medium mb-2 text-destructive">Reset System</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      This will reset all system settings to their default values. This action cannot be undone.
                    </p>
                    <Button variant="destructive">
                      Reset All Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SystemSettings;
