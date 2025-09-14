import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { format, addDays } from 'date-fns';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  ArrowLeft, 
  ArrowRight, 
  Scissors, 
  User, 
  CreditCard, 
  Check,
  Loader2
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import TimeSlotPickerComponent from '@/components/ui/TimeSlotPicker';
import { TimeSlot as TimeSlotType } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

// Types
interface Barber {
  id: string;
  name: string;
  rank: 'master' | 'senior' | 'junior';
  profileImage: string;
  services: Service[];
}

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
}

// Local TimeSlot interface for this component
interface LocalTimeSlot {
  time: string;
  available: boolean;
  booked?: boolean;
  pto?: boolean;
}

interface BookingFormData {
  barberId: string;
  serviceId: string;
  date: Date;
  timeSlot: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  specialRequests: string;
  acceptTerms: boolean;
  paymentMethod: 'card' | 'gcash' | 'maya' | 'cash';
  cardNumber?: string;
  cardExpiry?: string;
  cardCvc?: string;
  cardName?: string;
}

const BookingFlow = () => {
  const { barberId } = useParams<{ barberId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [barber, setBarber] = useState<Barber | null>(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<LocalTimeSlot[]>([]);
  const [formattedTimeSlots, setFormattedTimeSlots] = useState<TimeSlotType[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlotType | null>(null);
  
  const [formData, setFormData] = useState<BookingFormData>({
    barberId: barberId || '',
    serviceId: searchParams.get('service') || '',
    date: new Date(),
    timeSlot: null,
    customerName: user?.name || '',
    customerEmail: user?.email || '',
    customerPhone: '',
    specialRequests: '',
    acceptTerms: false,
    paymentMethod: 'card',
  });

  useEffect(() => {
    // In a real app, fetch barber and services from API
    // Simulate API call
    setTimeout(() => {
      // Mock barber data
      const mockBarber: Barber = {
        id: barberId || 'b1',
        name: 'John Doe',
        rank: 'master',
        profileImage: 'https://i.pravatar.cc/300?img=1',
        services: [
          {
            id: 's1',
            name: 'Classic Haircut',
            description: 'Traditional haircut with scissors, includes wash and styling',
            price: 500,
            duration: 45,
            category: 'haircut',
          },
          {
            id: 's2',
            name: 'Beard Trim',
            description: 'Precise beard trimming and styling',
            price: 300,
            duration: 30,
            category: 'beard',
          },
          {
            id: 's3',
            name: 'Hair & Beard Combo',
            description: 'Complete styling package with haircut and beard trim',
            price: 700,
            duration: 60,
            category: 'combo',
          },
          {
            id: 's4',
            name: 'Royal Shave',
            description: 'Premium hot towel shave with facial treatment',
            price: 450,
            duration: 45,
            category: 'shave',
          },
          {
            id: 's5',
            name: 'Hair Coloring',
            description: 'Professional hair coloring service',
            price: 1200,
            duration: 90,
            category: 'color',
          },
        ],
      };
      
      setBarber(mockBarber);
      
      // If service ID is provided in URL, set it in form data
      if (searchParams.get('service')) {
        setFormData(prev => ({
          ...prev,
          serviceId: searchParams.get('service') || '',
        }));
      } else if (mockBarber.services.length > 0) {
        // Otherwise set first service as default
        setFormData(prev => ({
          ...prev,
          serviceId: mockBarber.services[0].id,
        }));
      }
      
      setIsLoading(false);
    }, 1000);
  }, [barberId, searchParams]);

  useEffect(() => {
    // Generate mock time slots when date changes
    if (formData.date) {
      // In a real app, fetch available time slots for the selected date from API
      // Simulate API call
      setTimeout(() => {
        // Generate mock time slots from 9 AM to 6 PM
        const slots: LocalTimeSlot[] = [];
        for (let hour = 9; hour < 18; hour++) {
          // Add :00 slot
          slots.push({
            time: `${hour.toString().padStart(2, '0')}:00`,
            available: Math.random() > 0.3, // 70% chance of being available
            booked: Math.random() > 0.7, // 30% chance of being booked if not available
            pto: Math.random() > 0.7, // 30% chance of being PTO if not available and not booked
          });
          
          // Add :30 slot
          slots.push({
            time: `${hour.toString().padStart(2, '0')}:30`,
            available: Math.random() > 0.3,
            booked: Math.random() > 0.7,
            pto: Math.random() > 0.7,
          });
        }
        
        setAvailableTimeSlots(slots);
        
        // Convert local time slots to TimeSlot type for the TimeSlotPicker component
        const formatted = slots.map((slot, index) => ({
          id: `slot-${index}`,
          startTime: slot.time,
          endTime: slot.time.split(':')[0] + ':' + (slot.time.split(':')[1] === '00' ? '30' : '00'),
          isBooked: !slot.available && slot.booked === true,
          isPTO: !slot.available && slot.pto === true
        }));
        
        setFormattedTimeSlots(formatted);
      }, 500);
    }
  }, [formData.date]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleRadioChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData(prev => ({ ...prev, date, timeSlot: null }));
    }
  };

  const handleTimeSlotChange = (time: string) => {
    setFormData(prev => ({ ...prev, timeSlot: time }));
  };
  
  const handleTimeSlotSelect = (slot: TimeSlotType) => {
    setSelectedTimeSlot(slot);
    setFormData(prev => ({ ...prev, timeSlot: slot.startTime }));
  };

  const handleServiceChange = (serviceId: string) => {
    setFormData(prev => ({ ...prev, serviceId }));
  };

  const handleNextStep = () => {
    if (validateCurrentStep()) {
      setStep(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePreviousStep = () => {
    setStep(prev => prev - 1);
    window.scrollTo(0, 0);
  };

  const validateCurrentStep = () => {
    switch (step) {
      case 1:
        if (!formData.serviceId) {
          toast({
            title: "Service required",
            description: "Please select a service to continue.",
            variant: "destructive",
          });
          return false;
        }
        return true;
      case 2:
        if (!formData.date || !formData.timeSlot) {
          toast({
            title: "Date and time required",
            description: "Please select a date and time slot to continue.",
            variant: "destructive",
          });
          return false;
        }
        return true;
      case 3:
        if (!formData.customerName || !formData.customerEmail || !formData.customerPhone) {
          toast({
            title: "Contact information required",
            description: "Please fill in all required contact information.",
            variant: "destructive",
          });
          return false;
        }
        if (!formData.acceptTerms) {
          toast({
            title: "Terms acceptance required",
            description: "Please accept the terms and conditions to continue.",
            variant: "destructive",
          });
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleSubmitBooking = async () => {
    setIsSubmitting(true);
    
    try {
      // In a real app, submit booking to API
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Booking successful!",
        description: "Your appointment has been confirmed.",
      });
      
      // Navigate to confirmation page or dashboard
      navigate('/');
    } catch (err) {
      toast({
        title: "Booking failed",
        description: "There was an error processing your booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSelectedService = () => {
    if (!barber) return null;
    return barber.services.find(service => service.id === formData.serviceId);
  };

  const getDownPaymentAmount = () => {
    const service = getSelectedService();
    if (!service) return 0;
    return Math.round(service.price * 0.3); // 30% down payment
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'}`}>
          <Scissors className="h-4 w-4" />
        </div>
        <div className={`w-16 h-1 ${step > 1 ? 'bg-accent' : 'bg-muted'}`}></div>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'}`}>
          <CalendarIcon className="h-4 w-4" />
        </div>
        <div className={`w-16 h-1 ${step > 2 ? 'bg-accent' : 'bg-muted'}`}></div>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'}`}>
          <User className="h-4 w-4" />
        </div>
        <div className={`w-16 h-1 ${step > 3 ? 'bg-accent' : 'bg-muted'}`}></div>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 4 ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'}`}>
          <CreditCard className="h-4 w-4" />
        </div>
      </div>
    </div>
  );

  const renderServiceSelection = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Select a Service</h2>
        <p className="text-muted-foreground">
          Choose the service you'd like to book with {barber?.name}
        </p>
      </div>
      
      <div className="space-y-4">
        {barber?.services.map((service) => (
          <Card 
            key={service.id} 
            className={`cursor-pointer hover:border-accent/50 transition-colors ${formData.serviceId === service.id ? 'border-accent' : ''}`}
            onClick={() => handleServiceChange(service.id)}
          >
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-heading font-semibold text-lg">{service.name}</h3>
                  <p className="text-muted-foreground">{service.description}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">₱{service.price}</p>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{service.duration} min</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderDateTimeSelection = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Select Date & Time</h2>
        <p className="text-muted-foreground">
          Choose when you'd like to schedule your appointment
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Select Date</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={formData.date}
              onSelect={handleDateChange}
              disabled={(date) => 
                date < new Date() || // Can't book in the past
                date > addDays(new Date(), 30) // Can't book more than 30 days in advance
              }
              className="mx-auto"
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Select Time</CardTitle>
            <CardDescription>
              Available time slots for {format(formData.date, 'MMMM d, yyyy')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {availableTimeSlots.length > 0 ? (
              <TimeSlotPickerComponent
                date={formData.date}
                timeSlots={formattedTimeSlots}
                selectedTimeSlot={selectedTimeSlot}
                onSelectTimeSlot={handleTimeSlotSelect}
              />
            ) : (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-accent" />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderContactInformation = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Contact Information</h2>
        <p className="text-muted-foreground">
          Please provide your contact details for the appointment
        </p>
      </div>
      
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customerName">Full Name</Label>
            <Input
              id="customerName"
              name="customerName"
              value={formData.customerName}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="customerEmail">Email Address</Label>
            <Input
              id="customerEmail"
              name="customerEmail"
              type="email"
              value={formData.customerEmail}
              onChange={handleInputChange}
              placeholder="Enter your email address"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="customerPhone">Phone Number</Label>
            <Input
              id="customerPhone"
              name="customerPhone"
              value={formData.customerPhone}
              onChange={handleInputChange}
              placeholder="Enter your phone number"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
            <Textarea
              id="specialRequests"
              name="specialRequests"
              value={formData.specialRequests}
              onChange={handleInputChange}
              placeholder="Any special requests or notes for your appointment"
              rows={3}
            />
          </div>
          
          <div className="flex items-center space-x-2 pt-4">
            <Checkbox 
              id="acceptTerms" 
              checked={formData.acceptTerms}
              onCheckedChange={(checked) => handleCheckboxChange('acceptTerms', checked as boolean)}
            />
            <Label htmlFor="acceptTerms" className="text-sm">
              I agree to the terms and conditions, including the cancellation policy
            </Label>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderPaymentInformation = () => {
    const selectedService = getSelectedService();
    const downPayment = getDownPaymentAmount();
    
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-2">Payment Information</h2>
          <p className="text-muted-foreground">
            Complete your booking with a 30% down payment
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{selectedService?.name}</p>
                  <p className="text-sm text-muted-foreground">with {barber?.name}</p>
                </div>
                <p className="font-medium">₱{selectedService?.price}</p>
              </div>
              
              <div className="flex items-center text-sm text-muted-foreground">
                <CalendarIcon className="h-4 w-4 mr-2" />
                <span>{format(formData.date, 'MMMM d, yyyy')}</span>
                <span className="mx-2">•</span>
                <Clock className="h-4 w-4 mr-2" />
                <span>{formData.timeSlot}</span>
              </div>
              
              <Separator />
              
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">Total Price</p>
                <p className="font-medium">₱{selectedService?.price}</p>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">Down Payment (30%)</p>
                  <p className="text-xs text-muted-foreground">Required to secure booking</p>
                </div>
                <p className="font-medium">₱{downPayment}</p>
              </div>
              
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">Remaining Balance</p>
                <p className="text-sm">₱{selectedService ? selectedService.price - downPayment : 0}</p>
              </div>
              
              <div className="bg-muted/30 p-4 rounded-md text-sm">
                <p className="font-medium mb-1">Cancellation Policy:</p>
                <p className="text-muted-foreground">Free cancellation up to 24 hours before your appointment. Late cancellations or no-shows may forfeit the down payment.</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
              <CardDescription>
                Select how you'd like to pay the down payment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <RadioGroup 
                value={formData.paymentMethod} 
                onValueChange={(value) => handleRadioChange('paymentMethod', value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="card" id="payment-card" />
                  <Label htmlFor="payment-card">Credit/Debit Card</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="gcash" id="payment-gcash" />
                  <Label htmlFor="payment-gcash">GCash</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="maya" id="payment-maya" />
                  <Label htmlFor="payment-maya">Maya</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cash" id="payment-cash" />
                  <Label htmlFor="payment-cash">Cash (Pay at Location)</Label>
                </div>
              </RadioGroup>
              
              {formData.paymentMethod === 'card' && (
                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="cardName">Name on Card</Label>
                    <Input
                      id="cardName"
                      name="cardName"
                      value={formData.cardName || ''}
                      onChange={handleInputChange}
                      placeholder="Enter name on card"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      name="cardNumber"
                      value={formData.cardNumber || ''}
                      onChange={handleInputChange}
                      placeholder="1234 5678 9012 3456"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardExpiry">Expiry Date</Label>
                      <Input
                        id="cardExpiry"
                        name="cardExpiry"
                        value={formData.cardExpiry || ''}
                        onChange={handleInputChange}
                        placeholder="MM/YY"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cardCvc">CVC</Label>
                      <Input
                        id="cardCvc"
                        name="cardCvc"
                        value={formData.cardCvc || ''}
                        onChange={handleInputChange}
                        placeholder="123"
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {formData.paymentMethod === 'gcash' && (
                <div className="bg-muted/30 p-4 rounded-md text-sm">
                  <p>You'll be redirected to GCash to complete your payment after confirming your booking.</p>
                </div>
              )}
              
              {formData.paymentMethod === 'maya' && (
                <div className="bg-muted/30 p-4 rounded-md text-sm">
                  <p>You'll be redirected to Maya to complete your payment after confirming your booking.</p>
                </div>
              )}
              
              {formData.paymentMethod === 'cash' && (
                <div className="bg-muted/30 p-4 rounded-md text-sm">
                  <p>Please note that your appointment is not fully secured until you arrive and pay the down payment in cash.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return renderServiceSelection();
      case 2:
        return renderDateTimeSelection();
      case 3:
        return renderContactInformation();
      case 4:
        return renderPaymentInformation();
      default:
        return null;
    }
  };

  const renderStepNavigation = () => (
    <div className="flex justify-between mt-8">
      {step > 1 ? (
        <Button 
          variant="outline" 
          onClick={handlePreviousStep}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
      ) : (
        <Button 
          variant="outline" 
          onClick={() => navigate(`/barber/${barberId}`)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Profile
        </Button>
      )}
      
      {step < 4 ? (
        <Button onClick={handleNextStep}>
          Next
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      ) : (
        <Button 
          onClick={handleSubmitBooking}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Check className="h-4 w-4 mr-2" />
              Confirm Booking
            </>
          )}
        </Button>
      )}
    </div>
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <Button 
        variant="ghost" 
        className="mb-6" 
        onClick={() => navigate(`/barber/${barberId}`)}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Barber Profile
      </Button>
      
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-2">Book an Appointment</h1>
        <p className="text-muted-foreground text-center mb-6">
          {barber ? `with ${barber.name}` : 'Loading barber information...'}
        </p>
        
        {renderStepIndicator()}
        
        {isLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-full" />
            <div className="space-y-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        ) : (
          <>
            {renderStepContent()}
            {renderStepNavigation()}
          </>
        )}
      </div>
    </div>
  );
};

export default BookingFlow;
