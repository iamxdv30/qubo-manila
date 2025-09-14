import { useState } from 'react';
import { 
  CreditCard, 
  Smartphone, 
  Banknote, 
  Loader2, 
  CheckCircle, 
  XCircle 
} from 'lucide-react';
import { PaymentMethod } from '@/types';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  customerName: string;
  serviceName: string;
  totalAmount: number;
  remainingAmount: number;
  onPaymentComplete?: (bookingId: string, method: PaymentMethod, amount: number) => void;
}

const PaymentModal = ({
  isOpen,
  onClose,
  bookingId,
  customerName,
  serviceName,
  totalAmount,
  remainingAmount,
  onPaymentComplete,
}: PaymentModalProps) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [amount, setAmount] = useState<number>(remainingAmount);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');

  const resetState = () => {
    setPaymentMethod('cash');
    setAmount(remainingAmount);
    setIsProcessing(false);
    setIsSuccess(false);
    setIsError(false);
    setCardNumber('');
    setCardName('');
    setCardExpiry('');
    setCardCvc('');
    setReferenceNumber('');
  };

  const handleClose = () => {
    resetState();
    onClose();
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

  const handleSubmit = async () => {
    setIsProcessing(true);
    setIsSuccess(false);
    setIsError(false);
    
    try {
      // In a real app, this would call an API to process the payment
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      // For demo purposes, always succeed
      setIsSuccess(true);
      
      if (onPaymentComplete) {
        onPaymentComplete(bookingId, paymentMethod, amount);
      }
    } catch (error) {
      console.error('Payment error:', error);
      setIsError(true);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Process Payment</DialogTitle>
          <DialogDescription>
            Complete payment for {customerName}'s {serviceName}
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="py-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </div>
            <h3 className="text-lg font-medium mb-2">Payment Successful</h3>
            <p className="text-muted-foreground mb-6">
              Payment of ₱{amount.toFixed(2)} has been processed successfully.
            </p>
            <Button onClick={handleClose}>Close</Button>
          </div>
        ) : isError ? (
          <div className="py-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
            </div>
            <h3 className="text-lg font-medium mb-2">Payment Failed</h3>
            <p className="text-muted-foreground mb-6">
              There was an error processing your payment. Please try again.
            </p>
            <div className="flex gap-4 justify-center">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={() => {
                setIsError(false);
              }}>
                Try Again
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="py-4">
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">Total Amount:</span>
                  <span className="font-medium">₱{totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">Remaining Amount:</span>
                  <span className="font-medium">₱{remainingAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Amount to Pay:</span>
                  <div className="flex items-center">
                    <span className="mr-2">₱</span>
                    <Input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="w-24 text-right"
                      min={0}
                      max={remainingAmount}
                      disabled={isProcessing}
                    />
                  </div>
                </div>
              </div>

              <Tabs defaultValue="cash" onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}>
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger value="cash">Cash</TabsTrigger>
                  <TabsTrigger value="card">Card</TabsTrigger>
                  <TabsTrigger value="gcash">GCash/Maya</TabsTrigger>
                </TabsList>
                
                {/* Cash Payment */}
                <TabsContent value="cash" className="mt-4">
                  <div className="flex items-center justify-center py-6">
                    <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mr-4">
                      <Banknote className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                      <h3 className="font-medium">Cash Payment</h3>
                      <p className="text-sm text-muted-foreground">
                        Collect ₱{amount.toFixed(2)} from the customer
                      </p>
                    </div>
                  </div>
                </TabsContent>
                
                {/* Card Payment */}
                <TabsContent value="card" className="mt-4 space-y-4">
                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      disabled={isProcessing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cardName">Cardholder Name</Label>
                    <Input
                      id="cardName"
                      placeholder="John Doe"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      disabled={isProcessing}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="cardExpiry">Expiry Date</Label>
                      <Input
                        id="cardExpiry"
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                        disabled={isProcessing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cardCvc">CVC</Label>
                      <Input
                        id="cardCvc"
                        placeholder="123"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, '').slice(0, 3))}
                        disabled={isProcessing}
                      />
                    </div>
                  </div>
                </TabsContent>
                
                {/* GCash/Maya Payment */}
                <TabsContent value="gcash" className="mt-4 space-y-4">
                  <div className="flex items-center justify-center py-2">
                    <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mr-4">
                      <Smartphone className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="font-medium">GCash/Maya Payment</h3>
                      <p className="text-sm text-muted-foreground">
                        Enter the reference number from the customer's payment
                      </p>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="referenceNumber">Reference Number</Label>
                    <Input
                      id="referenceNumber"
                      placeholder="e.g. 1234567890"
                      value={referenceNumber}
                      onChange={(e) => setReferenceNumber(e.target.value)}
                      disabled={isProcessing}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleClose} disabled={isProcessing}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={isProcessing || amount <= 0 || amount > remainingAmount}>
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Pay ₱${amount.toFixed(2)}`
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
