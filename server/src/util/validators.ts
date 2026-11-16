import { z } from "zod";

/**
 * Zod schema for 24-character hexadecimal MongoDB ObjectId
 */
export const objectIdSchema = z
  .string({ message: "ID must be a string" })
  .trim()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId format");

/**
 * Type guard for MongoDB ObjectId string
 */
export const isValidObjectId = (id: unknown): id is string => {
  return objectIdSchema.safeParse(id).success;
};

/**
 * Escapes regex special characters to prevent ReDoS (Regular Expression Denial of Service)
 * and regex injection in database queries.
 */
export const escapeRegex = (str: string): string => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

/**
 * Formats Zod validation issues into user-friendly toast messages.
 * Omits technical JSON field paths and formats multiple errors with clean bullets.
 */
export const formatZodError = (error: z.ZodError): string => {
  const messages = error.issues.map((issue) => {
    // If the message already starts with a capital letter, use it directly
    if (
      issue.message &&
      issue.message.charAt(0) === issue.message.charAt(0).toUpperCase()
    ) {
      return issue.message;
    }
    const field = issue.path.join(".");
    return field ? `${field}: ${issue.message}` : issue.message;
  });

  const unique = Array.from(new Set(messages));
  if (unique.length === 1) {
    return unique[0];
  }

  return unique.map((msg) => `• ${msg}`).join("\n");
};

/**
 * Zod schema for blog post creation
 * Strips unknown keys automatically, neutralizing mass assignment attacks (e.g. isFeatured, visit).
 */
export const createPostSchema = z.object({
  title: z
    .string({ message: "Title is required" })
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(150, "Title cannot exceed 150 characters"),
  desc: z
    .string({ message: "Description is required" })
    .trim()
    .min(5, "Description must be at least 5 characters")
    .max(500, "Description cannot exceed 500 characters"),
  content: z
    .string({ message: "Content is required" })
    .trim()
    .min(10, "Content must be at least 10 characters"),
  img: z
    .string({ message: "Cover image is required" })
    .trim()
    .min(1, "Cover image is required")
    .max(2048, "Cover image URL exceeds maximum length"),
  category: z
    .string()
    .trim()
    .max(50, "Category cannot exceed 50 characters")
    .optional()
    .transform((val) => (val && val.length > 0 ? val.toLowerCase() : "general"))
    .default("general"),
  media: z
    .array(z.string().trim().min(1, "Media ID cannot be empty"))
    .max(20, "Cannot attach more than 20 media items")
    .optional()
    .default([]),
});

export type ValidatedPostInput = z.infer<typeof createPostSchema>;

export const validateCreatePostInput = (
  body: unknown
): { data?: ValidatedPostInput; error?: string } => {
  const result = createPostSchema.safeParse(body);
  if (!result.success) {
    return { error: formatZodError(result.error) };
  }
  return { data: result.data };
};

/**
 * Zod schema for comment creation
 */
export const createCommentSchema = z.object({
  comment: z
    .string({ message: "Comment text is required and cannot be empty" })
    .trim()
    .min(1, "Comment text is required and cannot be empty")
    .max(1000, "Comment cannot exceed 1000 characters"),
});

export type ValidatedCommentInput = z.infer<typeof createCommentSchema>;

export const validateCommentInput = (
  body: unknown
): { comment?: string; error?: string } => {
  const result = createCommentSchema.safeParse(body);
  if (!result.success) {
    return { error: formatZodError(result.error) };
  }
  return { comment: result.data.comment };
};
