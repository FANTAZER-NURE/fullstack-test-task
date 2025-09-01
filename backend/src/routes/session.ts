import { Router } from "express";
import { ensureUser } from "../controllers/sessionController";

export const router = Router();

router.post("/ensure-user", ensureUser);
