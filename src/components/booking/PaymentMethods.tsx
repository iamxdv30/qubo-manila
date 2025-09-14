import { useState } from 'react';
import { useBooking } from '@/hooks/useBooking';
import { PaymentMethod } from '@/types';
import { CreditCard, Smartphone, Loader2 } from 'lucide-react';

interface PaymentMethodsProps {
  onNext: () => void;
}

const PaymentMethods = ({ onNext }: PaymentMethodsProps) => {
  const { bookingState, setPaymentMethod, getDownPaymentAmount } = useBooking();
  const { paymentMethod } = bookingState;
  
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(paymentMethod);
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const downPayment = getDownPaymentAmount();

  const handlePaymentMethodSelect = (method: PaymentMethod) => {
    setSelectedMethod(method);
    setPaymentMethod(method);
  };

  const formatCardNumber = (value: string) => {
    return value
      .replace(/\s/g, '')
      .replace(/(\d{4})/g, '$1 ')
      .trim()
      .slice(0, 19);
  };

  const formatExpiry = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1/$2')
      .slice(0, 5);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMethod) return;
    
    setIsProcessing(true);
    
    try {
      // In a real app, process payment with API
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      // Payment successful
      onNext();
    } catch (error) {
      console.error('Payment processing error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-heading font-bold">Payment Method</h2>
        <p className="text-muted-foreground mt-2">
          Select your preferred payment method for the down payment
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* GCash */}
        <div 
          className={`
            p-4 border rounded-lg cursor-pointer transition-all
            ${selectedMethod === 'gcash' 
              ? 'border-accent bg-accent/5 shadow-md' 
              : 'border-border hover:border-accent/50'
            }
          `}
          onClick={() => handlePaymentMethodSelect('gcash')}
        >
          <div className="flex items-center">
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center
              ${selectedMethod === 'gcash' 
                ? 'bg-blue-500 text-white' 
                : 'bg-muted text-muted-foreground'
              }
            `}>
              <Smartphone className="h-5 w-5" />
            </div>
            <div className="ml-4">
              <h3 className="font-medium">GCash</h3>
              <p className="text-sm text-muted-foreground">Pay with your GCash account</p>
            </div>
          </div>
        </div>

        {/* Maya */}
        <div 
          className={`
            p-4 border rounded-lg cursor-pointer transition-all
            ${selectedMethod === 'maya' 
              ? 'border-accent bg-accent/5 shadow-md' 
              : 'border-border hover:border-accent/50'
            }
          `}
          onClick={() => handlePaymentMethodSelect('maya')}
        >
          <div className="flex items-center">
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center
              ${selectedMethod === 'maya' 
                ? 'bg-green-500 text-white' 
                : 'bg-muted text-muted-foreground'
              }
            `}>
              <Smartphone className="h-5 w-5" />
            </div>
            <div className="ml-4">
              <h3 className="font-medium">Maya</h3>
              <p className="text-sm text-muted-foreground">Pay with your Maya account</p>
            </div>
          </div>
        </div>

        {/* Credit/Debit Card */}
        <div 
          className={`
            p-4 border rounded-lg cursor-pointer transition-all md:col-span-2
            ${selectedMethod === 'card' 
              ? 'border-accent bg-accent/5 shadow-md' 
              : 'border-border hover:border-accent/50'
            }
          `}
          onClick={() => handlePaymentMethodSelect('card')}
        >
          <div className="flex items-center">
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center
              ${selectedMethod === 'card' 
                ? 'bg-accent text-accent-foreground' 
                : 'bg-muted text-muted-foreground'
              }
            `}>
              <CreditCard className="h-5 w-5" />
            </div>
            <div className="ml-4">
              <h3 className="font-medium">Credit/Debit Card</h3>
              <p className="text-sm text-muted-foreground">Pay with Visa, Mastercard, or other cards</p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Form based on selected method */}
      {selectedMethod && (
        <div className="mt-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {selectedMethod === 'gcash' && (
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="font-medium mb-4">GCash Payment</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  In a real application, you would be redirected to GCash to complete your payment.
                  For this demo, just click the button below to simulate payment.
                </p>
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-4">
                  <p className="text-sm font-medium text-blue-500">Amount to Pay: ₱{downPayment.toFixed(2)}</p>
                </div>
              </div>
            )}

            {selectedMethod === 'maya' && (
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="font-medium mb-4">Maya Payment</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  In a real application, you would be redirected to Maya to complete your payment.
                  For this demo, just click the button below to simulate payment.
                </p>
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-4">
                  <p className="text-sm font-medium text-green-500">Amount to Pay: ₱{downPayment.toFixed(2)}</p>
                </div>
              </div>
            )}

            {selectedMethod === 'card' && (
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="font-medium mb-4">Card Payment</h3>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="cardNumber" className="block text-sm font-medium mb-1">
                      Card Number
                    </label>
                    <input
                      id="cardNumber"
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent/50"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      maxLength={19}
                      disabled={isProcessing}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="cardName" className="block text-sm font-medium mb-1">
                      Cardholder Name
                    </label>
                    <input
                      id="cardName"
                      type="text"
                      placeholder="John Doe"
                      className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent/50"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      disabled={isProcessing}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="cardExpiry" className="block text-sm font-medium mb-1">
                        Expiry Date
                      </label>
                      <input
                        id="cardExpiry"
                        type="text"
                        placeholder="MM/YY"
                        className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent/50"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                        maxLength={5}
                        disabled={isProcessing}
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="cardCvc" className="block text-sm font-medium mb-1">
                        CVC
                      </label>
                      <input
                        id="cardCvc"
                        type="text"
                        placeholder="123"
                        className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent/50"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, '').slice(0, 3))}
                        maxLength={3}
                        disabled={isProcessing}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-6 text-center">
              <button
                type="submit"
                className="px-6 py-2 bg-accent text-accent-foreground rounded-md font-medium hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 inline animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  `Pay ₱${downPayment.toFixed(2)}`
                )}
              </button>
              <p className="text-xs text-muted-foreground mt-2">
                This is a demo. No actual payment will be processed.
              </p>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default PaymentMethods;
