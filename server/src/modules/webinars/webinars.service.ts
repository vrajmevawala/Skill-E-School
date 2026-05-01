import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/app-error";

export class WebinarsService {
    static async getAllWebinars() {
        const webinars = await prisma.webinar.findMany({
            orderBy: { scheduledAt: "desc" },
            include: {
                _count: {
                    select: { registrations: true }
                }
            }
        });

        const now = new Date();
        
        // Update statuses in parallel for efficiency
        const updatedWebinars = await Promise.all(webinars.map(async (webinar) => {
            const scheduledTime = new Date(webinar.scheduledAt);
            const duration = webinar.duration || 60; // default 60 mins
            const endTime = new Date(scheduledTime.getTime() + duration * 60000);

            let newStatus = webinar.status;
            if (now > endTime) {
                newStatus = "COMPLETED";
            } else if (now >= scheduledTime && now <= endTime) {
                newStatus = "LIVE";
            } else {
                newStatus = "UPCOMING";
            }

            if (newStatus !== webinar.status) {
                return prisma.webinar.update({
                    where: { id: webinar.id },
                    data: { status: newStatus },
                    include: {
                        _count: {
                            select: { registrations: true }
                        }
                    }
                });
            }
            return webinar;
        }));

        return updatedWebinars;
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

    static async createWebinar(data: any) {
        return prisma.webinar.create({
            data: {
                title: data.title,
                description: data.description,
                scheduledAt: new Date(data.scheduledAt),
                duration: data.duration,
                isFree: data.isFree,
                googleFormLink: data.googleFormLink,
                status: data.status || "UPCOMING",
            },
        });
    }

    static async updateWebinar(id: string, data: any) {
        return prisma.webinar.update({
            where: { id },
            data: {
                title: data.title,
                description: data.description,
                scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : undefined,
                duration: data.duration,
                isFree: data.isFree,
                googleFormLink: data.googleFormLink,
                status: data.status,
            },
        });
    }

    static async deleteWebinar(id: string) {
        return prisma.webinar.delete({
            where: { id },
        });
    }
}
