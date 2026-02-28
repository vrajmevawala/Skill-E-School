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

    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const webinar = await WebinarsService.createWebinar(req.body);
            return APIResponse.success(res, { webinar }, 201);
        } catch (error) {
            next(error);
        }
    }

    static async update(req: Request, res: Response, next: NextFunction) {
        try {
            const webinar = await WebinarsService.updateWebinar(req.params.id, req.body);
            return APIResponse.success(res, { webinar });
        } catch (error) {
            next(error);
        }
    }

    static async delete(req: Request, res: Response, next: NextFunction) {
        try {
            await WebinarsService.deleteWebinar(req.params.id);
            return APIResponse.success(res, { message: "Webinar deleted successfully" });
        } catch (error) {
            next(error);
        }
    }
}
