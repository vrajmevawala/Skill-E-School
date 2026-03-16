import { Response } from "express";

export class APIResponse {
    static success(res: Response, data: any, statusCode: number = 200) {
        return res.status(statusCode).json({
            status: "success",
            data,
        });
    }

    static error(res: Response, message: string, code: string = "INTERNAL_ERROR", statusCode: number = 500) {
        return res.status(statusCode).json({
            status: "error",
            error: {
                message,
                code,
            },
        });
    }
}
