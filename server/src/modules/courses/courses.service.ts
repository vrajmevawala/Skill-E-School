import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/app-error";

export class CoursesService {
    static async getAllCourses(query: any) {
        const { category, search } = query;

        return prisma.course.findMany({
            where: {
                ...(category && category !== "All" ? { category: { name: category } } : {}),
                ...(search ? { title: { contains: search, mode: "insensitive" } } : {}),
            },
            include: {
                category: true,
                trainer: {
                    include: { profile: true },
                },
                lessons: {
                    orderBy: { order: "asc" },
                    select: { id: true, title: true, videoUrl: true, order: true }
                },
                resources: true
            },
        });
    }

    static async getCourseById(id: string) {
        const course = await prisma.course.findUnique({
            where: { id },
            include: {
                category: true,
                lessons: { orderBy: { order: "asc" } },
                resources: true,
                trainer: { include: { profile: true } },
            },
        });

        if (!course) {
            throw new AppError("Course not found", 404);
        }

        return course;
    }

    static async enroll(courseId: string, userId: string) {
        const course = await prisma.course.findUnique({ where: { id: courseId } });
        if (!course) throw new AppError("Course not found", 404);

        // Check if already enrolled
        const existing = await prisma.enrollment.findUnique({
            where: { userId_courseId: { userId, courseId } },
        });

        if (existing) {
            throw new AppError("Already enrolled in this course", 400);
        }

        return prisma.enrollment.create({
            data: {
                userId,
                courseId,
                status: "COMPLETED", // Assuming payment success for demo/free
            },
        });
    }

    static async getMyCourses(userId: string) {
        return prisma.enrollment.findMany({
            where: { userId },
            include: {
                course: {
                    include: { category: true, trainer: { include: { profile: true } } },
                },
            },
        });
    }
}
