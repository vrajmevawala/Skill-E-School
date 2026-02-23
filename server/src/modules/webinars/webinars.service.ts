import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/app-error";

export class WebinarsService {
    static async getAllWebinars() {
        return prisma.webinar.findMany({
            orderBy: { scheduledAt: "asc" },
        });
    }

    static async register(webinarId: string, userId: string) {
        const webinar = await prisma.webinar.findUnique({ where: { id: webinarId } });
        if (!webinar) {
            throw new AppError("Webinar not found", 404);
        }

        // Duplicate Prevention
        const existing = await prisma.webinarRegistration.findUnique({
            where: { userId_webinarId: { userId, webinarId } },
        });

        if (existing) {
            throw new AppError("Already registered for this webinar", 400);
        }

        return prisma.webinarRegistration.create({
            data: {
                userId,
                webinarId,
            },
        });
    }
}
