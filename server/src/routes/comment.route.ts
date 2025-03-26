import { Router } from "express";
import { getComments, addComment, deleteComment } from "../controllers/comment.controller";

const router = Router();

router.get('/:postId', getComments);
router.post('/:postId', addComment)
router.delete("/:id", deleteComment)

export default router;