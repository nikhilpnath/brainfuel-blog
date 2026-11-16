import { Router } from "express";
import { increaseVisit } from "@middleware/increaseVisit.middleware";
import { requireAuth } from "@middleware/auth.middleware";
import { mutationLimiter } from "@middleware/rateLimiter.middleware";
import {
  getPosts,
  getPost,
  createPost,
  deletePost,
  uploadAuth,
  featurePost,
} from "@controllers/post.controller";

const router = Router();

router.get("/upload-auth", requireAuth, mutationLimiter, uploadAuth);
router.get("/", getPosts);
router.get("/:slug", increaseVisit, getPost);
router.post("/create", requireAuth, mutationLimiter, createPost);
router.patch("/feature", requireAuth, mutationLimiter, featurePost);
router.delete("/delete/:postId", requireAuth, mutationLimiter, deletePost);

export default router;