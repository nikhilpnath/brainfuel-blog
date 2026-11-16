import { Router } from "express";
import { requireAuth } from "@middleware/auth.middleware";
import {
  getComments,
  addComment,
  deleteComment,
} from "@controllers/comment.controller";

const router = Router();

router.get("/:postId", getComments);
router.post("/:postId", requireAuth, addComment);
router.delete("/:id", requireAuth, deleteComment);

export default router;