import { RequestHandler } from "express";

// ImageKit
export const IKUploadAuth: RequestHandler = (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept");
    next();
}