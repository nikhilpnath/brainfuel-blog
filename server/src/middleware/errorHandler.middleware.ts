import { ErrorRequestHandler } from "express"

export const errorHandler: ErrorRequestHandler = (error, req, res, next) => {

    const status = error?.status ?? 500;
    const message = error.message || "An unexpected error occured";

    res.status(status).json({
        message,
        stack: process.env.NODE_ENV === "development" ? error.stack : null
    })

}