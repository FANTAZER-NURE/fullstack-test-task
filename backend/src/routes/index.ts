import { Router } from "express";
import { router as sessionRouter } from "./session";
import { router as searchRouter } from "./search";
import { router as userMoviesRouter } from "./userMovies";

export const router = Router();

router.get("/ping", (_req, res) => {
  res.json({ pong: true });
});

router.use("/api/session", sessionRouter);
router.use("/api/search", searchRouter);
router.use("/api/users", userMoviesRouter);
