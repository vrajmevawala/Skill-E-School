import { prisma } from "../../lib/prisma";

export class BooksService {
    static async getAll() {
        return await prisma.book.findMany({
            orderBy: { createdAt: "desc" }
        });
    }

    static async getById(id: string) {
        return await prisma.book.findUnique({
            where: { id }
        });
    }

    static async create(data: any) {
        return await prisma.book.create({
            data
        });
    }

    static async update(id: string, data: any) {
        return await prisma.book.update({
            where: { id },
            data
        });
    }

    static async delete(id: string) {
        return await prisma.book.delete({
            where: { id }
        });
    }

    static async checkAccess(userId: string, bookId: string) {
        const book = await prisma.book.findUnique({ where: { id: bookId } });
        if (!book) return false;
        if (book.isFree) return true;

        const access = await prisma.bookAccess.findUnique({
            where: {
                userId_bookId: { userId, bookId }
            }
        });

        return !!access && access.status === "ACTIVE";
    }

    static async grantAccess(userId: string, bookId: string) {
        return await prisma.bookAccess.upsert({
            where: {
                userId_bookId: { userId, bookId }
            },
            create: {
                userId,
                bookId,
                status: "ACTIVE"
            },
            update: {
                status: "ACTIVE"
            }
        });
    }
}
