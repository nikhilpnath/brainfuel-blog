import express, { Router } from "express";

import { clerkWebHook } from "@controllers/webhook.controller";

const router = Router();

router.post("/clerk", express.raw({ type: "application/json" }), clerkWebHook);
//parse incoming webhook requests as raw JSON instead of converting them to a JavaScript object

export default router;