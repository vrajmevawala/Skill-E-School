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
import { PaymentVerificationResponse } from "@shared/api";

const CheckoutForm = ({ clientSecret, courseId, paymentId, onSucceeded, onCancel }: { 
  clientSecret: string, 
  courseId: string,
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

      console.log(`[CheckoutForm] Confirming payment with Stripe for paymentId: ${paymentId}`);
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement!,
        },
      });

      console.log(`[CheckoutForm] Stripe response:`, {
        error: result.error?.message,
        status: result.paymentIntent?.status,
        paymentIntentId: result.paymentIntent?.id,
      });

      if (result.error) {
        console.error(`[CheckoutForm] Payment error:`, result.error.message);
        toast.error(result.error.message || "Payment failed");
        setLoading(false);
      } else if (result.paymentIntent) {
        const status = result.paymentIntent.status;
        console.log(`[CheckoutForm] PaymentIntent status: ${status}`);

        if (status === "succeeded") {
          console.log(`[CheckoutForm] ✓ Payment succeeded! Starting verification...`);
          toast.success("Payment successful! Verifying...");
          onSucceeded(paymentId);
        } else if (status === "processing") {
          console.log(`[CheckoutForm] Payment is processing, will verify status...`);
          toast.info("Payment processing...");
          onSucceeded(paymentId);
        } else if (status === "requires_action") {
          console.error(`[CheckoutForm] Payment requires additional action (3D Secure)`);
          toast.error("Payment requires additional confirmation. Please check your card details.");
          setLoading(false);
        } else if (status === "requires_payment_method") {
          console.error(`[CheckoutForm] Payment method required`);
          toast.error("Payment method could not be processed");
          setLoading(false);
        } else {
          console.warn(`[CheckoutForm] Unknown payment status: ${status}`);
          toast.info(`Payment status: ${status}. Please wait for confirmation...`);
          onSucceeded(paymentId);
        }
      } else {
        console.error(`[CheckoutForm] No payment intent in response`);
        toast.error("Payment response invalid");
        setLoading(false);
      }
    } catch (error: any) {
      console.error(`[CheckoutForm] Exception during payment:`, error);
      toast.error(error.message || "Payment failed");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
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
          className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg px-5 py-3 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          disabled={!stripe || loading}
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg px-5 py-3 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Pay Now
        </button>
      </div>
      <p className="text-xs text-gray-400 text-center flex items-center justify-center gap-1.5">
        <Lock className="h-3 w-3" /> Payments are secured with 256-bit SSL encryption
      </p>
    </form>
  );
};

