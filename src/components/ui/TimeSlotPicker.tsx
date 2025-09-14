import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Clock, Check } from 'lucide-react';
import { TimeSlot } from '@/types';

interface TimeSlotPickerProps {
  date: Date;
  timeSlots: TimeSlot[];
  selectedTimeSlot: TimeSlot | null;
  onSelectTimeSlot: (timeSlot: TimeSlot) => void;
  className?: string;
}

const TimeSlotPicker = ({
  date,
  timeSlots,
  selectedTimeSlot,
  onSelectTimeSlot,
  className = '',
}: TimeSlotPickerProps) => {
  const [groupedTimeSlots, setGroupedTimeSlots] = useState<{ [key: string]: TimeSlot[] }>({});
  
  // Group time slots by hour for better organization
  useEffect(() => {
    const grouped: { [key: string]: TimeSlot[] } = {};
    
    timeSlots.forEach(slot => {
      const hour = slot.startTime.split(':')[0];
      if (!grouped[hour]) {
        grouped[hour] = [];
      }
      grouped[hour].push(slot);
    });
    
    setGroupedTimeSlots(grouped);
  }, [timeSlots]);

  // Format the time to display (e.g., "9:00 AM")
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  // Check if there are any available slots
  const hasAvailableSlots = timeSlots.some(slot => !slot.isBooked && !slot.isPTO);

  return (
    <div className={`border border-border rounded-lg p-4 ${className}`}>
      <div className="flex items-center mb-4">
        <Clock className="h-5 w-5 text-accent mr-2" />
        <h3 className="font-medium">Available Time Slots</h3>
        <span className="ml-2 text-sm text-muted-foreground">
          {format(date, 'MMMM d, yyyy')}
        </span>
      </div>

      {!hasAvailableSlots ? (
        <div className="py-8 text-center">
          <p className="text-muted-foreground">No available time slots for this date.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedTimeSlots).map(([hour, slots]) => {
            // Check if this hour has any available slots
            const hasHourAvailableSlots = slots.some(slot => !slot.isBooked && !slot.isPTO);
            
            if (!hasHourAvailableSlots) return null;
            
            return (
              <div key={hour} className="space-y-2">
                <h4 className="text-sm font-medium">
                  {parseInt(hour, 10) % 12 || 12} {parseInt(hour, 10) >= 12 ? 'PM' : 'AM'}
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {slots.map((slot) => (
                    <button
                      key={slot.id}
                      className={`
                        px-3 py-2 rounded-md text-sm font-medium transition-colors
                        ${slot.isBooked || slot.isPTO 
                          ? 'bg-muted text-muted-foreground opacity-50 cursor-not-allowed' 
                          : selectedTimeSlot?.id === slot.id
                            ? 'bg-accent text-accent-foreground'
                            : 'bg-card hover:bg-accent/20 border border-border'
                        }
                      `}
                      disabled={slot.isBooked || slot.isPTO}
                      onClick={() => onSelectTimeSlot(slot)}
                    >
                      <div className="flex items-center justify-center">
                        <span>{formatTime(slot.startTime)}</span>
                        {selectedTimeSlot?.id === slot.id && (
                          <Check className="h-3 w-3 ml-1" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TimeSlotPicker;
