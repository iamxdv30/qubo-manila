import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useBooking } from '@/hooks/useBooking';

// Import booking steps components
import ServiceSelection from '@/components/booking/ServiceSelection';
import DateTimePicker from '@/components/booking/DateTimePicker';
import CustomerInformation from '@/components/booking/CustomerInformation';
import EmailVerification from '@/components/booking/EmailVerification';
import PaymentSummary from '@/components/booking/PaymentSummary';
import PaymentMethods from '@/components/booking/PaymentMethods';
import BookingConfirmation from '@/components/booking/BookingConfirmation';

const BookingFlow = () => {
  const navigate = useNavigate();
  const { bookingState, prevStep, nextStep, goToStep } = useBooking();
  const { currentStep, selectedBarber } = bookingState;

  // Ensure we have a barber selected
  useEffect(() => {
    if (!selectedBarber) {
      navigate('/barbers');
    }
  }, [selectedBarber, navigate]);

  // Define the steps in the booking flow
  const steps = [
    { id: 1, name: 'Service', component: ServiceSelection },
    { id: 2, name: 'Date & Time', component: DateTimePicker },
    { id: 3, name: 'Information', component: CustomerInformation },
    { id: 4, name: 'Verification', component: EmailVerification },
    { id: 5, name: 'Summary', component: PaymentSummary },
    { id: 6, name: 'Payment', component: PaymentMethods },
    { id: 7, name: 'Confirmation', component: BookingConfirmation },
  ];

  // Get the current step component
  const CurrentStepComponent = steps.find(step => step.id === currentStep)?.component || ServiceSelection;

  // Handle navigation between steps
  const handleNext = () => {
    nextStep();
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    prevStep();
    window.scrollTo(0, 0);
  };

  return (
    <div className="bg-background min-h-screen pt-20 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Bar */}
        {currentStep < steps.length && (
          <div className="py-8">
            <div className="flex items-center justify-between mb-2">
              {steps.slice(0, -1).map((step) => (
                <div 
                  key={step.id}
                  className={`
                    flex items-center justify-center w-8 h-8 rounded-full 
                    ${currentStep >= step.id 
                      ? 'bg-accent text-accent-foreground' 
                      : 'bg-muted text-muted-foreground'
                    }
                    ${currentStep > step.id ? 'cursor-pointer' : ''}
                  `}
                  onClick={() => currentStep > step.id && goToStep(step.id)}
                >
                  {currentStep > step.id ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-medium">{step.id}</span>
                  )}
                </div>
              ))}
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full h-1 bg-muted rounded-full" />
              </div>
              <div 
                className="absolute inset-0 flex items-center"
                style={{ 
                  width: `${((currentStep - 1) / (steps.length - 2)) * 100}%`,
                  transition: 'width 0.3s ease-in-out'
                }}
              >
                <div className="w-full h-1 bg-accent rounded-full" />
              </div>
              <div className="relative flex justify-between">
                {steps.slice(0, -1).map((step) => (
                  <div 
                    key={step.id}
                    className="flex flex-col items-center"
                  >
                    <div className="w-8 h-8 bg-transparent" />
                    <span 
                      className={`
                        mt-2 text-xs font-medium
                        ${currentStep >= step.id ? 'text-accent' : 'text-muted-foreground'}
                      `}
                    >
                      {step.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step Content */}
        <div className="bg-card border border-border rounded-lg shadow-elegant p-6 md:p-8">
          <CurrentStepComponent onNext={handleNext} />
        </div>

        {/* Navigation Buttons */}
        {currentStep > 1 && currentStep < steps.length && (
          <div className="mt-8 flex justify-between">
            <button
              className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
              onClick={handleBack}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingFlow;
