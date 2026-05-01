import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/app-error";
import Stripe from "stripe";
import "dotenv/config";

const getStripe = () => {
  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  return new Stripe(stripeSecret || "sk_test_fake", {
    apiVersion: "2024-12-18.acacia" as any,
  });
};

export class ConsultancyService {
    static async getAllExperts() {
        const experts = await prisma.expert.findMany({
            include: {
                user: {
                    include: { profile: true },
                },
                slots: {
                    where: { isBooked: false, startTime: { gte: new Date() } },
                },
            },
        });

        // Strip calendarLink for public route but indicate its presence
        return experts.map(expert => {
            const { calendarLink, googleRefreshToken, ...rest } = (expert as any);
            return {
                ...rest,
                hasCalendarLink: !!calendarLink,
                isGoogleConnected: !!googleRefreshToken
            };
        });
    }

    static async getAdminExperts() {
        return prisma.expert.findMany({
            include: {
                user: {
                    include: { profile: true },
                },
                slots: true,
            },
        });
    }

    static async bookSlot(slotId: string, userId: string) {
        const slot = await prisma.availabilitySlot.findUnique({
            where: { id: slotId },
            include: { expert: true },
        });

        if (!slot) throw new AppError("Slot not found", 404);
        if (slot.isBooked) throw new AppError("Slot already booked", 400);

        // Atomic transaction for booking
        return prisma.$transaction(async (tx) => {
            // Update slot status
            await tx.availabilitySlot.update({
                where: { id: slotId },
                data: { isBooked: true },
            });

            // Create booking
            return tx.booking.create({
                data: {
                    userId,
                    expertId: slot.expertId,
                    startTime: slot.startTime,
                    endTime: slot.endTime,
                    status: "SCHEDULED",
                },
            });
        });
    }
    static async createExpert(data: { userId: string; specialization: string; hourlyRate: number; calendarLink?: string }) {
        const existing = await prisma.expert.findUnique({
            where: { userId: data.userId }
        });
        if (existing) throw new AppError("This user is already an expert", 400);

        return prisma.expert.create({
            data,
            include: { user: { include: { profile: true } } }
        });
    }

    static async updateExpert(id: string, data: { specialization?: string; hourlyRate?: number; calendarLink?: string }) {
        return prisma.expert.update({
            where: { id },
            data,
            include: { user: { include: { profile: true } } }
        });
    }

    static async deleteExpert(id: string) {
        return prisma.expert.delete({
            where: { id }
        });
    }

    static async getAccess(userId: string) {
        const accessRecords = await prisma.expertAccess.findMany({
            where: { userId, status: "ACTIVE" }
        });
        return accessRecords.map(a => a.expertId);
    }

    static async createGCalBooking(userId: string, expertId: string, scheduledAt: string, notes?: string, googleMeetLink?: string) {
        // Verify user has paid access to this expert
        const access = await prisma.expertAccess.findUnique({
            where: { userId_expertId: { userId, expertId } }
        });
        if (!access || access.status !== "ACTIVE") {
            throw new AppError("You must unlock this expert's booking before recording a session.", 403);
        }

        return prisma.gCalBooking.create({
            data: {
                userId,
                expertId,
                scheduledAt: new Date(scheduledAt),
                notes: notes || null,
                googleMeetLink: googleMeetLink || null,
                status: "CONFIRMED",
            },
            include: {
                expert: { include: { user: { include: { profile: true } } } }
            }
        });
    }

    static async getMyGCalBookings(userId: string) {
        return prisma.gCalBooking.findMany({
            where: { userId },
            include: {
                expert: { include: { user: { include: { profile: true } } } }
            },
            orderBy: { scheduledAt: "desc" }
        });
    }

