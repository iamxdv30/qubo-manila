import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format, addDays, isSameDay } from 'date-fns';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Star, 
  ChevronLeft, 
  ChevronRight, 
  Scissors,
  X,
  Check
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';

import { Barber, Service, TimeSlot, Availability } from '@/types';
import { useBooking } from '@/hooks/useBooking';

// Mock data for a single barber (this would come from an API in a real app)
const mockBarber: Barber = {
  id: '1',
  userId: 'user1',
  name: 'John Doe',
  rank: 'master',
  profileImage: 'https://i.pravatar.cc/300?img=1',
  portfolioImages: [
    'https://images.unsplash.com/photo-1622286342621-4bd786c2447c',
    'https://images.unsplash.com/photo-1585747860715-2ba37e788b70',
    'https://images.unsplash.com/photo-1503951914875-452162b0f3f1',
    'https://images.unsplash.com/photo-1521038199265-bc482db0f923',
    'https://images.unsplash.com/photo-1517832606299-7ae9b720a186',
  ],
  bio: 'Master barber with over 10 years of experience specializing in classic cuts and beard styling. Known for precision work and attention to detail. Trained in both traditional and modern barbering techniques.',
  experience: 10,
  startingPrice: 500,
  rating: 4.9,
  services: [
    { id: 's1', name: 'Classic Haircut', description: 'Traditional haircut with scissors', price: 500, duration: 45, category: 'haircut' },
    { id: 's2', name: 'Beard Trim', description: 'Precise beard trimming and styling', price: 300, duration: 30, category: 'beard' },
    { id: 's3', name: 'Hair & Beard Combo', description: 'Complete styling package', price: 700, duration: 60, category: 'combo' },
    { id: 's4', name: 'Hot Towel Shave', description: 'Traditional straight razor shave with hot towel', price: 450, duration: 40, category: 'shave' },
    { id: 's5', name: 'Hair Coloring', description: 'Professional hair color application', price: 800, duration: 90, category: 'color' },
  ],
  availability: generateMockAvailability('1'),
};

// Generate 30 days of mock availability
function generateMockAvailability(barberId: string): Availability[] {
  const availabilities: Availability[] = [];
  
  for (let i = 0; i < 30; i++) {
    const date = addDays(new Date(), i);
    const dateString = format(date, 'yyyy-MM-dd');
    
    // Generate time slots from 9 AM to 8 PM in 30-minute intervals
    const slots: TimeSlot[] = [];
    for (let hour = 9; hour < 20; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const startHour = hour.toString().padStart(2, '0');
        const startMinute = minute.toString().padStart(2, '0');
        const endHour = minute === 30 ? hour.toString().padStart(2, '0') : (hour + 1).toString().padStart(2, '0');
        const endMinute = minute === 30 ? '00' : '30';
        
        const startTime = `${startHour}:${startMinute}`;
        const endTime = `${endHour}:${endMinute}`;
        
        // Randomly mark some slots as booked
        const isBooked = Math.random() < 0.3;
        
        // Mark some days as PTO (e.g., every Sunday)
        const isPTO = date.getDay() === 0 || (i === 5); // Sunday or 5th day from today
        
        slots.push({
          id: `ts-${dateString}-${startTime}`,
          startTime,
          endTime,
          isBooked,
          isPTO,
        });
      }
    }
    
    availabilities.push({
      id: `avail-${dateString}`,
      barberId,
      date: dateString,
      slots,
    });
  }
  
  return availabilities;
}

const BarberProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { setSelectedBarber, setSelectedService, setSelectedDate, setSelectedTimeSlot, goToStep } = useBooking();
  
  const [barber, setBarber] = useState<Barber | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedDate, setSelectedDateLocal] = useState<Date | undefined>(new Date());
  const [selectedService, setSelectedServiceLocal] = useState<Service | null>(null);
  const [selectedTimeSlotLocal, setSelectedTimeSlotLocal] = useState<TimeSlot | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  
  // Fetch barber data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      // In a real app, this would be an API call using the ID from params
      setBarber(mockBarber);
      setLoading(false);
    }, 800);
  }, [id]);

  // Get availability for selected date
  const getAvailabilityForDate = (date: Date | undefined): Availability | undefined => {
    if (!date || !barber) return undefined;
    
    return barber.availability.find(a => 
      a.date === format(date, 'yyyy-MM-dd')
    );
  };

  // Get time slots for selected date
  const getTimeSlotsForDate = (date: Date | undefined): TimeSlot[] => {
    const availability = getAvailabilityForDate(date);
    return availability?.slots || [];
  };

  // Check if a date has any available slots
  const hasAvailableSlots = (date: Date): boolean => {
    const availability = barber?.availability.find(a => 
      a.date === format(date, 'yyyy-MM-dd')
    );
    
    return availability?.slots.some(slot => !slot.isBooked && !slot.isPTO) || false;
  };

  // Check if a date is PTO
  const isPTODay = (date: Date): boolean => {
    const availability = barber?.availability.find(a => 
      a.date === format(date, 'yyyy-MM-dd')
    );
    
    return availability?.slots.every(slot => slot.isPTO) || false;
  };

  // Handle portfolio image navigation
  const handlePrevImage = () => {
    setCurrentImageIndex(prev => 
      prev === 0 ? (barber?.portfolioImages.length || 1) - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex(prev => 
      prev === (barber?.portfolioImages.length || 1) - 1 ? 0 : prev + 1
    );
  };

  // Handle booking
  const handleBookAppointment = () => {
    if (!barber || !selectedService || !selectedDate || !selectedTimeSlotLocal) return;
    
    // Set booking context values
    setSelectedBarber(barber);
    setSelectedService(selectedService);
    setSelectedDate(selectedDate);
    setSelectedTimeSlot(`${selectedTimeSlotLocal.startTime}-${selectedTimeSlotLocal.endTime}`);
    
    // Close modal and navigate to booking flow
    setIsBookingModalOpen(false);
    goToStep(1); // Start at step 1
    navigate('/booking');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-20 pb-16 flex items-center justify-center">
        <div className="animate-spin">
          <Scissors className="h-8 w-8 text-accent" />
        </div>
      </div>
    );
  }

  if (!barber) {
    return (
      <div className="min-h-screen bg-background pt-20 pb-16 flex flex-col items-center justify-center">
        <X className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-2xl font-heading font-bold">Barber Not Found</h2>
        <p className="text-muted-foreground mt-2">The barber you're looking for doesn't exist.</p>
        <Button 
          variant="outline" 
          className="mt-6"
          onClick={() => navigate('/barbers')}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Barbers
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={() => navigate('/barbers')}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Barbers
        </Button>
        
        {/* Hero Section */}
        <div className="bg-card border border-border rounded-lg overflow-hidden shadow-elegant">
          <div className="md:flex">
            {/* Barber Image */}
            <div className="md:w-1/3 h-80 md:h-auto">
              <img 
                src={barber.profileImage} 
                alt={barber.name} 
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Barber Info */}
            <div className="md:w-2/3 p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                <div>
                  <div className="flex items-center">
                    <h1 className="text-3xl font-heading font-bold">{barber.name}</h1>
                    <Badge
                      variant="secondary"
                      className={`
                        ml-3
                        ${barber.rank === 'master' ? 'bg-amber-500/20 text-amber-500 border-amber-500/50' : 
                          barber.rank === 'senior' ? 'bg-blue-500/20 text-blue-500 border-blue-500/50' : 
                          'bg-green-500/20 text-green-500 border-green-500/50'}
                        font-medium capitalize
                      `}
                    >
                      {barber.rank}
                    </Badge>
                  </div>
                  <div className="flex items-center mt-2">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                    <span className="font-medium mr-2">{barber.rating}</span>
                    <span className="text-muted-foreground">•</span>
                    <span className="ml-2 text-muted-foreground">{barber.experience} years experience</span>
                  </div>
                </div>
                
                <Button 
                  size="lg" 
                  className="mt-4 md:mt-0"
                  onClick={() => setIsBookingModalOpen(true)}
                >
                  Book Appointment
                </Button>
              </div>
              
              <p className="text-muted-foreground mb-6">{barber.bio}</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Starting Price</h3>
                  <p className="font-semibold text-lg">₱{barber.startingPrice}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Specialties</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <Badge variant="outline">Classic Cuts</Badge>
                    <Badge variant="outline">Beard Styling</Badge>
                    <Badge variant="outline">Hair Coloring</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Portfolio Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-heading font-semibold mb-6">Portfolio</h2>
          <div className="relative bg-card border border-border rounded-lg overflow-hidden shadow-elegant">
            {/* Main Image */}
            <div className="h-96 relative">
              <img 
                src={barber.portfolioImages[currentImageIndex]} 
                alt={`Portfolio ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
              />
              
              {/* Navigation Arrows */}
              <div className="absolute inset-0 flex items-center justify-between p-4">
                <Button 
                  variant="secondary" 
                  size="icon" 
                  className="rounded-full bg-background/80 backdrop-blur-sm"
                  onClick={handlePrevImage}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button 
                  variant="secondary" 
                  size="icon" 
                  className="rounded-full bg-background/80 backdrop-blur-sm"
                  onClick={handleNextImage}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            {/* Navigation Dots */}
            <div className="flex items-center justify-center p-4">
              {barber.portfolioImages.map((_, index) => (
                <button
                  key={index}
                  className={`h-2 w-2 rounded-full mx-1 ${
                    index === currentImageIndex ? 'bg-accent' : 'bg-muted'
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                  aria-label={`View portfolio image ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
        
        {/* Services Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-heading font-semibold mb-6">Services</h2>
          <div className="bg-card border border-border rounded-lg overflow-hidden shadow-elegant">
            <div className="p-6">
              <div className="space-y-4">
                {barber.services.map((service) => (
                  <div 
                    key={service.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-border rounded-lg hover:border-accent transition-colors"
                  >
                    <div>
                      <h3 className="font-medium">{service.name}</h3>
                      <p className="text-sm text-muted-foreground">{service.description}</p>
                    </div>
                    <div className="flex items-center mt-3 sm:mt-0">
                      <div className="text-right mr-4">
                        <p className="font-semibold">₱{service.price}</p>
                        <p className="text-xs text-muted-foreground">{service.duration} min</p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedServiceLocal(service);
                          setIsBookingModalOpen(true);
                        }}
                      >
                        Select
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Availability Calendar Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-heading font-semibold mb-6">Availability</h2>
          <div className="bg-card border border-border rounded-lg overflow-hidden shadow-elegant">
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Calendar */}
                <div>
                  <h3 className="font-medium mb-4 flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-2 text-accent" />
                    Select a Date
                  </h3>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDateLocal}
                    className="border border-border rounded-lg p-4"
                    disabled={(date) => {
                      // Disable dates in the past or more than 30 days in the future
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      const thirtyDaysFromNow = addDays(today, 30);
                      return date < today || date > thirtyDaysFromNow;
                    }}
                    modifiers={{
                      available: (date) => hasAvailableSlots(date),
                      pto: (date) => isPTODay(date),
                    }}
                    modifiersClassNames={{
                      available: "bg-accent/20 text-accent font-medium",
                      pto: "bg-destructive/20 text-destructive font-medium",
                    }}
                  />
                  <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center">
                      <div className="h-3 w-3 bg-accent/20 rounded-full mr-1"></div>
                      <span>Available</span>
                    </div>
                    <div className="flex items-center">
                      <div className="h-3 w-3 bg-destructive/20 rounded-full mr-1"></div>
                      <span>Day Off</span>
                    </div>
                    <div className="flex items-center">
                      <div className="h-3 w-3 bg-muted rounded-full mr-1"></div>
                      <span>No Availability</span>
                    </div>
                  </div>
                </div>
                
                {/* Time Slots */}
                <div>
                  <h3 className="font-medium mb-4 flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-accent" />
                    Available Time Slots
                    {selectedDate && (
                      <span className="ml-2 text-sm text-muted-foreground">
                        {format(selectedDate, 'MMMM d, yyyy')}
                      </span>
                    )}
                  </h3>
                  
                  <div className="border border-border rounded-lg p-4 h-[380px] overflow-y-auto">
                    {isPTODay(selectedDate || new Date()) ? (
                      <div className="h-full flex flex-col items-center justify-center text-center p-6">
                        <X className="h-12 w-12 text-destructive mb-3" />
                        <h4 className="font-medium">Not Available</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          The barber is not available on this day. Please select another date.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {getTimeSlotsForDate(selectedDate).map((slot) => (
                          <Button
                            key={slot.id}
                            variant={selectedTimeSlotLocal?.id === slot.id ? "default" : "outline"}
                            size="sm"
                            className={`
                              ${slot.isBooked || slot.isPTO ? 'opacity-50 cursor-not-allowed' : ''}
                              ${selectedTimeSlotLocal?.id === slot.id ? 'border-accent' : ''}
                            `}
                            disabled={slot.isBooked || slot.isPTO}
                            onClick={() => setSelectedTimeSlotLocal(slot)}
                          >
                            {slot.startTime}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Booking Modal */}
      <Dialog open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Book an Appointment</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <div className="space-y-4">
              {/* Selected Barber */}
              <div className="flex items-center">
                <img 
                  src={barber.profileImage} 
                  alt={barber.name} 
                  className="h-12 w-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h3 className="font-medium">{barber.name}</h3>
                  <p className="text-sm text-muted-foreground capitalize">{barber.rank} Barber</p>
                </div>
              </div>
              
              <Separator />
              
              {/* Service Selection */}
              <div>
                <h4 className="font-medium mb-2">Select Service</h4>
                <div className="space-y-2">
                  {barber.services.map((service) => (
                    <div 
                      key={service.id}
                      className={`
                        p-3 border rounded-lg cursor-pointer
                        ${selectedService?.id === service.id 
                          ? 'border-accent bg-accent/5' 
                          : 'border-border hover:border-accent/50 transition-colors'
                        }
                      `}
                      onClick={() => setSelectedServiceLocal(service)}
                    >
                      <div className="flex justify-between">
                        <div>
                          <h5 className="font-medium">{service.name}</h5>
                          <p className="text-xs text-muted-foreground">{service.duration} min</p>
                        </div>
                        <p className="font-semibold">₱{service.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              {/* Date and Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Date</h4>
                  <div className="text-sm">
                    {selectedDate ? (
                      <Badge variant="outline" className="bg-accent/10 border-accent/30 text-accent">
                        {format(selectedDate, 'MMMM d, yyyy')}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-muted/50">
                        Select a date
                      </Badge>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Time</h4>
                  <div className="text-sm">
                    {selectedTimeSlotLocal ? (
                      <Badge variant="outline" className="bg-accent/10 border-accent/30 text-accent">
                        {selectedTimeSlotLocal.startTime} - {selectedTimeSlotLocal.endTime}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-muted/50">
                        Select a time
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsBookingModalOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleBookAppointment}
              disabled={!selectedService || !selectedDate || !selectedTimeSlotLocal}
            >
              Continue to Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BarberProfile;
