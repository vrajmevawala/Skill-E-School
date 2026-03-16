import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/app-error";
import { APIResponse } from "../utils/api-response";

export const errorHandler = (
    err: Error | AppError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (err instanceof AppError) {
        return APIResponse.error(res, err.message, err.name, err.statusCode);
    }

    // Handle generic errors
    console.error("Unexpected Error:", err);
    return APIResponse.error(
        res,
        process.env.NODE_ENV === "production" ? "Something went wrong" : err.message,
        "INTERNAL_SERVER_ERROR",
        500
    );
};
