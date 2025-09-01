import { Router } from "express";
import { search } from "../controllers/searchController";

export const router = Router();

router.get("/", search);
