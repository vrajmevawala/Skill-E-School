import { Request, Response, NextFunction } from "express";
import { CoursesService } from "./courses.service";
import { PaymentService } from "./payment.service";
import { APIResponse } from "../../utils/api-response";

export class CoursesController {
    static async createPaymentSession(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.id;
            const session = await PaymentService.createPaymentIntent(req.params.id, userId);
            return APIResponse.success(res, session);
        } catch (error) {
            next(error);
        }
    }

    static async handleWebhook(req: Request, res: Response, next: NextFunction) {
        try {
            const sig = req.headers["stripe-signature"] as string;
            const payload = req.body; // In reality, we need raw body for stripe
            const response = await PaymentService.handleWebhook(sig, payload);
            return APIResponse.success(res, response);
        } catch (error) {
            next(error);
        }
    }

    static async verifyPayment(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.id;
            const { id: courseId, paymentId } = req.params;
            const verification = await PaymentService.verifyPaymentStatus(paymentId, userId, courseId);
            return APIResponse.success(res, verification);
        } catch (error) {
            next(error);
        }
    }

    static async testConfirmPayment(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.id;
            const { paymentId } = req.params;
            const result = await PaymentService.testConfirmPayment(paymentId, userId);
            return APIResponse.success(res, result);
        } catch (error) {
            next(error);
        }
    }

    static async debugPaymentStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.id;
            const { paymentId } = req.params;
            const debug = await PaymentService.debugPaymentStatus(paymentId, userId);
            return APIResponse.success(res, debug);
        } catch (error) {
            next(error);
        }
    }

    static async checkCourseAccess(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.id;
            const courseId = req.params.id;
            const access = await CoursesService.checkCourseAccess(userId, courseId);
            return APIResponse.success(res, access);
        } catch (error) {
            next(error);
        }
    }

    static async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const courses = await CoursesService.getAllCourses(req.query);
            return APIResponse.success(res, { courses });
        } catch (error) {
            next(error);
        }
    }

    static async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const course = await CoursesService.getCourseById(req.params.id);
            return APIResponse.success(res, { course });
        } catch (error) {
            next(error);
        }
    }

    static async enroll(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.id;
            const enrollment = await CoursesService.enroll(req.params.id, userId);
            return APIResponse.success(res, { enrollment }, 201);
        } catch (error) {
            next(error);
        }
    }

    static async getMyCourses(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.id;
            const enrollments = await CoursesService.getMyCourses(userId);
            return APIResponse.success(res, { enrollments });
        } catch (error) {
            next(error);
        }
    }

    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const course = await CoursesService.createCourse(req.body);
            return APIResponse.success(res, { course }, 201);
        } catch (error) {
            next(error);
        }
    }

    static async update(req: Request, res: Response, next: NextFunction) {
        try {
            const course = await CoursesService.updateCourse(req.params.id, req.body);
            return APIResponse.success(res, { course });
        } catch (error) {
            next(error);
        }
    }

    static async delete(req: Request, res: Response, next: NextFunction) {
        try {
            await CoursesService.deleteCourse(req.params.id);
            return APIResponse.success(res, { message: "Course deleted successfully" });
        } catch (error) {
            next(error);
        }
    }

    static async getCategories(req: Request, res: Response, next: NextFunction) {
        try {
            const categories = await CoursesService.getCategories();
            return APIResponse.success(res, { categories });
        } catch (error) {
            next(error);
        }
    }
}
