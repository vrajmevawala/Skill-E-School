import { Request, Response } from "express";
import { BooksService } from "./books.service";

export class BooksController {
    static async getAll(req: Request, res: Response) {
        try {
            const books = await BooksService.getAll();
            res.status(200).json({ status: "success", data: { books } });
        } catch (error: any) {
            res.status(500).json({ status: "error", message: error.message });
        }
    }

    static async getById(req: Request, res: Response) {
        try {
            const book = await BooksService.getById(req.params.id);
            if (!book) {
                return res.status(404).json({ status: "error", message: "Book not found" });
            }
            res.status(200).json({ status: "success", data: { book } });
        } catch (error: any) {
            res.status(500).json({ status: "error", message: error.message });
        }
    }

    static async create(req: Request, res: Response) {
        try {
            const book = await BooksService.create(req.body);
            res.status(201).json({ status: "success", data: { book } });
        } catch (error: any) {
            res.status(500).json({ status: "error", message: error.message });
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const book = await BooksService.update(req.params.id, req.body);
            res.status(200).json({ status: "success", data: { book } });
        } catch (error: any) {
            res.status(500).json({ status: "error", message: error.message });
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            await BooksService.delete(req.params.id);
            res.status(204).json({ status: "success", data: null });
        } catch (error: any) {
            res.status(500).json({ status: "error", message: error.message });
        }
    }

    static async checkAccess(req: Request, res: Response) {
        try {
            const userId = (req as any).user.id;
            const hasAccess = await BooksService.checkAccess(userId, req.params.id);
            res.status(200).json({ status: "success", data: { hasAccess } });
        } catch (error: any) {
            res.status(500).json({ status: "error", message: error.message });
        }
    }

    static async purchase(req: Request, res: Response) {
        try {
            const userId = (req as any).user.id;
            const bookId = req.params.id;
            
            const book = await BooksService.getById(bookId);
            if (!book) {
                return res.status(404).json({ status: "error", message: "Book not found" });
            }

            if (book.isFree) {
                await BooksService.grantAccess(userId, bookId);
                return res.status(200).json({ status: "success", message: "Access granted to free book" });
            }

            // In a real app, integrate with Stripe here. 
            // For now, we'll simulate a successful purchase if they hit this endpoint.
            await BooksService.grantAccess(userId, bookId);
            res.status(200).json({ status: "success", message: "Purchase successful (simulated)" });
        } catch (error: any) {
            res.status(500).json({ status: "error", message: error.message });
        }
    }
}
