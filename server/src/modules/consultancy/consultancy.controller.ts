import { Request, Response, NextFunction } from "express";
import { ConsultancyService } from "./consultancy.service";
import { APIResponse } from "../../utils/api-response";

export class ConsultancyController {
    static async getAllExperts(req: Request, res: Response, next: NextFunction) {
        try {
            const experts = await ConsultancyService.getAllExperts();
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
}
