import { Router } from "express";

import userRoute from './user.route';
import postRoute from './post.route';
import commentRoute from './comment.route';

const router = Router();

const path = '/api/';

router.use(`${path}users`, userRoute)
router.use(`${path}posts`, postRoute)
router.use(`${path}comments`, commentRoute)

export default router;