import { rateLimit } from "express-rate-limit";
import { createError } from "@util/customError";

/**
 * General API rate limiter:
 * 200 requests per 15-minute window per IP
 */
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests, please try again later.",
  handler: (req, res, next, options) => {
    next(createError(options.message as string, options.statusCode));
  },
});

/**
 * Strict limiter for mutating endpoints (creating posts, adding comments, requesting upload tokens):
 * 30 requests per 15-minute window per IP
 */
export const mutationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Action limit exceeded. Please wait a few minutes before trying again.",
  handler: (req, res, next, options) => {
    next(createError(options.message as string, options.statusCode));
  },
});
