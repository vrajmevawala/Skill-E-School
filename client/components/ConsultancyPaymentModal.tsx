import React, { useState, useMemo } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import { Loader2, CheckCircle, AlertCircle, Lock } from "lucide-react";
import { toast } from "sonner";

interface PaymentVerificationResponse {
  paymentId: string;
  status: string;
  message: string;
  success: boolean;
}

const CheckoutForm = ({ clientSecret, paymentId, onSucceeded, onCancel }: { 
  clientSecret: string, 
  paymentId: string,
  onSucceeded: (paymentId: string) => void,
  onCancel: () => void
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !paymentId) {
      toast.error("Payment setup incomplete");
      return;
    }

    setLoading(true);

    try {
      const cardElement = elements.getElement(CardElement);

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement!,
        },
      });

      if (result.error) {
        toast.error(result.error.message || "Payment failed");
        setLoading(false);
      } else if (result.paymentIntent) {
        const status = result.paymentIntent.status;

        if (status === "succeeded") {
          toast.success("Payment successful! Verifying...");
          onSucceeded(paymentId);
        } else if (status === "processing") {
          toast.info("Payment processing...");
          onSucceeded(paymentId);
        } else if (status === "requires_action") {
          toast.error("Payment requires additional confirmation. Please check your card details.");
          setLoading(false);
        } else if (status === "requires_payment_method") {
          toast.error("Payment method could not be processed");
          setLoading(false);
        } else {
          toast.info(`Payment status: ${status}. Please wait for confirmation...`);
          onSucceeded(paymentId);
        }
      } else {
        toast.error("Payment response invalid");
        setLoading(false);
      }
    } catch (error: any) {
      toast.error(error.message || "Payment failed");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="border border-slate-300 rounded-lg p-4 bg-slate-50">
        <CardElement options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#111827',
              fontFamily: 'Inter, system-ui, sans-serif',
              '::placeholder': {
                color: '#9CA3AF',
              },
            },
            invalid: {
              color: '#EF4444',
            },
          },
        }} />
      </div>
      <div className="flex gap-3">
        <button 
          type="button" 
          onClick={onCancel} 
          disabled={loading}
          className="flex-1 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium rounded-lg px-5 py-3 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          disabled={!stripe || loading}
          className="flex-1 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg px-5 py-3 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Pay Now
        </button>
      </div>
      <p className="text-xs text-slate-400 text-center flex items-center justify-center gap-1.5">
        <Lock className="h-3 w-3" /> Payments are secured with 256-bit SSL encryption
      </p>
    </form>
  );
};

