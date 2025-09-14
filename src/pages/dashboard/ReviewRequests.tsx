import { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { 
  Calendar, 
  Clock, 
  DollarSign, 
  Filter, 
  Check, 
  X, 
  AlertTriangle,
  MessageSquare,
  Loader2,
  FileText
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { RequestStatus } from '@/types';

// Types for requests
interface BaseRequest {
  id: string;
  type: 'pto' | 'sick' | 'price';
  barberId: string;
  barberName: string;
  status: RequestStatus;
  reason: string;
  createdAt: string;
  updatedAt: string;
  responseMessage?: string;
}

interface PTORequest extends BaseRequest {
  type: 'pto';
  startDate: string;
  endDate: string;
}

interface SickRequest extends BaseRequest {
  type: 'sick';
  startDate: string;
  endDate: string;
}

interface PriceRequest extends BaseRequest {
  type: 'price';
  serviceId: string;
  serviceName: string;
  currentPrice: number;
  requestedPrice: number;
}

type Request = PTORequest | SickRequest | PriceRequest;

// Mock data for requests
const mockRequests: Request[] = [
  {
    id: 'req1',
    type: 'pto',
    barberId: 'b1',
    barberName: 'John Doe',
    status: 'pending',
    reason: 'Family vacation',
    startDate: '2025-09-20',
    endDate: '2025-09-25',
    createdAt: '2025-09-10T10:30:00Z',
    updatedAt: '2025-09-10T10:30:00Z',
  },
  {
    id: 'req2',
    type: 'sick',
    barberId: 'b2',
    barberName: 'Mike Smith',
    status: 'pending',
    reason: 'Flu symptoms',
    startDate: '2025-09-16',
    endDate: '2025-09-17',
    createdAt: '2025-09-14T08:15:00Z',
    updatedAt: '2025-09-14T08:15:00Z',
  },
  {
    id: 'req3',
    type: 'price',
    barberId: 'b3',
    barberName: 'David Chen',
    status: 'pending',
    reason: 'Increased cost of supplies and additional training completed',
    serviceId: 's1',
    serviceName: 'Classic Haircut',
    currentPrice: 500,
    requestedPrice: 550,
    createdAt: '2025-09-12T14:45:00Z',
    updatedAt: '2025-09-12T14:45:00Z',
  },
  {
    id: 'req4',
    type: 'pto',
    barberId: 'b4',
    barberName: 'Alex Johnson',
    status: 'pending',
    reason: 'Personal matters',
    startDate: '2025-09-18',
    endDate: '2025-09-19',
    createdAt: '2025-09-13T09:20:00Z',
    updatedAt: '2025-09-13T09:20:00Z',
  },
  {
    id: 'req5',
    type: 'price',
    barberId: 'b5',
    barberName: 'Carlos Rodriguez',
    status: 'pending',
    reason: 'Additional training completed in advanced coloring techniques',
    serviceId: 's10',
    serviceName: 'Hair Coloring',
    currentPrice: 800,
    requestedPrice: 900,
    createdAt: '2025-09-11T16:30:00Z',
    updatedAt: '2025-09-11T16:30:00Z',
  },
  {
    id: 'req6',
    type: 'sick',
    barberId: 'b1',
    barberName: 'John Doe',
    status: 'approved',
    reason: 'COVID symptoms',
    startDate: '2025-09-05',
    endDate: '2025-09-07',
    createdAt: '2025-09-04T18:10:00Z',
    updatedAt: '2025-09-04T19:30:00Z',
    responseMessage: 'Approved. Get well soon!',
  },
  {
    id: 'req7',
    type: 'price',
    barberId: 'b2',
    barberName: 'Mike Smith',
    status: 'denied',
    reason: 'Market rate adjustment',
    serviceId: 's3',
    serviceName: 'Fade Haircut',
    currentPrice: 400,
    requestedPrice: 500,
    createdAt: '2025-09-02T11:05:00Z',
    updatedAt: '2025-09-03T14:20:00Z',
    responseMessage: 'Denied. The requested increase is too high for current market conditions.',
  },
];

const ReviewRequests = () => {
  const { user } = useAuth();
  
  const [requests, setRequests] = useState<Request[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<Request[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'pto' | 'sick' | 'price'>('all');
  const [statusFilter, setStatusFilter] = useState<RequestStatus | 'all'>('pending');
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isDenyDialogOpen, setIsDenyDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [responseMessage, setResponseMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // In a real app, fetch requests from API
    // Simulate API call
    setTimeout(() => {
      setRequests(mockRequests);
      setFilteredRequests(mockRequests.filter(req => req.status === 'pending'));
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (!requests.length) return;
    
    let result = [...requests];
    
    // Apply tab filter
    if (activeTab !== 'all') {
      result = result.filter(req => req.type === activeTab);
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(req => req.status === statusFilter);
    }
    
    // Sort by creation date (newest first)
    result.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    setFilteredRequests(result);
  }, [requests, activeTab, statusFilter]);

  const handleApproveRequest = (request: Request) => {
    setSelectedRequest(request);
    setResponseMessage(
      request.type === 'pto' ? 'Approved. Enjoy your time off!' : 
      request.type === 'sick' ? 'Approved. Get well soon!' : 
      'Approved. Price increase will take effect immediately.'
    );
    setIsApproveDialogOpen(true);
  };

  const handleDenyRequest = (request: Request) => {
    setSelectedRequest(request);
    setResponseMessage('');
    setIsDenyDialogOpen(true);
  };

  const handleConfirmApprove = () => {
    if (!selectedRequest) return;
    
    setIsProcessing(true);
    
    // In a real app, update via API
    setTimeout(() => {
      setRequests(prev => 
        prev.map(req => 
          req.id === selectedRequest.id 
            ? { 
                ...req, 
                status: 'approved', 
                updatedAt: new Date().toISOString(),
                responseMessage,
              } 
            : req
        )
      );
      
      setIsProcessing(false);
      setIsApproveDialogOpen(false);
      setSelectedRequest(null);
      setResponseMessage('');
    }, 1000);
  };

  const handleConfirmDeny = () => {
    if (!selectedRequest) return;
    
    setIsProcessing(true);
    
    // In a real app, update via API
    setTimeout(() => {
      setRequests(prev => 
        prev.map(req => 
          req.id === selectedRequest.id 
            ? { 
                ...req, 
                status: 'denied', 
                updatedAt: new Date().toISOString(),
                responseMessage,
              } 
            : req
        )
      );
      
      setIsProcessing(false);
      setIsDenyDialogOpen(false);
      setSelectedRequest(null);
      setResponseMessage('');
    }, 1000);
  };

  const getRequestTypeBadge = (type: 'pto' | 'sick' | 'price') => {
    switch (type) {
      case 'pto':
        return <Badge variant="outline" className="bg-blue-500/20 text-blue-500 border-blue-500/50">PTO Request</Badge>;
      case 'sick':
        return <Badge variant="outline" className="bg-amber-500/20 text-amber-500 border-amber-500/50">Sick Leave</Badge>;
      case 'price':
        return <Badge variant="outline" className="bg-green-500/20 text-green-500 border-green-500/50">Price Increase</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getStatusBadge = (status: RequestStatus) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-blue-500/20 text-blue-500 border-blue-500/50">Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-500/20 text-green-500 border-green-500/50">Approved</Badge>;
      case 'denied':
        return <Badge variant="outline" className="bg-red-500/20 text-red-500 border-red-500/50">Denied</Badge>;
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
          onValueChange={(value) => setStatusFilter(value as RequestStatus | 'all')}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="denied">Denied</SelectItem>
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
            <h1 className="text-2xl font-heading font-bold">Review Requests</h1>
            <p className="text-muted-foreground">
              Review and respond to barber requests
            </p>
          </div>
          
          <div className="flex items-center gap-2">
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
                    Filter requests by status
                  </SheetDescription>
                </SheetHeader>
                <div className="py-6">
                  {renderFilters()}
                </div>
              </SheetContent>
            </Sheet>
            
            <div className="hidden md:block">
              {renderFilters()}
            </div>
          </div>
        </div>

        <Tabs defaultValue="all" onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="all">All Requests</TabsTrigger>
            <TabsTrigger value="pto">PTO</TabsTrigger>
            <TabsTrigger value="sick">Sick Leave</TabsTrigger>
            <TabsTrigger value="price">Price Increase</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Requests List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
          </div>
        ) : filteredRequests.length > 0 ? (
          <div className="space-y-4">
            {filteredRequests.map((request) => (
              <Card key={request.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {getRequestTypeBadge(request.type)}
                        {getStatusBadge(request.status)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Submitted: {format(parseISO(request.createdAt), 'MMM d, yyyy h:mm a')}
                      </div>
                    </div>
                    
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-1">
                        <h3 className="font-medium">{request.barberName}</h3>
                        
                        {request.type === 'pto' && (
                          <div className="flex items-center mt-2 text-sm">
                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>
                              {format(parseISO(request.startDate), 'MMM d, yyyy')} - {format(parseISO(request.endDate), 'MMM d, yyyy')}
                            </span>
                          </div>
                        )}
                        
                        {request.type === 'sick' && (
                          <div className="flex items-center mt-2 text-sm">
                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>
                              {format(parseISO(request.startDate), 'MMM d, yyyy')} - {format(parseISO(request.endDate), 'MMM d, yyyy')}
                            </span>
                          </div>
                        )}
                        
                        {request.type === 'price' && (
                          <div className="flex items-center mt-2 text-sm">
                            <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>
                              {request.serviceName}: ₱{request.currentPrice} → ₱{request.requestedPrice} 
                              ({Math.round((request.requestedPrice - request.currentPrice) / request.currentPrice * 100)}% increase)
                            </span>
                          </div>
                        )}
                        
                        <div className="mt-3 bg-muted/30 p-3 rounded-md">
                          <p className="text-sm font-medium mb-1">Reason:</p>
                          <p className="text-sm text-muted-foreground">{request.reason}</p>
                        </div>
                        
                        {request.responseMessage && (
                          <div className="mt-3 bg-accent/10 p-3 rounded-md">
                            <p className="text-sm font-medium mb-1">Response:</p>
                            <p className="text-sm text-muted-foreground">{request.responseMessage}</p>
                          </div>
                        )}
                      </div>
                      
                      {request.status === 'pending' && (
                        <div className="flex flex-row md:flex-col gap-2 justify-end">
                          <Button 
                            variant="outline" 
                            className="border-red-500/50 hover:bg-red-500/10 text-red-500"
                            onClick={() => handleDenyRequest(request)}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Deny
                          </Button>
                          <Button 
                            variant="outline" 
                            className="border-green-500/50 hover:bg-green-500/10 text-green-500"
                            onClick={() => handleApproveRequest(request)}
                          >
                            <Check className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium text-lg mb-2">No Requests Found</h3>
            <p className="text-muted-foreground">
              {activeTab !== 'all' 
                ? `There are no ${activeTab} requests with ${statusFilter} status` 
                : `There are no requests with ${statusFilter} status`}
            </p>
          </div>
        )}
      </div>

      {/* Approve Dialog */}
      <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Request</DialogTitle>
            <DialogDescription>
              You are about to approve this request. Please provide any additional comments.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedRequest && (
              <div className="space-y-4">
                <div className="bg-muted/30 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    {getRequestTypeBadge(selectedRequest.type)}
                    <span className="font-medium">{selectedRequest.barberName}</span>
                  </div>
                  
                  {selectedRequest.type === 'pto' && (
                    <p className="text-sm text-muted-foreground">
                      PTO: {format(parseISO(selectedRequest.startDate), 'MMM d, yyyy')} - {format(parseISO(selectedRequest.endDate), 'MMM d, yyyy')}
                    </p>
                  )}
                  
                  {selectedRequest.type === 'sick' && (
                    <p className="text-sm text-muted-foreground">
                      Sick Leave: {format(parseISO(selectedRequest.startDate), 'MMM d, yyyy')} - {format(parseISO(selectedRequest.endDate), 'MMM d, yyyy')}
                    </p>
                  )}
                  
                  {selectedRequest.type === 'price' && (
                    <p className="text-sm text-muted-foreground">
                      Price Increase: {selectedRequest.serviceName} (₱{selectedRequest.currentPrice} → ₱{selectedRequest.requestedPrice})
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="response">Response Message (Optional)</Label>
                  <Textarea
                    id="response"
                    value={responseMessage}
                    onChange={(e) => setResponseMessage(e.target.value)}
                    placeholder="Add any comments or instructions..."
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsApproveDialogOpen(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmApprove}
              disabled={isProcessing}
              className="bg-green-600 hover:bg-green-700"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Approve Request
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Deny Dialog */}
      <Dialog open={isDenyDialogOpen} onOpenChange={setIsDenyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deny Request</DialogTitle>
            <DialogDescription>
              You are about to deny this request. Please provide a reason for denial.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedRequest && (
              <div className="space-y-4">
                <div className="bg-muted/30 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    {getRequestTypeBadge(selectedRequest.type)}
                    <span className="font-medium">{selectedRequest.barberName}</span>
                  </div>
                  
                  {selectedRequest.type === 'pto' && (
                    <p className="text-sm text-muted-foreground">
                      PTO: {format(parseISO(selectedRequest.startDate), 'MMM d, yyyy')} - {format(parseISO(selectedRequest.endDate), 'MMM d, yyyy')}
                    </p>
                  )}
                  
                  {selectedRequest.type === 'sick' && (
                    <p className="text-sm text-muted-foreground">
                      Sick Leave: {format(parseISO(selectedRequest.startDate), 'MMM d, yyyy')} - {format(parseISO(selectedRequest.endDate), 'MMM d, yyyy')}
                    </p>
                  )}
                  
                  {selectedRequest.type === 'price' && (
                    <p className="text-sm text-muted-foreground">
                      Price Increase: {selectedRequest.serviceName} (₱{selectedRequest.currentPrice} → ₱{selectedRequest.requestedPrice})
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="denial-reason">Reason for Denial <span className="text-destructive">*</span></Label>
                  <Textarea
                    id="denial-reason"
                    value={responseMessage}
                    onChange={(e) => setResponseMessage(e.target.value)}
                    placeholder="Provide a reason for denying this request..."
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDenyDialogOpen(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleConfirmDeny}
              disabled={isProcessing || !responseMessage.trim()}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <X className="h-4 w-4 mr-2" />
                  Deny Request
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default ReviewRequests;
