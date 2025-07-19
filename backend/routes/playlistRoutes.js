import express from "express";
import Playlist from "../models/Playlist.js";
import authenticate from "../middleware/auth.js";

const router = express.Router();

// Add song to playlist
router.post("/add-song", authenticate, async (req, res) => {
    try {
        const { songId, playlistId } = req.body;
        
        if (!songId || !playlistId) {
            return res.status(400).json({ message: 'Both songId and playlistId are required' });
        }

        const playlist = await Playlist.findById(playlistId);
        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found' });
        }

        // Check if song already exists in playlist
        if (playlist.songs.includes(songId)) {
            return res.status(400).json({ message: 'Song already in playlist' });
        }

        playlist.songs.push(songId);
        await playlist.save();

        res.status(200).json({ message: 'Song added to playlist successfully', playlist });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all playlists for current user
router.get("/user-playlists", authenticate, async (req, res) => {
    try {
        const playlists = await Playlist.find({ createdBy: req.user._id });
        res.status(200).json(playlists);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;



