import { RequestHandler } from "express";
import { createError } from "@util/customError";

export const requireAuth: RequestHandler = (req, res, next) => {
  if (!req.auth?.userId) {
    return next(createError("You are not authenticated", 401));
  }
  next();
};
