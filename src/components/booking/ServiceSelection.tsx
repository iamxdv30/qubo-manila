import { useEffect } from 'react';
import { useBooking } from '@/hooks/useBooking';
import { Service } from '@/types';
import { Scissors, Clock, Check } from 'lucide-react';

interface ServiceSelectionProps {
  onNext: () => void;
}

const ServiceSelection = ({ onNext }: ServiceSelectionProps) => {
  const { bookingState, setSelectedService } = useBooking();
  const { selectedBarber, selectedService } = bookingState;

  useEffect(() => {
    // If no barber is selected, we can't select services
    if (!selectedBarber) {
      // In a real app, redirect to barber selection
      console.error('No barber selected');
    }
  }, [selectedBarber]);

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-heading font-bold">Select a Service</h2>
        <p className="text-muted-foreground mt-2">
          Choose the service you'd like to book with {selectedBarber?.name}
        </p>
      </div>

      {selectedBarber?.services.map((service) => (
        <div
          key={service.id}
          className={`
            p-4 border rounded-lg cursor-pointer transition-all
            ${selectedService?.id === service.id 
              ? 'border-accent bg-accent/5 shadow-md' 
              : 'border-border hover:border-accent/50'
            }
          `}
          onClick={() => handleServiceSelect(service)}
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center
                ${selectedService?.id === service.id 
                  ? 'bg-accent text-accent-foreground' 
                  : 'bg-muted text-muted-foreground'
                }
              `}>
                <Scissors className="h-5 w-5" />
              </div>
              <div className="ml-4">
                <h3 className="font-medium">{service.name}</h3>
                <p className="text-sm text-muted-foreground">{service.description}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold">₱{service.price}</p>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                <Clock className="h-3 w-3 mr-1" />
                <span>{service.duration} min</span>
              </div>
            </div>
          </div>
          
          {selectedService?.id === service.id && (
            <div className="mt-3 flex items-center text-accent">
              <Check className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">Selected</span>
            </div>
          )}
        </div>
      ))}

      <div className="pt-6 text-center">
        <button
          className="px-6 py-2 bg-accent text-accent-foreground rounded-md font-medium hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!selectedService}
          onClick={onNext}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default ServiceSelection;
