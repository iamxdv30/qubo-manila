import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { CheckCircle, Calendar, Clock, Download, Copy } from 'lucide-react';
import { useBooking } from '@/hooks/useBooking';

const BookingConfirmation = () => {
  const navigate = useNavigate();
  const { bookingState, resetBooking } = useBooking();
  const { selectedBarber, selectedService, selectedDate, selectedTimeSlot, customerInfo } = bookingState;
  
  const [bookingId, setBookingId] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Generate a random booking ID
    const randomId = `QUBO-${Math.floor(100000 + Math.random() * 900000)}`;
    setBookingId(randomId);
    
    // In a real app, save the booking to the database
    console.log('Booking created:', {
      id: randomId,
      barber: selectedBarber?.name,
      service: selectedService?.name,
      date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '',
      timeSlot: selectedTimeSlot,
      customer: customerInfo,
    });
  }, []);

  // Format the time slot string (e.g., "09:00-09:30")
  const formatTimeSlot = (timeSlot: string | null) => {
    if (!timeSlot) return '';
    const [start, end] = timeSlot.split('-');
    return `${start} - ${end}`;
  };

  const handleCopyBookingId = () => {
    navigator.clipboard.writeText(bookingId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBackToHome = () => {
    resetBooking();
    navigate('/');
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <h2 className="text-2xl font-heading font-bold">Booking Confirmed!</h2>
        <p className="text-muted-foreground mt-2">
          Your appointment has been successfully booked
        </p>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
            <div>
              <p className="text-sm text-muted-foreground">Booking ID</p>
              <div className="flex items-center">
                <p className="font-mono font-medium">{bookingId}</p>
                <button
                  className="ml-2 p-1 hover:bg-accent/10 rounded-md transition-colors"
                  onClick={handleCopyBookingId}
                  aria-label="Copy booking ID"
                >
                  {copied ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
              </div>
            </div>
            <div className="mt-4 sm:mt-0">
              <button className="flex items-center text-sm text-accent hover:text-accent/80 transition-colors">
                <Download className="h-4 w-4 mr-1" />
                Download Receipt
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-4">Appointment Details</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-accent mr-3" />
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium">
                      {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-accent mr-3" />
                  <div>
                    <p className="text-sm text-muted-foreground">Time</p>
                    <p className="font-medium">{formatTimeSlot(selectedTimeSlot)}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-4">Service Details</h3>
              <div className="space-y-2">
                <p>
                  <span className="text-sm text-muted-foreground">Barber:</span>{' '}
                  <span className="font-medium">{selectedBarber?.name}</span>
                </p>
                <p>
                  <span className="text-sm text-muted-foreground">Service:</span>{' '}
                  <span className="font-medium">{selectedService?.name}</span>
                </p>
                <p>
                  <span className="text-sm text-muted-foreground">Duration:</span>{' '}
                  <span className="font-medium">{selectedService?.duration} minutes</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-muted/30 border-t border-border">
          <h3 className="font-medium mb-4">Important Information</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start">
              <span className="text-accent mr-2">•</span>
              Please arrive 10 minutes before your appointment time.
            </li>
            <li className="flex items-start">
              <span className="text-accent mr-2">•</span>
              If you need to cancel or reschedule, please do so at least 24 hours in advance.
            </li>
            <li className="flex items-start">
              <span className="text-accent mr-2">•</span>
              You've paid a 30% down payment. The remaining amount is to be paid at the shop.
            </li>
            <li className="flex items-start">
              <span className="text-accent mr-2">•</span>
              For any questions, please contact us at <span className="text-accent">info@qubomnl.com</span> or call <span className="text-accent">+63 917 123 4567</span>.
            </li>
          </ul>
        </div>
      </div>

      <div className="pt-6 text-center">
        <button
          className="px-6 py-2 bg-accent text-accent-foreground rounded-md font-medium hover:bg-accent/90 transition-colors"
          onClick={handleBackToHome}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default BookingConfirmation;
