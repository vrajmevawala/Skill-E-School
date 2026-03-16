/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * Payment intent response - from create-payment-intent endpoint
 */
export interface PaymentIntentResponse {
  paymentId: string;
  clientSecret: string;
  publishableKey: string;
}

/**
 * Payment verification response - checks if payment is completed
 */
export interface PaymentVerificationResponse {
  paymentId: string;
  status: "PENDING" | "SUCCESS" | "FAILED";
  enrollmentId?: string;
  message: string;
  success: boolean;
}

/**
 * Course access response - indicates if user can access course content
 */
export interface CourseAccessResponse {
  courseId: string;
  isEnrolled: boolean;
  enrollmentStatus: "COMPLETED" | "PENDING" | "FAILED" | null;
  canAccessContent: boolean;
  lessons?: any[];
  resources?: any[];
}
