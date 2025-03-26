import { Router } from "express";
import { getUserSavedPosts, addOrRemovePost } from "../controllers/user.controller";

const router = Router();

router.get('/savedposts/:postId', getUserSavedPosts)

router.patch('/savelater', addOrRemovePost)

export default router;