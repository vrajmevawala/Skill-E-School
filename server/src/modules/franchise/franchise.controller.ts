import { Request, Response, NextFunction } from "express";
import { FranchiseService } from "./franchise.service";
import { APIResponse } from "../../utils/api-response";

export class FranchiseController {
    static async createInquiry(req: Request, res: Response, next: NextFunction) {
        try {
            const inquiry = await FranchiseService.createInquiry(req.body);
            return APIResponse.success(res, { inquiry }, 201);
        } catch (error) {
            next(error);
        }
    }

    static async getDashboard(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.id;
            const dashboard = await FranchiseService.getDashboard(userId);
            return APIResponse.success(res, dashboard);
        } catch (error) {
            next(error);
        }
    }

    static async getLeads(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.id;
            const leads = await FranchiseService.getLeads(userId);
            return APIResponse.success(res, { leads });
        } catch (error) {
            next(error);
        }
    }

    static async getPayouts(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.id;
            const payouts = await FranchiseService.getPayouts(userId);
            return APIResponse.success(res, { payouts });
        } catch (error) {
            next(error);
        }
    }
}
