import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Phone, Mail, Loader2 } from 'lucide-react';
import { useBooking } from '@/hooks/useBooking';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CustomerInformationProps {
  onNext: () => void;
}

const customerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

const CustomerInformation = ({ onNext }: CustomerInformationProps) => {
  const { bookingState, setCustomerInfo } = useBooking();
  const { customerInfo } = bookingState;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: customerInfo?.name || '',
      email: customerInfo?.email || '',
      phone: customerInfo?.phone || '',
    },
  });

  const onSubmit = async (data: CustomerFormValues) => {
    setIsSubmitting(true);
    
    try {
      // In a real app, validate customer information with API
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API call
      
      setCustomerInfo({
        name: data.name,
        email: data.email,
        phone: data.phone,
      });
      
      onNext();
    } catch (error) {
      console.error('Error submitting customer information:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-heading font-bold">Your Information</h2>
        <p className="text-muted-foreground mt-2">
          Please provide your contact details for your booking
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Name field */}
        <div className="space-y-2">
          <Label htmlFor="name" className="flex items-center">
            <User className="h-4 w-4 mr-2 text-accent" />
            Full Name
          </Label>
          <Input
            id="name"
            placeholder="Enter your full name"
            className={errors.name ? 'border-destructive' : ''}
            disabled={isSubmitting}
            {...register('name')}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        {/* Email field */}
        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center">
            <Mail className="h-4 w-4 mr-2 text-accent" />
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email address"
            className={errors.email ? 'border-destructive' : ''}
            disabled={isSubmitting}
            {...register('email')}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        {/* Phone field */}
        <div className="space-y-2">
          <Label htmlFor="phone" className="flex items-center">
            <Phone className="h-4 w-4 mr-2 text-accent" />
            Phone Number
          </Label>
          <Input
            id="phone"
            placeholder="Enter your phone number"
            className={errors.phone ? 'border-destructive' : ''}
            disabled={isSubmitting}
            {...register('phone')}
          />
          {errors.phone && (
            <p className="text-sm text-destructive">{errors.phone.message}</p>
          )}
        </div>

        <div className="pt-6 text-center">
          <button
            type="submit"
            className="px-6 py-2 bg-accent text-accent-foreground rounded-md font-medium hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin inline" />
                Submitting...
              </>
            ) : (
              'Continue'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomerInformation;
