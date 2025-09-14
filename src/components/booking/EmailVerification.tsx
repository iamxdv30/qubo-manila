import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Loader2, RefreshCw } from 'lucide-react';
import { useBooking } from '@/hooks/useBooking';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface EmailVerificationProps {
  onNext: () => void;
}

const verificationSchema = z.object({
  code: z.string().length(6, 'Verification code must be 6 digits'),
});

type VerificationFormValues = z.infer<typeof verificationSchema>;

const EmailVerification = ({ onNext }: EmailVerificationProps) => {
  const { bookingState, setVerificationCode, setIsVerified } = useBooking();
  const { customerInfo, verificationCode } = bookingState;
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerificationFormValues>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      code: verificationCode || '',
    },
  });

  const sendVerificationCode = useCallback(async (code: string) => {
    if (!customerInfo?.email) {
      setError('No email address provided');
      return;
    }
    
    setIsSending(true);
    setError(null);
    
    try {
      // In a real app, this would call an API to send the code
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      // For demo purposes, log the code to console
      console.log(`Verification code for ${customerInfo.email}: ${code}`);
      
      setIsCodeSent(true);
      setResendTimer(60); // 60 seconds cooldown for resend
    } catch (error) {
      setError('Failed to send verification code');
      console.error('Error sending verification code:', error);
    } finally {
      setIsSending(false);
    }
  }, [customerInfo?.email]);

  useEffect(() => {
    // Generate a random 6-digit code on component mount
    const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(randomCode);
    
    // In a real app, this would be sent via API
    sendVerificationCode(randomCode);
  }, [sendVerificationCode]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const handleResendCode = () => {
    // Generate a new code and send it
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(newCode);
    sendVerificationCode(newCode);
  };

  const onSubmit = async (data: VerificationFormValues) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      // In a real app, verify the code with an API
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API call
      
      if (data.code === generatedCode) {
        setVerificationCode(data.code);
        setIsVerified(true);
        onNext();
      } else {
        setError('Invalid verification code');
      }
    } catch (error) {
      setError('Failed to verify code');
      console.error('Error verifying code:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-heading font-bold">Verify Your Email</h2>
        <p className="text-muted-foreground mt-2">
          We've sent a 6-digit verification code to {customerInfo?.email}
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center">
            <Mail className="h-8 w-8 text-accent" />
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="code" className="text-center block">
              Enter the 6-digit code
            </Label>
            <Input
              id="code"
              placeholder="000000"
              className={`text-center text-lg ${errors.code ? 'border-destructive' : ''}`}
              maxLength={6}
              disabled={isSubmitting || !isCodeSent}
              {...register('code')}
            />
            {errors.code && (
              <p className="text-sm text-destructive text-center">{errors.code.message}</p>
            )}
          </div>

          <div className="text-center">
            {isCodeSent ? (
              <p className="text-sm text-muted-foreground">
                Didn't receive a code?{' '}
                {resendTimer > 0 ? (
                  <span>Resend in {resendTimer}s</span>
                ) : (
                  <button
                    type="button"
                    className="text-accent hover:text-accent/80 font-medium"
                    onClick={handleResendCode}
                    disabled={isSending}
                  >
                    Resend Code
                  </button>
                )}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                {isSending ? 'Sending verification code...' : 'Preparing verification...'}
              </p>
            )}
          </div>

          <div className="pt-6 text-center">
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || !isCodeSent}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify and Continue'
              )}
            </Button>
          </div>
        </form>
      </div>

      <div className="text-center text-sm text-muted-foreground">
        <p>
          For demo purposes, the verification code is logged to the browser console.
          <br />
          In a real application, this would be sent via email.
        </p>
      </div>
    </div>
  );
};

export default EmailVerification;
