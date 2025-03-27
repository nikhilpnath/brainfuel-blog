import { Router } from "express";
import { increaseVisit } from "@middleware/increaseVisit.middleware";
import { getPosts, getPost, createPost, deletePost, uploadAuth, featurePost } from "@controllers/post.controller";

const router = Router();

router.get('/upload-auth', uploadAuth)
router.get('/', getPosts);
router.get('/:slug',increaseVisit, getPost)
router.post('/create', createPost)
router.patch('/feature', featurePost)
router.delete("/delete/:postId", deletePost)

export default router;