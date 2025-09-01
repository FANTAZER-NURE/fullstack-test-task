import { Router } from "express";
import { router as healthRouter } from "./health";

export const router = Router();

router.get("/ping", (_req, res) => {
  res.json({ pong: true });
});

router.use("/health", healthRouter);
