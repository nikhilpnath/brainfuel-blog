import { Router } from "express";
import { requireAuth } from "@middleware/auth.middleware";
import { mutationLimiter } from "@middleware/rateLimiter.middleware";
import { getUserSavedPosts, addOrRemovePost } from "@controllers/user.controller";

const router = Router();

// Protect all user routes
router.use(requireAuth);

router.get('/savedposts/:postId', getUserSavedPosts);
router.patch('/savelater', mutationLimiter, addOrRemovePost);

export default router;