export function ConsultancyPaymentModal({ open, onOpenChange, expert, onSuccess }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expert: any;
  onSuccess: () => void;
}) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [publishableKey, setPublishableKey] = useState<string | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const { token } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<PaymentVerificationResponse | null>(null);

  const stripePromise = useMemo(() => {
    return publishableKey ? loadStripe(publishableKey) : null;
  }, [publishableKey]);

  React.useEffect(() => {
    if (!open) {
      // Reset all state when modal closes so it's fresh on next open
      setClientSecret(null);
      setPublishableKey(null);
      setPaymentId(null);
      setPaymentStatus(null);
      setVerifying(false);
      return;
    }
    if (open && expert && !clientSecret) {
      initPayment();
    }
  }, [open, expert]);

  const initPayment = async () => {
    setLoading(true);
    setPaymentStatus(null);
    try {
      const res = await api.post(`/consultancy/experts/${expert.id}/create-payment-intent`, {}, token);
      
      // Backend signals user already has access
      if (res.alreadyOwned) {
        toast.success("Booking already unlocked!");
        onSuccess();
        onOpenChange(false);
        return;
      }

      setClientSecret(res.clientSecret);
      setPublishableKey(res.publishableKey);
      setPaymentId(res.paymentId);
      
    } catch (err: any) {
      toast.error(err.message || "Failed to initialize payment");
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  const verifyPaymentAndAccess = async (pId: string) => {
    if (!pId) return;

    setVerifying(true);
    let retryCount = 0;
    const maxRetries = 15;
    const retryDelay = 2000;

    const attemptVerification = async (): Promise<boolean> => {
      try {
        const verification = await api.get(
          `/consultancy/experts/${expert.id}/verify-payment/${pId}`, 
          token
        );
        
        setPaymentStatus(verification);

        if (verification.success) {
          setVerifying(false);
          toast.success("Booking unlocked successfully!");
          await new Promise(r => setTimeout(r, 1500));
          onSuccess();
          onOpenChange(false);
          return true;
        } else if (verification.status === "PENDING" && retryCount < maxRetries) {
          retryCount++;
          await new Promise(r => setTimeout(r, retryDelay));
          return attemptVerification();
        } else if (verification.status === "PENDING" && retryCount >= maxRetries) {
          setVerifying(false);
          toast.error("Payment verification timeout. Please refresh the page.");
          return false;
        } else {
          setVerifying(false);
          toast.error(verification.message || "Payment verification failed");
          return false;
        }
      } catch (err: any) {
        if (retryCount < maxRetries) {
          retryCount++;
          await new Promise(r => setTimeout(r, retryDelay));
          return attemptVerification();
        }
        
        setVerifying(false);
        toast.error(err.message || "Failed to verify payment");
        return false;
      }
    };

    await attemptVerification();
  };

  if (paymentStatus?.success) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px] rounded-2xl p-8">
          <div className="flex flex-col items-center space-y-4 py-6">
            <div className="h-16 w-16 bg-emerald-50 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-emerald-600" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="font-bold text-xl text-slate-900">Access Granted!</h3>
              <p className="text-sm text-slate-500">
                You can now book your consultation session.
              </p>
            </div>
            {verifying ? (
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Setting up your access...
              </div>
            ) : (
              <button 
                className="w-full bg-primary hover:bg-primary/90 text-white font-medium rounded-lg px-5 py-3 transition-colors cursor-pointer"
                onClick={() => onOpenChange(false)}
              >
                Continue
              </button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (paymentStatus?.status === "PENDING") {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px] rounded-2xl p-8">
          <div className="flex flex-col items-center space-y-6 py-8">
            <div className="relative">
              <div className="absolute inset-0 bg-primary rounded-full opacity-20 animate-pulse" />
              <Loader2 className="h-16 w-16 text-primary animate-spin relative" />
            </div>
            <div className="text-center space-y-3">
              <h3 className="font-bold text-lg text-slate-900">Payment Processing</h3>
              <p className="text-sm text-slate-500">
                Your payment is being confirmed. This usually takes a few seconds...
              </p>
              <p className="text-xs text-primary font-medium">
                Please keep this window open
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (paymentStatus && paymentStatus.status === "FAILED") {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px] rounded-2xl p-8">
          <div className="flex flex-col items-center space-y-4 py-6">
            <div className="h-16 w-16 bg-red-50 rounded-full flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="font-bold text-lg text-slate-900">Payment {paymentStatus.status}</h3>
              <p className="text-sm text-slate-500">
                {paymentStatus.message}
              </p>
            </div>
            <div className="flex flex-col gap-2 w-full">
              <button 
                className="w-full bg-primary hover:bg-primary/90 text-white font-medium rounded-lg px-5 py-3 transition-colors cursor-pointer" 
                onClick={() => initPayment()}
              >
                Try Again
              </button>
              <button 
                className="w-full bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium rounded-lg px-5 py-3 transition-colors cursor-pointer" 
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] rounded-2xl p-8">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-slate-900">Complete Purchase</DialogTitle>
          <DialogDescription className="text-sm text-slate-500">
            You are unlocking the booking link for <strong className="text-slate-900">₹{expert?.hourlyRate}</strong>
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : clientSecret && stripePromise && paymentId ? (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm 
              clientSecret={clientSecret} 
              paymentId={paymentId}
              onSucceeded={verifyPaymentAndAccess}
              onCancel={() => onOpenChange(false)}
            />
          </Elements>
        ) : (
          <div className="text-center p-4 text-slate-500 text-sm">
            Initializing payment...
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
