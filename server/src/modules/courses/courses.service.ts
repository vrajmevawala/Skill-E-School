import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/app-error";

export class CoursesService {
    static async getAllCourses(query: any) {
        const { category, search } = query;

        return prisma.course.findMany({
            where: {
                ...(category && category !== "All" ? { category: { name: category } } : {}),
                ...(search ? { title: { contains: search } } : {}),
            },
            include: {
                category: true,
                trainer: {
                    include: { profile: true },
                },
                lessons: {
                    orderBy: { order: "asc" },
                },
                resources: true,
                _count: {
                    select: { enrollments: true, lessons: true, resources: true }
                }
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
                status: "COMPLETED",
            },
        });
    }

    static async getMyCourses(userId: string) {
        return prisma.enrollment.findMany({
            where: { userId },
            include: {
                course: {
                    include: { 
                        category: true, 
                        trainer: { include: { profile: true } },
                        lessons: { orderBy: { order: "asc" } }
                    },
                },
            },
        });
    }

    static async createCourse(data: any) {
        const { lessons, resources, ...courseData } = data;
        
        // Find a fallback trainer if none provided (system admin)
        let trainerId = courseData.trainerId;
        if (!trainerId) {
            const admin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
            trainerId = admin?.id;
        }

        return prisma.course.create({
            data: {
                ...courseData,
                trainerId,
                isFree: courseData.price === 0,
                lessons: lessons ? {
                    create: lessons.map((l: any, idx: number) => ({
                        title: l.title,
                        videoUrl: l.videoUrl,
                        duration: l.duration,
                        order: l.order || idx + 1
                    }))
                } : undefined,
                resources: resources ? {
                    create: resources.map((r: any) => ({
                        name: r.name,
                        type: r.type,
                        url: r.url
                    }))
                } : undefined
            },
            include: {
                lessons: true,
                resources: true
            }
        });
    }

    static async updateCourse(id: string, data: any) {
        const { lessons, resources, ...courseData } = data;

        // Transactions are better but for simplicity we'll delete and recreate relations
        // or update them individually. Given this is a small system, we'll use a transaction.
        return prisma.$transaction(async (tx) => {
            // 1. Update core course data
            await tx.course.update({
                where: { id },
                data: {
                    ...courseData,
                    isFree: courseData.price === 0,
                }
            });

            // 2. Handle Lessons (Wipe and replace for simplicity in this admin tool)
            if (lessons) {
                await tx.lesson.deleteMany({ where: { courseId: id } });
                await tx.lesson.createMany({
                    data: lessons.map((l: any, idx: number) => ({
                        courseId: id,
                        title: l.title,
                        videoUrl: l.videoUrl,
                        duration: l.duration,
                        order: l.order || idx + 1
                    }))
                });
            }

            // 3. Handle Resources
            if (resources) {
                await tx.courseResource.deleteMany({ where: { courseId: id } });
                await tx.courseResource.createMany({
                    data: resources.map((r: any) => ({
                        courseId: id,
                        name: r.name,
                        type: r.type,
                        url: r.url
                    }))
                });
            }

            return tx.course.findUnique({
                where: { id },
                include: { lessons: true, resources: true }
            });
        });
    }

    static async deleteCourse(id: string) {
        return prisma.course.delete({
            where: { id },
        });
    }

    static async getCategories() {
        return prisma.courseCategory.findMany({
            include: {
                _count: {
                    select: { courses: true }
                }
            }
        });
    }

    static async createCategory(data: any) {
        return prisma.courseCategory.create({
            data: {
                name: data.name
            }
        });
    }

    static async updateCategory(id: string, data: any) {
        return prisma.courseCategory.update({
            where: { id },
            data: {
                name: data.name
            }
        });
    }

    static async deleteCategory(id: string) {
        // Check if category has courses before deleting
        const count = await prisma.course.count({
            where: { categoryId: id }
        });

        if (count > 0) {
            throw new AppError("Cannot delete category with existing courses", 400);
        }

        return prisma.courseCategory.delete({
            where: { id }
        });
    }

    /**
     * Check if user has access to course content
     * Returns course details with lessons and resources if user is enrolled
     */
    static async checkCourseAccess(userId: string, courseId: string, role?: string) {
        try {
            // Get course details
            const course = await prisma.course.findUnique({
                where: { id: courseId },
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

            // Check enrollment status
            const enrollment = await prisma.enrollment.findUnique({
                where: { userId_courseId: { userId, courseId } },
            });

            const isEnrolled = !!enrollment;
            const isAdmin = role === "ADMIN";
            const canAccessContent = isAdmin || (isEnrolled && enrollment.status === "COMPLETED");

            console.log(`[CoursesService] Access check - User: ${userId}, Role: ${role}, Course: ${courseId}, Enrolled: ${isEnrolled}, CanAccess: ${canAccessContent}`);

            return {
                courseId,
                isEnrolled,
                enrollmentStatus: enrollment?.status || null,
                canAccessContent,
                // Only return lessons and resources if user has access
                ...(canAccessContent && {
                    lessons: course.lessons,
                    resources: course.resources,
                }),
                // Basic course info always available
                course: {
                    id: course.id,
                    title: course.title,
                    description: course.description,
                    thumbnail: course.thumbnail,
                    price: course.price,
                    isFree: course.isFree,
                    level: course.level,
                    trainer: course.trainer,
                    category: course.category,
                }
            };
        } catch (error: any) {
            if (error instanceof AppError) throw error;
            throw new AppError(error.message || "Failed to check course access", 500);
        }
    }
}
