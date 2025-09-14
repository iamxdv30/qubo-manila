import { useState, useEffect } from 'react';
import { format, addDays, isBefore } from 'date-fns';
import { 
  Clock, 
  Calendar, 
  BadgeAlert, 
  DollarSign, 
  Send, 
  Loader2, 
  Check, 
  X, 
  AlertCircle 
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import { RequestStatus } from '@/types';

interface Request {
  id: string;
  type: 'pto' | 'sick' | 'price';
  startDate?: Date;
  endDate?: Date;
  reason: string;
  status: RequestStatus;
  createdAt: Date;
  updatedAt: Date;
  responseMessage?: string;
  serviceId?: string;
  serviceName?: string;
  currentPrice?: number;
  requestedPrice?: number;
}

const BarberRequests = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState('pto');
  const [requests, setRequests] = useState<Request[]>([]);
  
  // Form states
  const [ptoStartDate, setPtoStartDate] = useState<Date | undefined>(undefined);
  const [ptoEndDate, setPtoEndDate] = useState<Date | undefined>(undefined);
  const [ptoReason, setPtoReason] = useState('');
  const [sickStartDate, setSickStartDate] = useState<Date | undefined>(undefined);
  const [sickEndDate, setSickEndDate] = useState<Date | undefined>(undefined);
  const [sickReason, setSickReason] = useState('');
  const [priceServiceName, setPriceServiceName] = useState('');
  const [priceCurrentPrice, setPriceCurrentPrice] = useState<number | undefined>(undefined);
  const [priceRequestedPrice, setPriceRequestedPrice] = useState<number | undefined>(undefined);
  const [priceJustification, setPriceJustification] = useState('');
  
  // Loading states
  const [isSubmittingPto, setIsSubmittingPto] = useState(false);
  const [isSubmittingSick, setIsSubmittingSick] = useState(false);
  const [isSubmittingPrice, setIsSubmittingPrice] = useState(false);

  useEffect(() => {
    // In a real app, fetch requests from API
    // Simulate API call
    setTimeout(() => {
      const mockRequests: Request[] = [
        {
          id: '1',
          type: 'pto',
          startDate: addDays(new Date(), 10),
          endDate: addDays(new Date(), 15),
          reason: 'Family vacation',
          status: 'pending',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          type: 'sick',
          startDate: addDays(new Date(), -5),
          endDate: addDays(new Date(), -3),
          reason: 'Flu',
          status: 'approved',
          createdAt: addDays(new Date(), -7),
          updatedAt: addDays(new Date(), -6),
          responseMessage: 'Approved. Get well soon!',
        },
        {
          id: '3',
          type: 'price',
          serviceId: 's1',
          serviceName: 'Classic Haircut',
          currentPrice: 500,
          requestedPrice: 550,
          reason: 'Increased cost of supplies and additional training completed',
          status: 'denied',
          createdAt: addDays(new Date(), -15),
          updatedAt: addDays(new Date(), -12),
          responseMessage: 'Denied. Please resubmit after 3 months.',
        },
        {
          id: '4',
          type: 'pto',
          startDate: addDays(new Date(), -20),
          endDate: addDays(new Date(), -18),
          reason: 'Personal matters',
          status: 'approved',
          createdAt: addDays(new Date(), -25),
          updatedAt: addDays(new Date(), -22),
          responseMessage: 'Approved.',
        },
      ];
      
      setRequests(mockRequests);
    }, 500);
  }, []);

  const handlePtoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!ptoStartDate || !ptoEndDate || !ptoReason) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    if (isBefore(ptoEndDate, ptoStartDate)) {
      toast({
        title: "Invalid date range",
        description: "End date must be after start date.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmittingPto(true);
    
    // In a real app, submit to API
    // Simulate API call
    setTimeout(() => {
      const newRequest: Request = {
        id: `pto-${Date.now()}`,
        type: 'pto',
        startDate: ptoStartDate,
        endDate: ptoEndDate,
        reason: ptoReason,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      setRequests(prev => [newRequest, ...prev]);
      
      // Reset form
      setPtoStartDate(undefined);
      setPtoEndDate(undefined);
      setPtoReason('');
      
      setIsSubmittingPto(false);
      
      toast({
        title: "Request submitted",
        description: "Your PTO request has been submitted for approval.",
      });
    }, 1500);
  };

  const handleSickLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!sickStartDate || !sickEndDate || !sickReason) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    if (isBefore(sickEndDate, sickStartDate)) {
      toast({
        title: "Invalid date range",
        description: "End date must be after start date.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmittingSick(true);
    
    // In a real app, submit to API
    // Simulate API call
    setTimeout(() => {
      const newRequest: Request = {
        id: `sick-${Date.now()}`,
        type: 'sick',
        startDate: sickStartDate,
        endDate: sickEndDate,
        reason: sickReason,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      setRequests(prev => [newRequest, ...prev]);
      
      // Reset form
      setSickStartDate(undefined);
      setSickEndDate(undefined);
      setSickReason('');
      
      setIsSubmittingSick(false);
      
      toast({
        title: "Request submitted",
        description: "Your sick leave request has been submitted for approval.",
      });
    }, 1500);
  };

  const handlePriceIncreaseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!priceServiceName || !priceCurrentPrice || !priceRequestedPrice || !priceJustification) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    if (priceRequestedPrice <= priceCurrentPrice) {
      toast({
        title: "Invalid price",
        description: "Requested price must be higher than current price.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmittingPrice(true);
    
    // In a real app, submit to API
    // Simulate API call
    setTimeout(() => {
      const newRequest: Request = {
        id: `price-${Date.now()}`,
        type: 'price',
        serviceName: priceServiceName,
        currentPrice: priceCurrentPrice,
        requestedPrice: priceRequestedPrice,
        reason: priceJustification,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      setRequests(prev => [newRequest, ...prev]);
      
      // Reset form
      setPriceServiceName('');
      setPriceCurrentPrice(undefined);
      setPriceRequestedPrice(undefined);
      setPriceJustification('');
      
      setIsSubmittingPrice(false);
      
      toast({
        title: "Request submitted",
        description: "Your price increase request has been submitted for approval.",
      });
    }, 1500);
  };

  const getStatusBadge = (status: RequestStatus) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-amber-500/20 text-amber-500 border-amber-500/50">Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-500/20 text-green-500 border-green-500/50">Approved</Badge>;
      case 'denied':
        return <Badge variant="outline" className="bg-red-500/20 text-red-500 border-red-500/50">Denied</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const filteredRequests = requests.filter(request => {
    if (activeTab === 'history') return true;
    return request.type === activeTab;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-heading font-bold">Requests</h1>
          <p className="text-muted-foreground">
            Submit and manage your time off and price increase requests
          </p>
        </div>

        <Tabs defaultValue="pto" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="pto">PTO Request</TabsTrigger>
            <TabsTrigger value="sick">Sick Leave</TabsTrigger>
            <TabsTrigger value="price">Price Increase</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          
          {/* PTO Request Form */}
          <TabsContent value="pto">
            <Card>
              <CardHeader>
                <CardTitle>Paid Time Off Request</CardTitle>
                <CardDescription>
                  Request time off for vacations, personal days, or other planned absences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePtoSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Start Date</Label>
                      <div className="border border-border rounded-md p-2">
                        <CalendarComponent
                          mode="single"
                          selected={ptoStartDate}
                          onSelect={setPtoStartDate}
                          disabled={(date) => isBefore(date, new Date())}
                          className="mx-auto"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>End Date</Label>
                      <div className="border border-border rounded-md p-2">
                        <CalendarComponent
                          mode="single"
                          selected={ptoEndDate}
                          onSelect={setPtoEndDate}
                          disabled={(date) => isBefore(date, ptoStartDate || new Date())}
                          className="mx-auto"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="pto-reason">Reason for Request</Label>
                    <Textarea
                      id="pto-reason"
                      placeholder="Please provide a reason for your time off request"
                      value={ptoReason}
                      onChange={(e) => setPtoReason(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>
                  
                  <div className="bg-muted/30 border border-border rounded-lg p-4 text-sm">
                    <h3 className="font-medium mb-2 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2 text-amber-500" />
                      Important Notes
                    </h3>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Requests must be submitted at least 7 days in advance</li>
                      <li>Maximum consecutive days: 14</li>
                      <li>Approval is subject to staffing needs and manager discretion</li>
                      <li>You will be notified once your request is reviewed</li>
                    </ul>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button 
                  type="submit" 
                  onClick={handlePtoSubmit}
                  disabled={isSubmittingPto || !ptoStartDate || !ptoEndDate || !ptoReason}
                >
                  {isSubmittingPto ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Submit Request
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Sick Leave Form */}
          <TabsContent value="sick">
            <Card>
              <CardHeader>
                <CardTitle>Sick Leave Request</CardTitle>
                <CardDescription>
                  Report illness or medical appointments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSickLeaveSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Start Date</Label>
                      <div className="border border-border rounded-md p-2">
                        <CalendarComponent
                          mode="single"
                          selected={sickStartDate}
                          onSelect={setSickStartDate}
                          className="mx-auto"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>End Date</Label>
                      <div className="border border-border rounded-md p-2">
                        <CalendarComponent
                          mode="single"
                          selected={sickEndDate}
                          onSelect={setSickEndDate}
                          disabled={(date) => isBefore(date, sickStartDate || new Date())}
                          className="mx-auto"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="sick-reason">Reason</Label>
                    <Textarea
                      id="sick-reason"
                      placeholder="Please provide a brief description of your illness or medical situation"
                      value={sickReason}
                      onChange={(e) => setSickReason(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>
                  
                  <div className="bg-muted/30 border border-border rounded-lg p-4 text-sm">
                    <h3 className="font-medium mb-2 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2 text-amber-500" />
                      Important Notes
                    </h3>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Submit as soon as possible when you know you'll be absent</li>
                      <li>A doctor's note may be required for absences longer than 3 days</li>
                      <li>Your privacy will be respected regarding medical information</li>
                    </ul>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button 
                  type="submit" 
                  onClick={handleSickLeaveSubmit}
                  disabled={isSubmittingSick || !sickStartDate || !sickEndDate || !sickReason}
                >
                  {isSubmittingSick ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Submit Request
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Price Increase Form */}
          <TabsContent value="price">
            <Card>
              <CardHeader>
                <CardTitle>Service Price Increase Request</CardTitle>
                <CardDescription>
                  Request to increase the price of a service you offer
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePriceIncreaseSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="service-name">Service Name</Label>
                      <Input
                        id="service-name"
                        placeholder="e.g. Classic Haircut"
                        value={priceServiceName}
                        onChange={(e) => setPriceServiceName(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="current-price">Current Price (₱)</Label>
                        <Input
                          id="current-price"
                          type="number"
                          placeholder="e.g. 500"
                          value={priceCurrentPrice || ''}
                          onChange={(e) => setPriceCurrentPrice(Number(e.target.value))}
                          min={0}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="requested-price">Requested Price (₱)</Label>
                        <Input
                          id="requested-price"
                          type="number"
                          placeholder="e.g. 550"
                          value={priceRequestedPrice || ''}
                          onChange={(e) => setPriceRequestedPrice(Number(e.target.value))}
                          min={0}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="price-justification">Justification</Label>
                    <Textarea
                      id="price-justification"
                      placeholder="Please provide a detailed justification for the price increase"
                      value={priceJustification}
                      onChange={(e) => setPriceJustification(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>
                  
                  <div className="bg-muted/30 border border-border rounded-lg p-4 text-sm">
                    <h3 className="font-medium mb-2 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2 text-amber-500" />
                      Important Notes
                    </h3>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Price increases are limited to once every 3 months per service</li>
                      <li>Maximum increase is typically 20% of current price</li>
                      <li>Strong justification is required (e.g., new skills, increased costs)</li>
                      <li>Approval is at management's discretion</li>
                    </ul>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button 
                  type="submit" 
                  onClick={handlePriceIncreaseSubmit}
                  disabled={isSubmittingPrice || !priceServiceName || !priceCurrentPrice || !priceRequestedPrice || !priceJustification}
                >
                  {isSubmittingPrice ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Submit Request
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Request History */}
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Request History</CardTitle>
                <CardDescription>
                  View all your previous and pending requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filteredRequests.length > 0 ? (
                  <div className="space-y-4">
                    {filteredRequests.map((request) => (
                      <div 
                        key={request.id} 
                        className="border border-border rounded-lg p-4 hover:border-accent/50 transition-colors"
                      >
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div>
                            <div className="flex items-center mb-2">
                              {request.type === 'pto' && <Calendar className="h-5 w-5 text-blue-500 mr-2" />}
                              {request.type === 'sick' && <BadgeAlert className="h-5 w-5 text-red-500 mr-2" />}
                              {request.type === 'price' && <DollarSign className="h-5 w-5 text-green-500 mr-2" />}
                              
                              <h3 className="font-medium">
                                {request.type === 'pto' && 'PTO Request'}
                                {request.type === 'sick' && 'Sick Leave'}
                                {request.type === 'price' && `Price Increase: ${request.serviceName}`}
                              </h3>
                              
                              <span className="mx-2">•</span>
                              {getStatusBadge(request.status)}
                            </div>
                            
                            {(request.type === 'pto' || request.type === 'sick') && request.startDate && request.endDate && (
                              <p className="text-sm text-muted-foreground flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                {format(request.startDate, 'MMM d, yyyy')} - {format(request.endDate, 'MMM d, yyyy')}
                              </p>
                            )}
                            
                            {request.type === 'price' && (
                              <p className="text-sm text-muted-foreground flex items-center">
                                <DollarSign className="h-4 w-4 mr-1" />
                                ₱{request.currentPrice} → ₱{request.requestedPrice}
                              </p>
                            )}
                            
                            <p className="text-sm mt-2">{request.reason}</p>
                            
                            {request.responseMessage && (
                              <div className="mt-2 p-2 bg-muted/50 rounded-md text-sm">
                                <p className="font-medium">Response:</p>
                                <p className="text-muted-foreground">{request.responseMessage}</p>
                              </div>
                            )}
                          </div>
                          
                          <div className="text-sm text-muted-foreground">
                            Submitted: {format(request.createdAt, 'MMM d, yyyy')}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-medium text-lg mb-2">No Requests</h3>
                    <p className="text-muted-foreground">
                      You haven't submitted any requests yet
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default BarberRequests;
