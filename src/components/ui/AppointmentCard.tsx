import { useState } from 'react';
import { format } from 'date-fns';
import { 
  Calendar, 
  Clock, 
  User, 
  Scissors, 
  Phone, 
  Mail,
  CheckCircle,
  XCircle,
  AlertCircle,
  MoreVertical
} from 'lucide-react';
import { UserRole, BookingStatus } from '@/types';

import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface AppointmentCardProps {
  id: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  barberName: string;
  barberImage?: string;
  serviceName: string;
  servicePrice: number;
  date: Date;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  paymentStatus: 'not_paid' | 'partial' | 'paid';
  userRole: UserRole;
  onStatusChange?: (id: string, status: BookingStatus) => void;
  onViewDetails?: (id: string) => void;
}

const AppointmentCard = ({
  id,
  customerName,
  customerEmail,
  customerPhone,
  barberName,
  barberImage,
  serviceName,
  servicePrice,
  date,
  startTime,
  endTime,
  status,
  paymentStatus,
  userRole,
  onStatusChange,
  onViewDetails,
}: AppointmentCardProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{ action: BookingStatus; title: string } | null>(null);

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case 'confirmed':
        return 'bg-blue-500/20 text-blue-500 border-blue-500/50';
      case 'completed':
        return 'bg-green-500/20 text-green-500 border-green-500/50';
      case 'cancelled':
        return 'bg-red-500/20 text-red-500 border-red-500/50';
      case 'no_show':
        return 'bg-amber-500/20 text-amber-500 border-amber-500/50';
      default:
        return 'bg-gray-500/20 text-gray-500 border-gray-500/50';
    }
  };

  const getStatusLabel = (status: BookingStatus) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'confirmed':
        return 'Confirmed';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      case 'no_show':
        return 'No Show';
      default:
        return 'Unknown';
    }
  };

  const getPaymentStatusColor = (status: 'not_paid' | 'partial' | 'paid') => {
    switch (status) {
      case 'paid':
        return 'bg-green-500/20 text-green-500 border-green-500/50';
      case 'partial':
        return 'bg-amber-500/20 text-amber-500 border-amber-500/50';
      case 'not_paid':
        return 'bg-red-500/20 text-red-500 border-red-500/50';
      default:
        return 'bg-gray-500/20 text-gray-500 border-gray-500/50';
    }
  };

  const getPaymentStatusLabel = (status: 'not_paid' | 'partial' | 'paid') => {
    switch (status) {
      case 'paid':
        return 'Paid';
      case 'partial':
        return 'Partial';
      case 'not_paid':
        return 'Not Paid';
      default:
        return 'Unknown';
    }
  };

  const handleStatusChange = (newStatus: BookingStatus) => {
    let title = '';
    switch (newStatus) {
      case 'completed':
        title = 'Mark as Completed';
        break;
      case 'cancelled':
        title = 'Cancel Appointment';
        break;
      case 'no_show':
        title = 'Mark as No Show';
        break;
      default:
        title = 'Change Status';
    }

    setConfirmAction({ action: newStatus, title });
    setIsDialogOpen(true);
  };

  const confirmStatusChange = () => {
    if (confirmAction && onStatusChange) {
      onStatusChange(id, confirmAction.action);
    }
    setIsDialogOpen(false);
    setConfirmAction(null);
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center">
            {barberImage ? (
              <img 
                src={barberImage} 
                alt={barberName} 
                className="w-10 h-10 rounded-full object-cover mr-3"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center mr-3">
                <Scissors className="h-5 w-5 text-accent" />
              </div>
            )}
            <div>
              <h3 className="font-medium">{serviceName}</h3>
              <p className="text-sm text-muted-foreground">with {barberName}</p>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <Badge variant="outline" className={getStatusColor(status)}>
              {getStatusLabel(status)}
            </Badge>
            {userRole === 'cashier' || userRole === 'general_admin' || userRole === 'primary_admin' ? (
              <Badge variant="outline" className={`mt-1 ${getPaymentStatusColor(paymentStatus)}`}>
                {getPaymentStatusLabel(paymentStatus)}
              </Badge>
            ) : null}
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{format(date, 'MMMM d, yyyy')}</span>
          </div>
          <div className="flex items-center text-sm">
            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{startTime} - {endTime}</span>
          </div>
          <div className="flex items-center text-sm">
            <User className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{customerName}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Price</p>
            <p className="font-medium">₱{servicePrice.toFixed(2)}</p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              {onViewDetails && (
                <DropdownMenuItem onClick={() => onViewDetails(id)}>
                  View Details
                </DropdownMenuItem>
              )}
              
              {/* Status change options based on user role and current status */}
              {(userRole === 'barber' || userRole === 'general_admin' || userRole === 'primary_admin') && 
                status !== 'completed' && status !== 'cancelled' && (
                <DropdownMenuItem onClick={() => handleStatusChange('completed')}>
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  Mark as Completed
                </DropdownMenuItem>
              )}
              
              {(userRole === 'barber' || userRole === 'general_admin' || userRole === 'primary_admin') && 
                status !== 'no_show' && status !== 'cancelled' && status !== 'completed' && (
                <DropdownMenuItem onClick={() => handleStatusChange('no_show')}>
                  <AlertCircle className="h-4 w-4 mr-2 text-amber-500" />
                  Mark as No Show
                </DropdownMenuItem>
              )}
              
              {status !== 'cancelled' && status !== 'completed' && (
                <DropdownMenuItem onClick={() => handleStatusChange('cancelled')}>
                  <XCircle className="h-4 w-4 mr-2 text-red-500" />
                  Cancel Appointment
                </DropdownMenuItem>
              )}
              
              {/* Contact options */}
              {(userRole === 'barber' || userRole === 'cashier' || userRole === 'general_admin' || userRole === 'primary_admin') && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Contact Customer</DropdownMenuLabel>
                  
                  {customerPhone && (
                    <DropdownMenuItem asChild>
                      <a href={`tel:${customerPhone}`} className="flex items-center">
                        <Phone className="h-4 w-4 mr-2" />
                        Call
                      </a>
                    </DropdownMenuItem>
                  )}
                  
                  {customerEmail && (
                    <DropdownMenuItem asChild>
                      <a href={`mailto:${customerEmail}`} className="flex items-center">
                        <Mail className="h-4 w-4 mr-2" />
                        Email
                      </a>
                    </DropdownMenuItem>
                  )}
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{confirmAction?.title}</DialogTitle>
            <DialogDescription>
              {confirmAction?.action === 'completed' && 'Are you sure you want to mark this appointment as completed?'}
              {confirmAction?.action === 'cancelled' && 'Are you sure you want to cancel this appointment?'}
              {confirmAction?.action === 'no_show' && 'Are you sure you want to mark this customer as a no-show?'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant={confirmAction?.action === 'cancelled' ? 'destructive' : 'default'}
              onClick={confirmStatusChange}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AppointmentCard;
