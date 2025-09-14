import { createContext, useContext, useState, ReactNode } from 'react';
import { Barber, Service, BookingFormValues, PaymentMethod } from '@/types';

interface BookingState {
  selectedBarber: Barber | null;
  selectedService: Service | null;
  selectedDate: Date | null;
  selectedTimeSlot: string | null;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  } | null;
  verificationCode: string | null;
  paymentMethod: PaymentMethod | null;
  isVerified: boolean;
  currentStep: number;
}

interface BookingContextType {
  bookingState: BookingState;
  setSelectedBarber: (barber: Barber | null) => void;
  setSelectedService: (service: Service | null) => void;
  setSelectedDate: (date: Date | null) => void;
  setSelectedTimeSlot: (timeSlot: string | null) => void;
  setCustomerInfo: (info: { name: string; email: string; phone: string } | null) => void;
  setVerificationCode: (code: string | null) => void;
  setPaymentMethod: (method: PaymentMethod | null) => void;
  setIsVerified: (verified: boolean) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  resetBooking: () => void;
  getTotalPrice: () => number;
  getDownPaymentAmount: () => number;
}

const initialState: BookingState = {
  selectedBarber: null,
  selectedService: null,
  selectedDate: null,
  selectedTimeSlot: null,
  customerInfo: null,
  verificationCode: null,
  paymentMethod: null,
  isVerified: false,
  currentStep: 1,
};

export const BookingContext = createContext<BookingContextType>({
  bookingState: initialState,
  setSelectedBarber: () => {},
  setSelectedService: () => {},
  setSelectedDate: () => {},
  setSelectedTimeSlot: () => {},
  setCustomerInfo: () => {},
  setVerificationCode: () => {},
  setPaymentMethod: () => {},
  setIsVerified: () => {},
  nextStep: () => {},
  prevStep: () => {},
  goToStep: () => {},
  resetBooking: () => {},
  getTotalPrice: () => 0,
  getDownPaymentAmount: () => 0,
});

export const BookingProvider = ({ children }: { children: ReactNode }) => {
  const [bookingState, setBookingState] = useState<BookingState>(initialState);

  // Down payment percentage (could be moved to system settings in a real app)
  const DOWN_PAYMENT_PERCENTAGE = 0.3;

  const setSelectedBarber = (barber: Barber | null) => {
    setBookingState(prev => ({ ...prev, selectedBarber: barber }));
  };

  const setSelectedService = (service: Service | null) => {
    setBookingState(prev => ({ ...prev, selectedService: service }));
  };

  const setSelectedDate = (date: Date | null) => {
    setBookingState(prev => ({ ...prev, selectedDate: date }));
  };

  const setSelectedTimeSlot = (timeSlot: string | null) => {
    setBookingState(prev => ({ ...prev, selectedTimeSlot: timeSlot }));
  };

  const setCustomerInfo = (info: { name: string; email: string; phone: string } | null) => {
    setBookingState(prev => ({ ...prev, customerInfo: info }));
  };

  const setVerificationCode = (code: string | null) => {
    setBookingState(prev => ({ ...prev, verificationCode: code }));
  };

  const setPaymentMethod = (method: PaymentMethod | null) => {
    setBookingState(prev => ({ ...prev, paymentMethod: method }));
  };

  const setIsVerified = (verified: boolean) => {
    setBookingState(prev => ({ ...prev, isVerified: verified }));
  };

  const nextStep = () => {
    setBookingState(prev => ({ ...prev, currentStep: prev.currentStep + 1 }));
  };

  const prevStep = () => {
    setBookingState(prev => ({ ...prev, currentStep: Math.max(1, prev.currentStep - 1) }));
  };

  const goToStep = (step: number) => {
    setBookingState(prev => ({ ...prev, currentStep: step }));
  };

  const resetBooking = () => {
    setBookingState(initialState);
  };

  const getTotalPrice = () => {
    return bookingState.selectedService?.price || 0;
  };

  const getDownPaymentAmount = () => {
    const totalPrice = getTotalPrice();
    return Math.round(totalPrice * DOWN_PAYMENT_PERCENTAGE);
  };

  return (
    <BookingContext.Provider
      value={{
        bookingState,
        setSelectedBarber,
        setSelectedService,
        setSelectedDate,
        setSelectedTimeSlot,
        setCustomerInfo,
        setVerificationCode,
        setPaymentMethod,
        setIsVerified,
        nextStep,
        prevStep,
        goToStep,
        resetBooking,
        getTotalPrice,
        getDownPaymentAmount,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => useContext(BookingContext);
