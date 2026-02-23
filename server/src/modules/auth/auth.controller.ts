import { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service";
import { APIResponse } from "../../utils/api-response";

export class AuthController {
    static async register(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await AuthService.register(req.body);
            return APIResponse.success(res, result, 201);
        } catch (error) {
            next(error);
        }
    }

    static async verifyOtp(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await AuthService.verifyOtp(req.body);
            return APIResponse.success(res, result);
        } catch (error) {
            next(error);
        }
    }

    static async resendOtp(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await AuthService.resendOtp(req.body.email);
            return APIResponse.success(res, result);
        } catch (error) {
            next(error);
        }
    }

    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await AuthService.login(req.body);
            return APIResponse.success(res, result);
        } catch (error) {
            next(error);
        }
    }

    static async getMe(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.id;
            const user = await AuthService.getMe(userId);
            return APIResponse.success(res, { user });
        } catch (error) {
            next(error);
        }
    }

    static logout(req: Request, res: Response) {
        return APIResponse.success(res, { message: "Logged out successfully" });
    }
}
