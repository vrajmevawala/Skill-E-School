import React, { useState, useMemo } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
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
          // Pass the payment ID to parent for verification
          onSucceeded(paymentId);
        } else if (status === "processing") {
          console.log(`[CheckoutForm] Payment is processing, will verify status...`);
          toast.info("Payment processing...");
          onSucceeded(paymentId); // Still trigger verification for processing payments
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
          onSucceeded(paymentId); // Still attempt verification
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-3 border rounded-md bg-white">
        <CardElement options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#424770',
              '::placeholder': {
                color: '#aab7c4',
              },
            },
            invalid: {
              color: '#9e2146',
            },
          },
        }} />
      </div>
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={!stripe || loading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Pay Now
        </Button>
      </div>
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
      setPaymentId(res.paymentId); // Store the payment ID from backend
      
    } catch (err: any) {
      console.error(`[PaymentModal] Init error:`, err);
      toast.error(err.message || "Failed to initialize payment");
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Verify payment status and check if enrollment is complete
   * This is called after successful payment from Stripe
   * Includes retry logic for webhook processing
   */
  const verifyPaymentAndAccessCourse = async (pId: string) => {
    if (!pId) {
      toast.error("Payment ID missing");
      return;
    }

    setVerifying(true);
    let retryCount = 0;
    const maxRetries = 30; // Try for up to 2.5 minutes (30 * 1 second)
    const retryDelay = 1000; // 1 second between retries

    const attemptVerification = async (): Promise<boolean> => {
      try {
        // First, verify the payment status with the server
        console.log(`[PaymentModal] Verifying payment: ${pId} for course: ${course.id} (attempt ${retryCount + 1}/${maxRetries})`);
        
        const verification = await api.get(
          `/courses/${course.id}/verify-payment/${pId}`, 
          token
        );
        
        console.log(`[PaymentModal] Verification result:`, verification);
        setPaymentStatus(verification);

        if (verification.success) {
          // Payment successful, now check course access with full details
          console.log(`[PaymentModal] Payment verified, checking access...`);
          const accessResponse = await api.get(`/courses/${course.id}/access`, token);
          console.log(`[PaymentModal] Access response:`, accessResponse);

          if (accessResponse.canAccessContent) {
            setVerifying(false);
            toast.success("Course content is now available!");
            // Show success message for 2 seconds before closing
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
          // Payment still processing, retry after delay (silently keep retrying)
          console.log(`[PaymentModal] Payment still PENDING, retrying in ${retryDelay}ms... (${retryCount + 1}/${maxRetries})`);
          retryCount++;
          await new Promise(r => setTimeout(r, retryDelay));
          return attemptVerification(); // Retry recursively
        } else if (verification.status === "PENDING" && retryCount >= maxRetries) {
          // Max retries reached while still pending
          setVerifying(false);
          toast.error("Payment verification timeout. Please refresh and check your course access.");
          return false;
        } else {
          // Payment failed
          setVerifying(false);
          toast.error(verification.message || "Payment verification failed");
          return false;
        }
      } catch (err: any) {
        console.error(`[PaymentModal] Verification error (attempt ${retryCount + 1}):`, err);
        
        // Retry on network errors
        if (retryCount < maxRetries && (err.message?.includes("Network") || err.message?.includes("Failed to fetch"))) {
          console.log(`[PaymentModal] Network error, retrying...`);
          retryCount++;
          await new Promise(r => setTimeout(r, retryDelay));
          return attemptVerification(); // Retry recursively
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
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Payment Successful</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4 py-8">
            <CheckCircle className="h-16 w-16 text-green-600" />
            <div className="text-center space-y-2">
              <h3 className="font-semibold text-lg">Access Granted!</h3>
              <p className="text-sm text-muted-foreground">
                You now have access to "{course?.title}"
              </p>
              <p className="text-xs text-muted-foreground mt-4">
                All lessons and resources are available under "My Courses"
              </p>
            </div>
            {verifying && (
              <div className="flex items-center gap-2 text-sm">
                <Loader2 className="h-4 w-4 animate-spin" />
                Setting up your access...
              </div>
            )}
            {!verifying && (
              <Button className="w-full" onClick={() => onOpenChange(false)}>
                Continue
              </Button>
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
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Processing Payment</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-6 py-12">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 rounded-full opacity-20 animate-pulse" />
              <Loader2 className="h-16 w-16 text-blue-600 animate-spin relative" />
            </div>
            <div className="text-center space-y-3">
              <h3 className="font-bold text-lg">Payment Processing</h3>
              <p className="text-sm text-muted-foreground">
                Your payment is being confirmed. This usually takes a few seconds...
              </p>
              <p className="text-xs text-muted-foreground text-blue-600 font-medium">
                Please keep this window open
              </p>
            </div>
            <div className="w-full space-y-2">
              {isTestMode && (
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700" 
                  onClick={async () => {
                    try {
                      await api.post(
                        `/courses/${course.id}/test-confirm-payment/${paymentStatus.paymentId}`,
                        {},
                        token
                      );
                      toast.success("Payment confirmed (test mode)");
                      // Retry verification
                      await verifyPaymentAndAccessCourse(paymentStatus.paymentId);
                    } catch (err: any) {
                      toast.error(err.message || "Failed to confirm payment");
                    }
                  }}
                >
                  <Loader2 className="mr-2 h-4 w-4" />
                  Confirm Payment (Test)
                </Button>
              )}
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => onOpenChange(false)}
                disabled={verifying}
              >
                Close Window
              </Button>
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
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Payment Failed</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4 py-8">
            <AlertCircle className="h-16 w-16 text-red-600" />
            <div className="text-center space-y-2">
              <h3 className="font-semibold text-lg">Payment {paymentStatus.status}</h3>
              <p className="text-sm text-muted-foreground">
                {paymentStatus.message}
              </p>
            </div>
            <div className="flex gap-3 w-full flex-col">
              <Button className="w-full" onClick={() => initPayment()}>
                Try Again
              </Button>
              <Button variant="outline" className="w-full" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Complete Purchase</DialogTitle>
          <DialogDescription>
            You are purchasing <strong>{course?.title}</strong> for ₹{course?.price}
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
              courseId={course.id}
              paymentId={paymentId}
              onSucceeded={verifyPaymentAndAccessCourse}
              onCancel={() => onOpenChange(false)}
            />
          </Elements>
        ) : (
          <div className="text-center p-4 text-muted-foreground">
            Initializing payment...
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

