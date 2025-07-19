import express from "express";
import { isAuth } from "../middlewares/isAuth.js";
import uploadFile from "../middlewares/multer.js";
import {
    addSong,
    addThumbnail,
    createAlbum,
    deleteSong,
    getAllAlbums,
    getAllSongs,
    getAllSongsByAlbum,
    getSingleSong,
    deleteAlbum
} from "../controllers/songController.js";

const router = express.Router();

// Album routes
router.post("/album/new", isAuth, uploadFile, createAlbum);
router.get("/album/all", isAuth, getAllAlbums);
router.delete("/album/:id", isAuth, deleteAlbum);
router.get("/album/:id", isAuth, getAllSongsByAlbum);

// Song routes
router.post("/new", isAuth, uploadFile, addSong);
router.post("/:id", isAuth, uploadFile, addThumbnail);
router.get("/single/:id", isAuth, getSingleSong);
router.delete("/:id", isAuth, deleteSong);
router.get("/all", isAuth, getAllSongs);

// Custom rows route (new addition)
router.get("/row/all", isAuth, async (req, res) => {
    try {
        // Return empty array for now - you can implement your custom logic here
        res.json([]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching custom rows" });
    }
});

export default router;