    static async getMyBookings(userId: string) {
        return prisma.expertAccess.findMany({
            where: { userId, status: "ACTIVE" },
            include: {
                expert: {
                    include: {
                        user: { include: { profile: true } },
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });
    }

    static async getCalendarLink(userId: string, expertId: string) {
        const access = await prisma.expertAccess.findUnique({
            where: { userId_expertId: { userId, expertId } }
        });

        if (!access || access.status !== "ACTIVE") {
            throw new AppError("You have not purchased access to this expert.", 403);
        }

        const expert = await prisma.expert.findUnique({
            where: { id: expertId }
        });

        if (!expert || !expert.calendarLink) {
            throw new AppError("Expert calendar link not found.", 404);
        }

        return expert.calendarLink;
    }

    static async purchaseAccess(userId: string, expertId: string) {
        return prisma.expertAccess.upsert({
            where: { userId_expertId: { userId, expertId } },
            create: { userId, expertId, status: "ACTIVE" },
            update: { status: "ACTIVE" }
        });
    }

    static async createPaymentIntent(expertId: string, userId: string) {
        const stripe = getStripe();
        
        const expert = await prisma.expert.findUnique({
            where: { id: expertId },
        });

        if (!expert) throw new AppError("Expert not found", 404);
        if (expert.hourlyRate <= 0) throw new AppError("Expert is free, no payment needed", 400);

        const existingAccess = await prisma.expertAccess.findUnique({
            where: { userId_expertId: { userId, expertId } },
        });

        if (existingAccess && existingAccess.status === "ACTIVE") {
            // Already has access - return a special indicator
            return { alreadyOwned: true };
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(expert.hourlyRate * 100), 
            currency: "inr",
            metadata: {
                userId,
                expertId,
                type: "CONSULTANCY_PURCHASE",
            },
            automatic_payment_methods: {
                enabled: true,
            },
        });

        const payment = await prisma.payment.create({
            data: {
                amount: expert.hourlyRate,
                currency: "INR",
                status: "PENDING",
                provider: "STRIPE",
                providerId: paymentIntent.id,
                userId,
            },
        });

        return {
            paymentId: payment.id,
            clientSecret: paymentIntent.client_secret,
            publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
        };
    }

    static async fulfillPayment(userId: string, expertId: string, paymentIntentId: string) {
        return prisma.$transaction(async (tx) => {
            const payment = await tx.payment.update({
                where: { providerId: paymentIntentId },
                data: { status: "SUCCESS" },
            });

            const access = await tx.expertAccess.upsert({
                where: { userId_expertId: { userId, expertId } },
                update: { status: "ACTIVE" },
                create: { userId, expertId, status: "ACTIVE" },
            });

            return { payment, access };
        });
    }

    static async verifyPaymentStatus(paymentId: string, userId: string, expertId: string) {
        const payment = await prisma.payment.findUnique({
            where: { id: paymentId },
        });

        if (!payment) throw new AppError("Payment not found", 404);
        if (payment.userId !== userId) throw new AppError("Unauthorized", 401);

        if (payment.status === "SUCCESS") {
            const access = await prisma.expertAccess.findUnique({
                where: { userId_expertId: { userId, expertId } },
            });

            return {
                paymentId: payment.id,
                status: "SUCCESS",
                accessId: access?.id,
                message: "Payment confirmed! Booking is unlocked.",
                success: access?.status === "ACTIVE",
            };
        }

        if (payment.status === "PENDING" && payment.providerId) {
            try {
                const stripe = getStripe();
                const stripePayment = await stripe.paymentIntents.retrieve(payment.providerId);

                if (stripePayment.status === "succeeded") {
                    await this.fulfillPayment(userId, expertId, payment.providerId);
                    
                    const updatedPayment = await prisma.payment.findUnique({ where: { id: paymentId } });
                    const access = await prisma.expertAccess.findUnique({ where: { userId_expertId: { userId, expertId } } });

                    return {
                        paymentId: payment.id,
                        status: updatedPayment?.status || "SUCCESS",
                        accessId: access?.id,
                        message: "Payment confirmed! Booking is unlocked.",
                        success: (updatedPayment?.status === "SUCCESS") && (access?.status === "ACTIVE"),
                    };
                }
            } catch (stripeError) {
                console.error("[ConsultancyService] Verify Stripe Error:", stripeError);
            }
        }

        const access = await prisma.expertAccess.findUnique({
            where: { userId_expertId: { userId, expertId } },
        });

        return {
            paymentId: payment.id,
            status: payment.status,
            accessId: access?.id,
            message: payment.status === "PENDING" ? "Payment is still processing..." : "Payment failed.",
            success: payment.status === "SUCCESS" && access?.status === "ACTIVE",
        };
    }
}
