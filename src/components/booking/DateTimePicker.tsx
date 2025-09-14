import { useState, useEffect } from 'react';
import { format, addDays, isSameDay } from 'date-fns';
import { Calendar as CalendarIcon, Clock, Check } from 'lucide-react';
import { useBooking } from '@/hooks/useBooking';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { TimeSlot, Availability } from '@/types';

interface DateTimePickerProps {
  onNext: () => void;
}

// Generate mock availability data for the selected barber
const generateMockAvailability = (barberId: string): Availability[] => {
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
};

const DateTimePicker = ({ onNext }: DateTimePickerProps) => {
  const { bookingState, setSelectedDate, setSelectedTimeSlot } = useBooking();
  const { selectedBarber, selectedDate, selectedTimeSlot } = bookingState;
  
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedTimeSlotObj, setSelectedTimeSlotObj] = useState<TimeSlot | null>(null);

  useEffect(() => {
    if (selectedBarber) {
      // In a real app, fetch availability from API
      const mockAvailability = generateMockAvailability(selectedBarber.id);
      setAvailabilities(mockAvailability);
    }
  }, [selectedBarber]);

  useEffect(() => {
    if (selectedDate && availabilities.length > 0) {
      const dateString = format(selectedDate, 'yyyy-MM-dd');
      const availability = availabilities.find(a => a.date === dateString);
      
      if (availability) {
        setTimeSlots(availability.slots);
      } else {
        setTimeSlots([]);
      }
    }
  }, [selectedDate, availabilities]);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setSelectedTimeSlot(null);
      setSelectedTimeSlotObj(null);
    }
  };

  const handleTimeSlotSelect = (timeSlot: TimeSlot) => {
    setSelectedTimeSlotObj(timeSlot);
    setSelectedTimeSlot(`${timeSlot.startTime}-${timeSlot.endTime}`);
  };

  // Check if a date has any available slots
  const hasAvailableSlots = (date: Date): boolean => {
    const dateString = format(date, 'yyyy-MM-dd');
    const availability = availabilities.find(a => a.date === dateString);
    
    return availability?.slots.some(slot => !slot.isBooked && !slot.isPTO) || false;
  };

  // Check if a date is PTO
  const isPTODay = (date: Date): boolean => {
    const dateString = format(date, 'yyyy-MM-dd');
    const availability = availabilities.find(a => a.date === dateString);
    
    return availability?.slots.every(slot => slot.isPTO) || false;
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-heading font-bold">Select Date & Time</h2>
        <p className="text-muted-foreground mt-2">
          Choose when you'd like to book your appointment
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Calendar */}
        <div>
          <h3 className="font-medium mb-4 flex items-center">
            <CalendarIcon className="h-4 w-4 mr-2 text-accent" />
            Select a Date
          </h3>
          <Calendar
            mode="single"
            selected={selectedDate || undefined}
            onSelect={handleDateSelect}
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
            Select a Time
            {selectedDate && (
              <span className="ml-2 text-sm text-muted-foreground">
                {format(selectedDate, 'MMMM d, yyyy')}
              </span>
            )}
          </h3>
          
          <div className="border border-border rounded-lg p-4 h-[380px] overflow-y-auto">
            {!selectedDate ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <CalendarIcon className="h-12 w-12 text-muted-foreground mb-3" />
                <h4 className="font-medium">No Date Selected</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Please select a date to see available time slots.
                </p>
              </div>
            ) : isPTODay(selectedDate) ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="h-12 w-12 rounded-full bg-destructive/20 flex items-center justify-center mb-3">
                  <Clock className="h-6 w-6 text-destructive" />
                </div>
                <h4 className="font-medium">Not Available</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  The barber is not available on this day. Please select another date.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {timeSlots.map((slot) => (
                  <button
                    key={slot.id}
                    className={`
                      px-3 py-2 rounded-md text-sm font-medium transition-colors
                      ${slot.isBooked || slot.isPTO 
                        ? 'bg-muted text-muted-foreground opacity-50 cursor-not-allowed' 
                        : selectedTimeSlotObj?.id === slot.id
                          ? 'bg-accent text-accent-foreground'
                          : 'bg-card hover:bg-accent/20 border border-border'
                      }
                    `}
                    disabled={slot.isBooked || slot.isPTO}
                    onClick={() => handleTimeSlotSelect(slot)}
                  >
                    {slot.startTime}
                    {selectedTimeSlotObj?.id === slot.id && (
                      <Check className="h-3 w-3 ml-1 inline" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="pt-6 text-center">
        <button
          className="px-6 py-2 bg-accent text-accent-foreground rounded-md font-medium hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!selectedDate || !selectedTimeSlot}
          onClick={onNext}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default DateTimePicker;
