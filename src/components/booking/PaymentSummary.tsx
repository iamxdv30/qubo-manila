import { useBooking } from '@/hooks/useBooking';
import { format } from 'date-fns';
import { Scissors, Calendar, Clock, User, CreditCard } from 'lucide-react';

interface PaymentSummaryProps {
  onNext: () => void;
}

const PaymentSummary = ({ onNext }: PaymentSummaryProps) => {
  const { bookingState, getTotalPrice, getDownPaymentAmount } = useBooking();
  const { selectedBarber, selectedService, selectedDate, selectedTimeSlot, customerInfo } = bookingState;

  const totalPrice = getTotalPrice();
  const downPayment = getDownPaymentAmount();
  const remainingPayment = totalPrice - downPayment;

  // Format the time slot string (e.g., "09:00-09:30")
  const formatTimeSlot = (timeSlot: string | null) => {
    if (!timeSlot) return '';
    const [start, end] = timeSlot.split('-');
    return `${start} - ${end}`;
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-heading font-bold">Payment Summary</h2>
        <p className="text-muted-foreground mt-2">
          Review your booking details and payment information
        </p>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        {/* Booking Details */}
        <div className="p-6">
          <h3 className="font-heading font-semibold mb-4">Booking Details</h3>
          
          <div className="space-y-4">
            {/* Barber */}
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                <Scissors className="h-5 w-5 text-accent" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-muted-foreground">Barber</p>
                <div className="flex items-center">
                  <img 
                    src={selectedBarber?.profileImage} 
                    alt={selectedBarber?.name} 
                    className="h-6 w-6 rounded-full object-cover mr-2"
                  />
                  <p className="font-medium">{selectedBarber?.name}</p>
                </div>
              </div>
            </div>
            
            {/* Service */}
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                <Scissors className="h-5 w-5 text-accent" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-muted-foreground">Service</p>
                <p className="font-medium">{selectedService?.name}</p>
                <p className="text-sm text-muted-foreground">{selectedService?.duration} minutes</p>
              </div>
            </div>
            
            {/* Date & Time */}
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                <Calendar className="h-5 w-5 text-accent" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-muted-foreground">Date & Time</p>
                <p className="font-medium">
                  {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : ''}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatTimeSlot(selectedTimeSlot)}
                </p>
              </div>
            </div>
            
            {/* Customer */}
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                <User className="h-5 w-5 text-accent" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-muted-foreground">Customer</p>
                <p className="font-medium">{customerInfo?.name}</p>
                <p className="text-sm text-muted-foreground">{customerInfo?.email}</p>
                <p className="text-sm text-muted-foreground">{customerInfo?.phone}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Payment Details */}
        <div className="p-6 bg-muted/30 border-t border-border">
          <h3 className="font-heading font-semibold mb-4">Payment Details</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <p className="text-muted-foreground">Service Price</p>
              <p className="font-medium">₱{totalPrice.toFixed(2)}</p>
            </div>
            
            <div className="flex justify-between">
              <p className="text-muted-foreground">Down Payment (30%)</p>
              <p className="font-medium">₱{downPayment.toFixed(2)}</p>
            </div>
            
            <div className="border-t border-border my-2 pt-2">
              <div className="flex justify-between">
                <p className="font-medium">To Pay Now</p>
                <p className="font-semibold text-accent">₱{downPayment.toFixed(2)}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-muted-foreground">Remaining (to pay at shop)</p>
                <p className="text-sm font-medium">₱{remainingPayment.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-6 text-center">
        <button
          className="px-6 py-2 bg-accent text-accent-foreground rounded-md font-medium hover:bg-accent/90 transition-colors"
          onClick={onNext}
        >
          <CreditCard className="h-4 w-4 mr-2 inline" />
          Proceed to Payment
        </button>
      </div>
    </div>
  );
};

export default PaymentSummary;
