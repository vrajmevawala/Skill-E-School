import { Request, Response, NextFunction } from "express";
import { WebinarsService } from "./webinars.service";
import { APIResponse } from "../../utils/api-response";

export class WebinarsController {
    static async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const webinars = await WebinarsService.getAllWebinars();
            return APIResponse.success(res, { webinars });
        } catch (error) {
            next(error);
        }
    }

    static async register(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.id;
            const registration = await WebinarsService.register(req.params.id, userId);
            return APIResponse.success(res, { registration }, 201);
        } catch (error) {
            next(error);
        }
    }
}
