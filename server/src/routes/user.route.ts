import { Router } from "express";
import { requireAuth } from "@middleware/auth.middleware";
import { getUserSavedPosts, addOrRemovePost } from "@controllers/user.controller";

const router = Router();

// Protect all user routes
router.use(requireAuth);

router.get('/savedposts/:postId', getUserSavedPosts);
router.patch('/savelater', addOrRemovePost);

export default router;