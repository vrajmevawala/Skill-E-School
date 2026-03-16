import Stripe from "stripe";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/app-error";
import "dotenv/config";

const getStripe = () => {
  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecret) {
      console.warn("⚠️ STRIPE_SECRET_KEY is not defined in environment variables.");
  }
  return new Stripe(stripeSecret || "sk_test_fake", {
    apiVersion: "2024-12-18.acacia" as any,
  });
};

export class PaymentService {
  static async createPaymentIntent(courseId: string, userId: string) {
    try {
      const stripe = getStripe();
      
      console.log(`[PaymentService] Creating intent for Course: ${courseId}, User: ${userId}`);

      const course = await prisma.course.findUnique({
        where: { id: courseId },
      });

      if (!course) {
        console.error(`[PaymentService] Course not found: ${courseId}`);
        throw new AppError("Course not found", 404);
      }

      console.log(`[PaymentService] Course details: ${course.title}, Price: ${course.price}`);

      if (course.isFree || course.price <= 0) {
        throw new AppError("Course is free, no payment needed", 400);
      }

      // Check if already enrolled
      const existingEnrollment = await prisma.enrollment.findUnique({
        where: { userId_courseId: { userId, courseId } },
      });

      if (existingEnrollment && existingEnrollment.status === "COMPLETED") {
        throw new AppError("Already enrolled in this course", 400);
      }

      // Create session or payment intent
      console.log(`[PaymentService] Calling Stripe API...`);
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(course.price * 100), 
        currency: "inr",
        metadata: {
          userId,
          courseId,
          type: "COURSE_PURCHASE",
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      console.log(`[PaymentService] Stripe PaymentIntent created: ${paymentIntent.id}`);

      // Create a pending payment record
      const payment = await prisma.payment.create({
        data: {
          amount: course.price,
          currency: "INR",
          status: "PENDING",
          provider: "STRIPE",
          providerId: paymentIntent.id,
          userId,
        },
      });

      console.log(`[PaymentService] Payment record created: ${payment.id}`);

      return {
        paymentId: payment.id,
        clientSecret: paymentIntent.client_secret,
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
      };
    } catch (error: any) {
      console.error("[PaymentService] Critical Error:", {
        message: error.message,
        stack: error.stack,
        stripeCode: error.code,
        stripeType: error.type
      });
      if (error instanceof AppError) throw error;
      throw new AppError(error.message || "Failed to create payment intent", 500);
    }
  }

  static async handleWebhook(sig: string, payload: Buffer) {
    let event;
    const stripe = getStripe();

    try {
      event = stripe.webhooks.constructEvent(
        payload,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err: any) {
      console.error(`[PaymentService] Webhook signature verification failed:`, err.message);
      throw new AppError(`Webhook Error: ${err.message}`, 400);
    }

    console.log(`[PaymentService] Webhook received - Type: ${event.type}`);

    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const { userId, courseId } = paymentIntent.metadata;

      console.log(`[PaymentService] Processing payment_intent.succeeded webhook - userId: ${userId}, courseId: ${courseId}, paymentIntentId: ${paymentIntent.id}`);

      if (userId && courseId) {
        try {
          await this.fulfillOrder(userId, courseId, paymentIntent.id);
          console.log(`[PaymentService] ✓ Webhook fulfillOrder completed`);
        } catch (fulfillError: any) {
          console.error(`[PaymentService] ✗ Webhook fulfillOrder failed:`, fulfillError.message);
          throw fulfillError;
        }
      } else {
        console.warn(`[PaymentService] Webhook missing metadata - userId: ${userId}, courseId: ${courseId}`);
      }
    } else {
      console.log(`[PaymentService] Webhook type not handled: ${event.type}`);
    }

    return { received: true };
  }

  private static async fulfillOrder(userId: string, courseId: string, paymentIntentId: string) {
    console.log(`[PaymentService] fulfillOrder - userId: ${userId}, courseId: ${courseId}, paymentIntentId: ${paymentIntentId}`);
    
    try {
      const result = await prisma.$transaction(async (tx) => {
        // Update payment status
        console.log(`[PaymentService] Updating payment with providerId: ${paymentIntentId}`);
        
        const payment = await tx.payment.update({
          where: { providerId: paymentIntentId },
          data: { status: "SUCCESS" },
        });

        console.log(`[PaymentService] Payment updated - ID: ${payment.id}, Status: ${payment.status}`);

        // Create or update enrollment
        console.log(`[PaymentService] Creating/updating enrollment for userId: ${userId}, courseId: ${courseId}`);
        
        const enrollment = await tx.enrollment.upsert({
          where: { userId_courseId: { userId, courseId } },
          update: {
            status: "COMPLETED",
            paymentId: payment.id,
          },
          create: {
            userId,
            courseId,
            status: "COMPLETED",
            paymentId: payment.id,
          },
        });

        console.log(`[PaymentService] Enrollment created/updated - ID: ${enrollment.id}, Status: ${enrollment.status}`);

        return { payment, enrollment };
      });

      console.log(`[PaymentService] ✓ Order fulfilled successfully - Payment: ${result.payment.id}, Enrollment: ${result.enrollment.id}`);
      return result;
    } catch (error: any) {
      console.error(`[PaymentService] ✗ fulfillOrder failed:`, {
        message: error.message,
        code: error.code,
        stack: error.stack,
      });
      throw error;
    }
  }

  /**
   * Verify payment status and return current enrollment details
   * This is called by the client after payment to check if enrollment is complete
   * Also checks Stripe directly to catch payments that succeeded but webhook hasn't fired yet
   */
  static async verifyPaymentStatus(paymentId: string, userId: string, courseId: string) {
    try {
      console.log(`[PaymentService] Verifying payment: ${paymentId} for user: ${userId}, course: ${courseId}`);

      // Get payment details from database
      const payment = await prisma.payment.findUnique({
        where: { id: paymentId },
      });

      if (!payment) {
        console.error(`[PaymentService] Payment record not found: ${paymentId}`);
        throw new AppError("Payment not found", 404);
      }

      console.log(`[PaymentService] Payment found - Status: ${payment.status}, ProviderId: ${payment.providerId}`);

      // Verify it belongs to the requesting user
      if (payment.userId !== userId) {
        throw new AppError("Unauthorized - payment belongs to different user", 401);
      }

      // If already SUCCESS, return immediately
      if (payment.status === "SUCCESS") {
        console.log(`[PaymentService] Payment already SUCCESS`);
        const enrollment = await prisma.enrollment.findUnique({
          where: { userId_courseId: { userId, courseId } },
        });

        return {
          paymentId: payment.id,
          status: "SUCCESS",
          enrollmentId: enrollment?.id,
          message: "Payment confirmed! Course content is now available.",
          success: enrollment?.status === "COMPLETED",
        };
      }

      // If PENDING, check Stripe directly for real status
      if (payment.status === "PENDING") {
        console.log(`[PaymentService] Payment PENDING, checking Stripe... providerId: ${payment.providerId}`);
        
        if (!payment.providerId) {
          console.error(`[PaymentService] ✗ CRITICAL: No providerId found for payment: ${paymentId}. Cannot check Stripe status.`);
        } else {
          try {
            const stripe = getStripe();
            const secretKey = process.env.STRIPE_SECRET_KEY;
            
            if (!secretKey) {
              console.error(`[PaymentService] ✗ CRITICAL: STRIPE_SECRET_KEY not set in environment variables!`);
            } else {
              console.log(`[PaymentService] Retrieving Stripe payment intent: ${payment.providerId}`);
              
              const stripePayment = await stripe.paymentIntents.retrieve(payment.providerId);
              
              console.log(`[PaymentService] ✓ Stripe API Call Successful - Status: ${stripePayment.status}`);
              console.log(`[PaymentService] Full Stripe response:`, {
                id: stripePayment.id,
                status: stripePayment.status,
                amount: stripePayment.amount,
                amount_received: stripePayment.amount_received,
                charges: stripePayment.charges?.data?.length,
                client_secret: stripePayment.client_secret?.substring(0, 20) + '...',
                metadata: stripePayment.metadata,
              });

              // If Stripe says it succeeded, fulfill the order immediately
              if (stripePayment.status === "succeeded") {
                console.log(`[PaymentService] ✓✓✓ Stripe shows SUCCEEDED! Fulfilling order...`);
                
                try {
                  await this.fulfillOrder(userId, courseId, payment.providerId);
                  console.log(`[PaymentService] ✓ Order fulfilled successfully`);
                } catch (fulfillError: any) {
                  console.error(`[PaymentService] ✗ Error fulfilling order:`, fulfillError.message);
                  throw fulfillError;
                }
                
                // Fetch updated payment and enrollment
                const updatedPayment = await prisma.payment.findUnique({
                  where: { id: paymentId },
                });

                const enrollment = await prisma.enrollment.findUnique({
                  where: { userId_courseId: { userId, courseId } },
                });

                console.log(`[PaymentService] Updated payment status: ${updatedPayment?.status}, Enrollment status: ${enrollment?.status}`);

                return {
                  paymentId: payment.id,
                  status: updatedPayment?.status || "SUCCESS",
                  enrollmentId: enrollment?.id,
                  message: "Payment confirmed! Course content is now available.",
                  success: (updatedPayment?.status === "SUCCESS") && (enrollment?.status === "COMPLETED"),
                };
              } else {
                console.warn(`[PaymentService] ⚠️ Stripe status is: '${stripePayment.status}' (expected 'succeeded'). Payment may still be processing.`);
              }
            }
          } catch (stripeError: any) {
            console.error(`[PaymentService] ✗ ERROR checking Stripe status:`, {
              message: stripeError.message,
              code: stripeError.code,
              status: stripeError.status,
              type: stripeError.type,
              stack: stripeError.stack?.substring(0, 200),
            });
            console.error(`[PaymentService] ✗ CRITICAL: Could not verify with Stripe. Returning PENDING status.`);
            // Fall through to regular check
          }
        }
      }

      // Regular check - look at current database status
      const enrollment = await prisma.enrollment.findUnique({
        where: { userId_courseId: { userId, courseId } },
      });

      console.log(`[PaymentService] Final check - Payment status: ${payment.status}, Enrollment: ${enrollment?.status}`);

      return {
        paymentId: payment.id,
        status: payment.status,
        enrollmentId: enrollment?.id,
        message: 
          payment.status === "SUCCESS" 
            ? "Payment confirmed! Course content is now available." 
            : payment.status === "PENDING"
            ? "Payment is still processing. Please wait..."
            : "Payment failed. Please try again.",
        success: payment.status === "SUCCESS" && enrollment?.status === "COMPLETED",
      };
    } catch (error: any) {
      console.error("[PaymentService] Verification Error:", error.message);
      if (error instanceof AppError) throw error;
      throw new AppError(error.message || "Failed to verify payment", 500);
    }
  }

  /**
   * Helper for local testing - manually confirm a payment
   * Only works in test mode (sk_test_* keys)
   * Simulates webhook behavior
   */
  static async testConfirmPayment(paymentId: string, userId: string) {
    try {
      const stripe = getStripe();
      const isTestMode = (process.env.STRIPE_SECRET_KEY || "").startsWith("sk_test_");

      if (!isTestMode) {
        throw new AppError("This endpoint only works in test mode", 403);
      }

      console.log(`[PaymentService] TEST MODE: Confirming payment ${paymentId} for user ${userId}`);

      // Get the payment to find the course
      const payment = await prisma.payment.findUnique({
        where: { id: paymentId },
      });

      if (!payment) {
        throw new AppError("Payment not found", 404);
      }

      if (payment.userId !== userId) {
        throw new AppError("Unauthorized - payment doesn't belong to this user", 401);
      }

      console.log(`[PaymentService] Found payment - providerId: ${payment.providerId}`);

      // Find course ID - try enrollment first, fall back to checking if we need to create one
      let courseId: string | undefined;
      
      const existingEnrollment = await prisma.enrollment.findFirst({
        where: { paymentId },
      });

      if (existingEnrollment) {
        courseId = existingEnrollment.courseId;
        console.log(`[PaymentService] Found existing enrollment - courseId: ${courseId}`);
      } else {
        // No enrollment yet - need to find courseId from payment metadata or request
        console.warn(`[PaymentService] No enrollment found for payment ${paymentId}`);
        throw new AppError("No course found for this payment. Try again or contact support.", 400);
      }

      // Simulate fulfillOrder
      console.log(`[PaymentService] Calling fulfillOrder - userId: ${userId}, courseId: ${courseId}, providerId: ${payment.providerId}`);
      await this.fulfillOrder(userId, courseId, payment.providerId || paymentId);

      return {
        success: true,
        message: "Payment confirmed (test mode)",
        paymentId,
      };
    } catch (error: any) {
      console.error("[PaymentService] Test Confirm Error:", error.message);
      if (error instanceof AppError) throw error;
      throw new AppError(error.message || "Failed to confirm payment", 500);
    }
  }

  /**
   * Debug endpoint - returns detailed payment and Stripe information
   * Used for troubleshooting payment verification issues
   */
  static async debugPaymentStatus(paymentId: string, userId: string) {
    try {
      console.log(`[PaymentService] DEBUG: Getting detailed payment status for ${paymentId}`);

      // Get payment details from database
      const payment = await prisma.payment.findUnique({
        where: { id: paymentId },
        include: {
          user: {
            select: { id: true, email: true },
          },
          enrollment: {
            select: { id: true, courseId: true, status: true },
          },
        },
      });

      if (!payment) {
        return {
          error: "Payment not found in database",
          paymentId,
          userId,
        };
      }

      if (payment.userId !== userId) {
        return {
          error: "Unauthorized - payment belongs to different user",
          paymentId,
        };
      }

      // Try to get Stripe details
      let stripeDetails: any = null;
      let stripeError: any = null;

      if (payment.providerId) {
        try {
          const stripe = getStripe();
          const stripePayment = await stripe.paymentIntents.retrieve(payment.providerId);
          
          stripeDetails = {
            id: stripePayment.id,
            status: stripePayment.status,
            amount: stripePayment.amount,
            amount_received: stripePayment.amount_received,
            currency: stripePayment.currency,
            charges_count: stripePayment.charges?.data?.length || 0,
            metadata: stripePayment.metadata,
            last_payment_error: stripePayment.last_payment_error?.message,
            next_action: stripePayment.next_action?.type,
          };
        } catch (err: any) {
          stripeError = {
            message: err.message,
            code: err.code,
            status: err.status,
            type: err.type,
          };
        }
      }

      return {
        database_payment: {
          id: payment.id,
          status: payment.status,
          provider: payment.provider,
          providerId: payment.providerId,
          amount: payment.amount,
          currency: payment.currency,
          createdAt: payment.createdAt,
          updatedAt: payment.updatedAt,
        },
        enrollment: payment.enrollment || null,
        stripe: stripeDetails,
        stripe_error: stripeError,
        environment: {
          stripe_key_present: !!process.env.STRIPE_SECRET_KEY,
          stripe_key_type: process.env.STRIPE_SECRET_KEY?.substring(0, 20) + "...",
        },
      };
    } catch (error: any) {
      console.error("[PaymentService] Debug Error:", error.message);
      return {
        error: error.message,
        paymentId,
      };
    }
  }
}
