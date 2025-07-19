import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

const SongContext = createContext();

export const SongProvider = ({ children }) => {
    const [songs, setSongs] = useState([]); // Initialized as empty array
    
    const [loading, setLoading] = useState(false);
    const [songLoading, setSongLoading] = useState(true);
    const [currentPlaylist, setCurrentPlaylist] = useState(null);
    const [currentContext, setCurrentContext] = useState(null);
    const [currentContextSongs, setCurrentContextSongs] = useState(null);
    const [selectedSong, setSelectedSong] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);

    async function fetchSongs() {
        try {
            const { data } = await axios.get("/api/song/all");
            console.log("Fetched songs:", data); // Debug log
            setSongs(data || []);
            setSelectedSong(data && data[0]?._id);
            setIsPlaying(false);
        } catch (error) {
            console.log(error);
            setSongs([]); // Fallback to empty array on error
        }
    }

    const [song, setSong] = useState([]);

    async function fetchSingleSong() {
        try {
            const { data } = await axios.get("/api/song/single/" + selectedSong);
            setSong(data);
        } catch (error) {
            console.log(error);
        }
    }

    async function addAlbum(formData, setTitle, setDescription, setFile) {
        setLoading(true);
        try {
            const { data } = await axios.post("/api/song/album/new", formData);
            toast.success(data.message);
            setLoading(false);
            fetchAlbums();
            setTitle("");
            setDescription("");
            setFile(null);
        } catch (error) {
            toast.error(error.response.data.message);
            setLoading(false);
        }
    }

    

    
    async function addSong(formData, setTitle, setDescription, setFile, setSinger, setAlbum) {
        setLoading(true);
        try {
            const { data } = await axios.post("/api/song/new", formData);
            toast.success(data.message);
            setLoading(false);
            fetchSongs();
            setTitle("");
            setDescription("");
            setFile(null);
            setSinger("");
            setAlbum("");
        } catch (error) {
            toast.error(error.response.data.message);
            setLoading(false);
        }
    }

    async function addThumbnail(id, formData, setFile) {
        setLoading(true);
        try {
            const { data } = await axios.post("/api/song/" + id, formData);
            toast.success(data.message);
            setLoading(false);
            fetchSongs();
            setFile(null);
        } catch (error) {
            toast.error(error.response.data.message);
            setLoading(false);
        }
    }

    const [albums, setAlbums] = useState([]); // Initialized as empty array

    async function fetchAlbums() {
        try {
            const { data } = await axios.get("/api/song/album/all");
            console.log("Fetched albums:", data); // Debug log
            setAlbums(data || []);
        } catch (error) {
            console.log(error);
            setAlbums([]); // Fallback to empty array on error
        }
    }

    async function deleteSong(id) {
        try {
            const { data } = await axios.delete("/api/song/" + id);
            toast.success(data.message);
            fetchSongs();
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }

    async function deleteAlbum(id) {
        try {
            const { data } = await axios.delete("/api/song/album/" + id);
            toast.success(data.message);
            fetchAlbums();
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }

    useEffect(() => {
        fetchSongs();
        fetchAlbums();
    }, []);

    const setPlaylistSongs = (playlistSongs) => {
        setCurrentContext('playlist');
        setCurrentContextSongs(playlistSongs);
    };

    const setAlbumSongs = (albumSongs) => {
        setCurrentContext('album');
        setCurrentContextSongs(albumSongs);
    };

    const setAllSongsContext = () => {
        setCurrentContext('all');
        setCurrentContextSongs(songs);
    };

    const [index, setIndex] = useState(0);

    function nextMusic() {
        if (!currentContextSongs || currentContextSongs.length === 0) {
            setAllSongsContext();
            return;
        }
        const currentIndex = currentContextSongs.findIndex(s => s._id === selectedSong);
        if (currentIndex === -1 || currentIndex === currentContextSongs.length - 1) {
            setSelectedSong(currentContextSongs[0]?._id);
        } else {
            setSelectedSong(currentContextSongs[currentIndex + 1]?._id);
        }
    }

    function prevMusic() {
        if (!currentContextSongs || currentContextSongs.length === 0) {
            setAllSongsContext();
            return;
        }
        const currentIndex = currentContextSongs.findIndex(s => s._id === selectedSong);
        if (currentIndex <= 0) return;
        setSelectedSong(currentContextSongs[currentIndex - 1]?._id);
    }

    const [albumSong, setAlbumSong] = useState([]);
    const [albumData, setAlbumData] = useState([]);

    async function fetchAlbumSong(id) {
        try {
            const { data } = await axios.get("/api/song/album/" + id);
            setAlbumSong(data.songs);
            setAlbumData(data.album);
            setAlbumSongs(data.songs);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <SongContext.Provider
            value={{
                songs,
                addAlbum,
                loading,
                songLoading,
                albums,
                addSong,
                addThumbnail,
                deleteSong,
                deleteAlbum,
                fetchSingleSong,
                song,
                setSelectedSong,
                isPlaying,
                setIsPlaying,
                selectedSong,
                nextMusic,
                prevMusic,
                fetchAlbumSong,
                albumData,
                albumSong,
                fetchSongs,
                fetchAlbums,
                setPlaylistSongs,
                setAlbumSongs,
                currentContext,
                setAllSongsContext
            }}
        >
            {children}
        </SongContext.Provider>
    );
};

export const SongData = () => useContext(SongContext);