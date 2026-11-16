import { Router } from "express";
import { increaseVisit } from "@middleware/increaseVisit.middleware";
import { requireAuth } from "@middleware/auth.middleware";
import {
  getPosts,
  getPost,
  createPost,
  deletePost,
  uploadAuth,
  featurePost,
} from "@controllers/post.controller";

const router = Router();

router.get("/upload-auth", requireAuth, uploadAuth);
router.get("/", getPosts);
router.get("/:slug", increaseVisit, getPost);
router.post("/create", requireAuth, createPost);
router.patch("/feature", requireAuth, featurePost);
router.delete("/delete/:postId", requireAuth, deletePost);

export default router;