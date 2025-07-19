import { Album } from "../models/Album.js";
import TryCatch from "../utils/tryCatch.js";
import cloudinary from "cloudinary";
import getDataUrl from "../utils/urlGenrater.js";
import { Song } from "../models/Song.js";

export const createAlbum = TryCatch(async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({
            message: "You are not Admin",
        });
    }

    const { title, description } = req.body;
    const file = req.file;

    const fileUrl = getDataUrl(file);

    const cloud = await cloudinary.v2.uploader.upload(fileUrl.content);

    await Album.create({
        title,
        description,
        thumbnail: {
            id: cloud.public_id,
            url: cloud.secure_url,
        },
    });



    res.json({
        message: "Album Added successfully",
    });
});

export const getAllAlbums = TryCatch(async (req, res) => {
    const albums = await Album.find();

    res.json(albums);
});

export const addSong = TryCatch(async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({
            message: "You are not Admin",
        });
    }

    const { title, description, singer, album } = req.body;

    const file = req.file;

    const fileUrl = getDataUrl(file);

    const cloud = await cloudinary.v2.uploader.upload(fileUrl.content, {
        resource_type: "video",
    });


    await Song.create({
        title,
        description,
        singer,
        audio: {
            id: cloud.public_id,
            url: cloud.secure_url,
        },
        album,
    });


    res.json({
        message: "Song Added successfully",
    });
});


export const addThumbnail= TryCatch(async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({
            message: "You are not Admin",
        });
    }

    const file = req.file;

    const fileUrl = getDataUrl(file);

    const cloud = await cloudinary.v2.uploader.upload(fileUrl.content);

    await Song.findByIdAndUpdate(req.params.id, {
        thumbnail: {
            id: cloud.public_id,
            url: cloud.secure_url,
        },
    },
        { new: true }
    );

    res.json({
        message: "Thumbnail Added successfully",
    });
});

export const getAllSongs = async (req, res) => {
  try {
    const songs = await Song.find();
    res.status(200).json(songs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllSongsByAlbum = TryCatch(async (req, res) => {
    const album = await Album.findById(req.params.id);
    const songs = await Song.find({ album: req.params.id });
    res.json({
        album,
        songs,
    });
});

export const deleteSong = TryCatch(async (req, res) => {
    const song = await Song.findById(req.params.id);

    await song.deleteOne();

    res.json({
        message: "Song deleted successfully",
    });
});


export const getSingleSong = TryCatch(async (req, res) => {
    const song = await Song.findById(req.params.id);

    res.json(song);
});

export const deleteAlbum = TryCatch(async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({
            message: "You are not Admin",
        });
    }

    // Find the album first to get the thumbnail ID
    const album = await Album.findById(req.params.id);
    
    if (!album) {
        return res.status(404).json({
            message: "Album not found",
        });
    }

    // Delete associated songs first
    await Song.deleteMany({ album: req.params.id });

    // Delete the thumbnail from Cloudinary if it exists
    if (album.thumbnail?.id) {
        await cloudinary.v2.uploader.destroy(album.thumbnail.id);
    }

    // Delete the album
    await album.deleteOne();

    res.json({
        message: "Album and all its songs deleted successfully",
    });
});


