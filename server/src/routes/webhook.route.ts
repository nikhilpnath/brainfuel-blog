import { Router } from "express";
import bodyParser from "body-parser";

import { clerkWebHook } from "@controllers/webhook.controller";

const router = Router();

router.post('/clerk', bodyParser.raw({ type: 'application/json' }), clerkWebHook);
//parse incoming webhook requests as raw JSON instead of converting them to a JavaScript object

export default router;