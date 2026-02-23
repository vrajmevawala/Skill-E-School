import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/app-error";

export class ConsultancyService {
    static async getAllExperts() {
        return prisma.expert.findMany({
            include: {
                user: {
                    include: { profile: true },
                },
                slots: {
                    where: { isBooked: false, startTime: { gte: new Date() } },
                },
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
}