export function PaymentModal({ open, onOpenChange, course, onSuccess }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course: any;
  onSuccess: () => void;
}) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [publishableKey, setPublishableKey] = useState<string | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const { token } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<PaymentVerificationResponse | null>(null);

  // Memoize stripe promise to prevent unnecessary re-renders
  const stripePromise = useMemo(() => {
    return publishableKey ? loadStripe(publishableKey) : null;
  }, [publishableKey]);

  React.useEffect(() => {
    if (open && course && !clientSecret) {
      initPayment();
    }
  }, [open, course, clientSecret]);

  const initPayment = async () => {
    setLoading(true);
    setPaymentStatus(null);
    try {
      const res = await api.post(`/courses/${course.id}/create-payment-intent`, {}, token);
      console.log(`[PaymentModal] Payment initialized:`, res);
      
      setClientSecret(res.clientSecret);
      setPublishableKey(res.publishableKey);
      setPaymentId(res.paymentId);
      
    } catch (err: any) {
      console.error(`[PaymentModal] Init error:`, err);
      toast.error(err.message || "Failed to initialize payment");
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  const verifyPaymentAndAccessCourse = async (pId: string) => {
    if (!pId) {
      toast.error("Payment ID missing");
      return;
    }

    setVerifying(true);
    let retryCount = 0;
    const maxRetries = 30;
    const retryDelay = 1000;

    const attemptVerification = async (): Promise<boolean> => {
      try {
        console.log(`[PaymentModal] Verifying payment: ${pId} for course: ${course.id} (attempt ${retryCount + 1}/${maxRetries})`);
        
        const verification = await api.get(
          `/courses/${course.id}/verify-payment/${pId}`, 
          token
        );
        
        console.log(`[PaymentModal] Verification result:`, verification);
        setPaymentStatus(verification);

        if (verification.success) {
          console.log(`[PaymentModal] Payment verified, checking access...`);
          const accessResponse = await api.get(`/courses/${course.id}/access`, token);
          console.log(`[PaymentModal] Access response:`, accessResponse);

          if (accessResponse.canAccessContent) {
            setVerifying(false);
            toast.success("Course content is now available!");
            await new Promise(r => setTimeout(r, 2000));
            onSuccess();
            onOpenChange(false);
            return true;
          } else {
            setVerifying(false);
            toast.error("Enrollment created but access verification failed");
            return false;
          }
        } else if (verification.status === "PENDING" && retryCount < maxRetries) {
          console.log(`[PaymentModal] Payment still PENDING, retrying in ${retryDelay}ms... (${retryCount + 1}/${maxRetries})`);
          retryCount++;
          await new Promise(r => setTimeout(r, retryDelay));
          return attemptVerification();
        } else if (verification.status === "PENDING" && retryCount >= maxRetries) {
          setVerifying(false);
          toast.error("Payment verification timeout. Please refresh and check your course access.");
          return false;
        } else {
          setVerifying(false);
          toast.error(verification.message || "Payment verification failed");
          return false;
        }
      } catch (err: any) {
        console.error(`[PaymentModal] Verification error (attempt ${retryCount + 1}):`, err);
        
        if (retryCount < maxRetries && (err.message?.includes("Network") || err.message?.includes("Failed to fetch"))) {
          console.log(`[PaymentModal] Network error, retrying...`);
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

  // Show success status after payment
  if (paymentStatus?.success) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px] rounded-2xl p-8">
          <div className="flex flex-col items-center space-y-4 py-6">
            <div className="h-16 w-16 bg-emerald-50 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-emerald-600" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="font-bold text-xl text-gray-900">Access Granted!</h3>
              <p className="text-sm text-gray-500">
                You now have access to "{course?.title}"
              </p>
              <p className="text-xs text-gray-400 mt-4">
                All lessons and resources are available under "My Courses"
              </p>
            </div>
            {verifying ? (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Setting up your access...
              </div>
            ) : (
              <button 
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg px-5 py-3 transition-colors cursor-pointer"
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

  // Show pending status - waiting for webhook
  if (paymentStatus?.status === "PENDING") {
    const isTestMode = publishableKey?.includes("pk_test_");
    
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px] rounded-2xl p-8">
          <div className="flex flex-col items-center space-y-6 py-8">
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500 rounded-full opacity-20 animate-pulse" />
              <Loader2 className="h-16 w-16 text-indigo-600 animate-spin relative" />
            </div>
            <div className="text-center space-y-3">
              <h3 className="font-bold text-lg text-gray-900">Payment Processing</h3>
              <p className="text-sm text-gray-500">
                Your payment is being confirmed. This usually takes a few seconds...
              </p>
              <p className="text-xs text-indigo-600 font-medium">
                Please keep this window open
              </p>
            </div>
            <div className="w-full space-y-2">
              {isTestMode && (
                <button 
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg px-5 py-3 transition-colors cursor-pointer flex items-center justify-center gap-2" 
                  onClick={async () => {
                    try {
                      await api.post(
                        `/courses/${course.id}/test-confirm-payment/${paymentStatus.paymentId}`,
                        {},
                        token
                      );
                      toast.success("Payment confirmed (test mode)");
                      await verifyPaymentAndAccessCourse(paymentStatus.paymentId);
                    } catch (err: any) {
                      toast.error(err.message || "Failed to confirm payment");
                    }
                  }}
                >
                  <Loader2 className="h-4 w-4" />
                  Confirm Payment (Test)
                </button>
              )}
              <button 
                className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg px-5 py-3 transition-colors cursor-pointer disabled:opacity-50"
                onClick={() => onOpenChange(false)}
                disabled={verifying}
              >
                Close Window
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Show error/failed status
  if (paymentStatus && paymentStatus.status === "FAILED") {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px] rounded-2xl p-8">
          <div className="flex flex-col items-center space-y-4 py-6">
            <div className="h-16 w-16 bg-red-50 rounded-full flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="font-bold text-lg text-gray-900">Payment {paymentStatus.status}</h3>
              <p className="text-sm text-gray-500">
                {paymentStatus.message}
              </p>
            </div>
            <div className="flex flex-col gap-2 w-full">
              <button 
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg px-5 py-3 transition-colors cursor-pointer" 
                onClick={() => initPayment()}
              >
                Try Again
              </button>
              <button 
                className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg px-5 py-3 transition-colors cursor-pointer" 
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
          <DialogTitle className="text-lg font-bold text-gray-900">Complete Purchase</DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            You are purchasing <strong className="text-gray-900">{course?.title}</strong> for <strong className="text-indigo-600">₹{course?.price}</strong>
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          </div>
        ) : clientSecret && stripePromise && paymentId ? (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm 
              clientSecret={clientSecret} 
              courseId={course.id}
              paymentId={paymentId}
              onSucceeded={verifyPaymentAndAccessCourse}
              onCancel={() => onOpenChange(false)}
            />
          </Elements>
        ) : (
          <div className="text-center p-4 text-gray-500 text-sm">
            Initializing payment...
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
