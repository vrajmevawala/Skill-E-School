import { Request, Response, NextFunction } from "express";
import { CoursesService } from "./courses.service";
import { APIResponse } from "../../utils/api-response";

export class CoursesController {
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
}
