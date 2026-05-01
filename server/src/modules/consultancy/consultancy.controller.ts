import { Request, Response, NextFunction } from "express";
import { ConsultancyService } from "./consultancy.service";
import { APIResponse } from "../../utils/api-response";
import { AppError } from "../../utils/app-error";
import { GoogleCalendarService } from "./google-calendar.service";
import { prisma } from "../../lib/prisma";

export class ConsultancyController {
    static async getAllExperts(req: Request, res: Response, next: NextFunction) {
        try {
            const experts = await ConsultancyService.getAllExperts();
            return APIResponse.success(res, { experts });
        } catch (error) {
            next(error);
        }
    }

    static async getAdminExperts(req: Request, res: Response, next: NextFunction) {
        try {
            const experts = await ConsultancyService.getAdminExperts();
            return APIResponse.success(res, { experts });
        } catch (error) {
            next(error);
        }
    }

    static async book(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.id;
            const { slotId } = req.body;
            const booking = await ConsultancyService.bookSlot(slotId, userId);
            return APIResponse.success(res, { booking }, 201);
        } catch (error) {
            next(error);
        }
    }

    static async createExpert(req: Request, res: Response, next: NextFunction) {
        try {
            const expert = await ConsultancyService.createExpert(req.body);
            return APIResponse.success(res, { expert }, 201);
        } catch (error) {
            next(error);
        }
    }

    static async updateExpert(req: Request, res: Response, next: NextFunction) {
        try {
            const expert = await ConsultancyService.updateExpert(req.params.id, req.body);
            return APIResponse.success(res, { expert });
        } catch (error) {
            next(error);
        }
    }

    static async deleteExpert(req: Request, res: Response, next: NextFunction) {
        try {
            await ConsultancyService.deleteExpert(req.params.id);
            return APIResponse.success(res, { message: "Expert removed successfully" });
        } catch (error) {
            next(error);
        }
    }

    static async getAccess(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.id;
            const accessList = await ConsultancyService.getAccess(userId);
            return APIResponse.success(res, { access: accessList });
        } catch (error) {
            next(error);
        }
    }

    static async getMyBookings(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.id;
            const bookings = await ConsultancyService.getMyBookings(userId);
            return APIResponse.success(res, { bookings });
        } catch (error) {
            next(error);
        }
    }

    static async createGCalBooking(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.id;
            const { expertId, scheduledAt, notes, googleMeetLink } = req.body;
            const booking = await ConsultancyService.createGCalBooking(userId, expertId, scheduledAt, notes, googleMeetLink);
            return APIResponse.success(res, { booking }, 201);
        } catch (error) {
            next(error);
        }
    }

    static async getMyGCalBookings(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.id;
            const bookings = await ConsultancyService.getMyGCalBookings(userId);
            return APIResponse.success(res, { bookings });
        } catch (error) {
            next(error);
        }
    }

    static async getGoogleAuthUrl(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.id;
            const expert = await prisma.expert.findUnique({ where: { userId } });
            if (!expert) throw new AppError("Only experts can connect calendar", 403);
            
            const url = GoogleCalendarService.getAuthUrl(expert.id);
            return APIResponse.success(res, { url });
        } catch (error) {
            next(error);
        }
    }

    static async handleGoogleCallback(req: Request, res: Response, next: NextFunction) {
        try {
            const { code, state } = req.query;
            if (!code || !state) throw new AppError("Invalid callback parameters", 400);
            
            await GoogleCalendarService.handleCallback(code as string, state as string);
            
            // Redirect back to frontend consultancy page
            const frontendUrl = process.env.VITE_FRONTEND_URL || "http://localhost:5173";
            return res.redirect(`${frontendUrl}/consultancy?google_connected=true`);
        } catch (error) {
            next(error);
        }
    }

    static async syncExpertBookings(req: Request, res: Response, next: NextFunction) {
        try {
            const expertId = req.params.id;
            const synced = await GoogleCalendarService.syncExpertBookings(expertId);
            return APIResponse.success(res, { synced });
        } catch (error) {
            next(error);
        }
    }

    static async getCalendarLink(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.id;
            const expertId = req.params.id;
            const calendarLink = await ConsultancyService.getCalendarLink(userId, expertId);
            return APIResponse.success(res, { calendarLink });
        } catch (error) {
            next(error);
        }
    }

    static async purchase(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.id;
            const expertId = req.params.id;
            const access = await ConsultancyService.purchaseAccess(userId, expertId);
            return APIResponse.success(res, { message: "Access granted", access }, 201);
        } catch (error) {
            next(error);
        }
    }

    static async createPaymentIntent(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.id;
            const expertId = req.params.id;
            const result = await ConsultancyService.createPaymentIntent(expertId, userId);
            return APIResponse.success(res, result, 201);
        } catch (error) {
            next(error);
        }
    }

    static async verifyPayment(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.id;
            const { id: expertId, paymentId } = req.params;
            const result = await ConsultancyService.verifyPaymentStatus(paymentId, userId, expertId);
            return APIResponse.success(res, result);
        } catch (error) {
            next(error);
        }
    }
}
