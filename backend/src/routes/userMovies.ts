import { Router } from "express";
import { listUserMovies, addUserMovie, setFavorite, editUserMovie, deleteUserMovie } from "../controllers/userMoviesController";

export const router = Router();

router.get("/:userId/movies", listUserMovies);
router.post("/:userId/movies", addUserMovie);
router.post("/:userId/movies/:id/favorite", setFavorite);
router.patch("/:userId/movies/:id", editUserMovie);
router.delete("/:userId/movies/:id", deleteUserMovie);
