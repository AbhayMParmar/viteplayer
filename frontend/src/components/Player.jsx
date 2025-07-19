import React, { useEffect, useRef, useState } from 'react';
import { SongData } from '../context/song';
import { GrChapterNext, GrChapterPrevious } from "react-icons/gr";
import { FaPause, FaPlay, FaPlus, FaCheck, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import { UserData } from '../context/User';
import MobileSongDetails from './MobileSongDetails';
import { useLocation } from 'react-router-dom';

const Player = () => {
    const {
        song,
        fetchSingleSong,
        selectedSong,
        isPlaying,
        setIsPlaying,
        nextMusic,
        prevMusic,
        currentContext,
        setSelectedSong,
        songs // Assuming your SongData context provides all songs
    } = SongData();
    const { addToPlaylist, user } = UserData();
    const [isInPlaylist, setIsInPlaylist] = useState(false);
    const [initialLoad, setInitialLoad] = useState(true);
    const [showMobileDetails, setShowMobileDetails] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.8);
    const [isMuted, setIsMuted] = useState(false);
    const audioRef = useRef(null);
    const mobileProgressRef = useRef(null);
    const desktopProgressRef = useRef(null);
    const mobileProgressContainerRef = useRef(null);
    const location = useLocation();

    const getContextText = () => {
        if (!currentContext) return '';
        return {
            playlist: 'From Playlist',
            album: 'From Album',
            all: 'From Library'
        }[currentContext] || '';
    };

    const getArtistName = () => {
        if (song?.artist) return song.artist;
        if (song?.singer) return song.singer;
        if (song?.artistName) return song.artistName;
        if (song?.artists && Array.isArray(song.artists)) {
            return song.artists.join(', ');
        }
        return 'Unknown Artist';
    };

    // Load saved state from localStorage
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const savedState = localStorage.getItem('playerState');
        if (savedState) {
            const { songId, isPlaying: savedIsPlaying, volume: savedVolume, currentTime } = JSON.parse(savedState);
            
            // If there was a song playing, restore it
            if (songId) {
                setSelectedSong(songId);
                
                if (savedVolume !== undefined) {
                    setVolume(savedVolume);
                    setIsMuted(savedVolume === 0);
                }
                
                if (initialLoad) {
                    if (currentTime !== undefined) {
                        setProgress(currentTime);
                    }
                    setIsPlaying(savedIsPlaying);
                    setInitialLoad(false);
                }
            } else {
                // If no saved song, load the first song from the library
                if (songs && songs.length > 0 && initialLoad) {
                    setSelectedSong(songs[0]._id);
                    setIsPlaying(false);
                    setInitialLoad(false);
                }
            }
        } else {
            // If no saved state, load the first song from the library
            if (songs && songs.length > 0 && initialLoad) {
                setSelectedSong(songs[0]._id);
                setIsPlaying(false);
                setInitialLoad(false);
            }
        }
    }, [songs]); // Added songs as dependency

    // Fetch song when selectedSong changes
    useEffect(() => {
        if (selectedSong) {
            fetchSingleSong();
        }
    }, [selectedSong]);

    // Check if song is in playlist
    useEffect(() => {
        if (user && song) {
            setIsInPlaylist(user.playlist?.includes(song._id));
        }
    }, [user, song]);

    // Save state to localStorage
    useEffect(() => {
        if (!initialLoad && song?._id && typeof window !== 'undefined') {
            localStorage.setItem('playerState', JSON.stringify({
                songId: song._id,
                isPlaying,
                context: currentContext,
                volume,
                currentTime: progress
            }));
        }
    }, [song?._id, isPlaying, currentContext, volume, progress]);

    // Clear saved state when component unmounts if no song is playing
    useEffect(() => {
        return () => {
            if (!song && typeof window !== 'undefined') {
                localStorage.removeItem('playerState');
            }
        };
    }, [song]);

    // Audio event handlers
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleLoadedMetaData = () => {
            setDuration(audio.duration);
            const savedState = JSON.parse(localStorage.getItem('playerState') || '{}');
            if (savedState.currentTime) {
                audio.currentTime = savedState.currentTime;
            }
            if (isPlaying) {
                audio.play().catch(e => console.error("Auto-play prevented:", e));
            }
        };

        const updateProgress = () => {
            const currentProgress = audio.currentTime;
            setProgress(currentProgress);
            const progressPercent = duration ? (currentProgress / duration) * 100 : 0;

            if (mobileProgressRef.current) {
                mobileProgressRef.current.value = progressPercent;
            }
            if (desktopProgressRef.current) {
                desktopProgressRef.current.value = progressPercent;
            }
        };

        const handleEnded = () => {
            nextMusic();
        };

        audio.addEventListener("loadedmetadata", handleLoadedMetaData);
        audio.addEventListener("timeupdate", updateProgress);
        audio.addEventListener("seeked", updateProgress);
        audio.addEventListener("ended", handleEnded);

        return () => {
            audio.removeEventListener("loadedmetadata", handleLoadedMetaData);
            audio.removeEventListener("timeupdate", updateProgress);
            audio.removeEventListener("seeked", updateProgress);
            audio.removeEventListener("ended", handleEnded);
        };
    }, [song, isPlaying, duration, nextMusic]);

    // Handle volume and play state changes
    useEffect(() => {
        if (!audioRef.current) return;
        
        audioRef.current.volume = isMuted ? 0 : volume;
        
        if (isPlaying && song) {
            audioRef.current.play().catch(e => console.error("Auto-play prevented:", e));
        } else if (!isPlaying && audioRef.current) {
            audioRef.current.pause();
        }
    }, [volume, isMuted, isPlaying, song]);

    const handlePlayPause = () => {
        if (!audioRef.current || !song) return;
        setIsPlaying(!isPlaying);
    };

    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        setIsMuted(newVolume === 0);
    };

    const toggleMute = () => {
        setIsMuted(!isMuted);
    };

    const handleProgressChange = (e) => {
        if (!song || !duration) return;
        const newTime = (e.target.value / 100) * duration;
        if (audioRef.current) {
            audioRef.current.currentTime = newTime;
            setProgress(newTime);
            if (!isPlaying) {
                setIsPlaying(true);
            }
        }
    };

    const handleMobileProgressClick = (e) => {
        if (!mobileProgressContainerRef.current || !duration || !song) return;
        const rect = mobileProgressContainerRef.current.getBoundingClientRect();
        const clickPosition = e.clientX - rect.left;
        const clickPercentage = (clickPosition / rect.width) * 100;
        const newTime = (clickPercentage / 100) * duration;

        if (audioRef.current) {
            audioRef.current.currentTime = newTime;
            setProgress(newTime);
            if (mobileProgressRef.current) {
                mobileProgressRef.current.value = clickPercentage;
            }
            if (!isPlaying) {
                setIsPlaying(true);
            }
        }
    };

    const formatTime = (timeInSeconds) => {
        if (!timeInSeconds) return "0:00";
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const handleAddToPlaylist = () => {
        if (!song) return;
        addToPlaylist(song._id);
        setIsInPlaylist(!isInPlaylist);
    };

    // Don't render player if no song is selected (initial state)
    if (!selectedSong && initialLoad) {
        return null;
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50">
            {/* Progress bar - visible on mobile */}
            {song && (
                <div
                    ref={mobileProgressContainerRef}
                    className="md:hidden w-full h-2 bg-slate-700 relative group"
                    onClick={handleMobileProgressClick}
                >
                    <input
                        ref={mobileProgressRef}
                        type="range"
                        min="0"
                        max="100"
                        step="0.1"
                        className="absolute top-0 left-0 w-full h-4 -mt-1 opacity-0 cursor-pointer"
                        value={duration ? (progress / duration) * 100 : 0}
                        onChange={handleProgressChange}
                    />
                    <div className="relative w-full h-full">
                        <div className="absolute top-0 left-0 h-full bg-slate-600 w-full rounded-full" />
                        <div
                            className="absolute top-0 left-0 h-full bg-sky-500 rounded-full transition-all duration-75"
                            style={{ width: `${duration ? (progress / duration) * 100 : 0}%` }}
                        />
                        <div
                            className="absolute top-1/2 h-3 w-3 -mt-1.5 rounded-full bg-sky-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md"
                            style={{ left: `${duration ? (progress / duration) * 100 : 0}%`, transform: 'translateX(-50%)' }}
                        />
                    </div>
                    <div className="absolute top-0 left-0 w-full flex items-center justify-between px-2 -mt-5 text-xs text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span>{formatTime(progress)}</span>
                        <span>{formatTime(duration)}</span>
                    </div>
                </div>
            )}

            {/* Main player container */}
            {song ? (
                <div className="h-[90px] md:h-20 bg-black from-slate-800 to-slate-700 flex justify-between items-center text-white px-4 border-t border-slate-600 shadow-xl backdrop-blur-sm bg-opacity-90">
                    {/* Desktop left section */}
                    <div className="hidden md:flex items-center gap-4 w-1/3">
                        <img
                            src={song.thumbnail?.url || "https://dummyimage.com/50x50"}
                            className='w-16 h-16 rounded-md object-cover shadow-md hover:scale-105 transition-transform duration-300 border border-slate-500'
                            alt="Song cover"
                        />
                        <div className="overflow-hidden flex items-center gap-3">
                            <div className="overflow-hidden">
                                <p className="font-medium text-slate-100 truncate">{song.title || 'Unknown Title'}</p>
                                <p className="text-slate-300 text-sm truncate">{getArtistName()}</p>
                                <p className="text-slate-400 text-xs truncate">{getContextText()}</p>
                            </div>
                            <button
                                className={`text-slate-300 hover:text-white transition-colors duration-200 ${isInPlaylist ? 'bg-sky-500 text-white' : 'bg-slate-700'} p-2 rounded-full hover:bg-sky-500`}
                                onClick={handleAddToPlaylist}
                                title={isInPlaylist ? 'Remove from playlist' : 'Add to playlist'}
                            >
                                {isInPlaylist ? <FaCheck size={14} /> : <FaPlus size={14} />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile left section with blinking shadow effect when playing */}
                    <div className="md:hidden flex items-center gap-3 w-[70%] min-w-0">
                        <div className="relative">
                            <img
                                src={song.thumbnail?.url || "https://dummyimage.com/50x50"}
                                className={`w-12 h-12 rounded-md object-cover border border-slate-500 flex-shrink-0 hover:scale-105 transition-transform ${
                                    isPlaying ? 'shadow-[0_0_15px_0_rgba(56,189,248,0.7)] animate-[pulseShadow_1.5s_ease-in-out_infinite]' : 'shadow-md'
                                }`}
                                alt="Song cover"
                                onClick={() => setShowMobileDetails(true)}
                            />
                        </div>
                        <div className="min-w-0 flex-1" onClick={() => setShowMobileDetails(true)}>
                            <p className="font-medium text-slate-100 truncate text-sm">{song.title || 'Unknown Title'}</p>
                            <p className="text-slate-400 truncate text-xs mt-0.5">{getArtistName()}</p>
                            <p className="text-slate-500 truncate text-[11px] mt-0.5">{getContextText()}</p>
                        </div>
                        <button
                            className={`flex-shrink-0 text-slate-300 hover:text-white transition-colors duration-200 ${isInPlaylist ? 'bg-sky-500' : 'bg-slate-700'} p-2 rounded-full mr-[30px]`}
                            onClick={handleAddToPlaylist}
                        >
                            {isInPlaylist ? <FaCheck size={12} /> : <FaPlus size={12} />}
                        </button>
                    </div>

                    {/* Mobile controls */}
                    <div className="md:hidden flex justify-center items-center gap-4">
                        <button
                            className="text-slate-300 hover:text-sky-300 transition-colors duration-200 transform hover:scale-110"
                            onClick={prevMusic}
                            disabled={!song}
                        >
                            <GrChapterPrevious size={20} />
                        </button>
                        <button
                            className="bg-sky-500 text-white rounded-full p-3 hover:bg-sky-400 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                            onClick={handlePlayPause}
                            disabled={!song}
                        >
                            {isPlaying ? <FaPause size={16} /> : <FaPlay size={16} className="ml-0.5" />}
                        </button>
                        <button
                            className="text-slate-300 hover:text-sky-300 transition-colors duration-200 transform hover:scale-110"
                            onClick={nextMusic}
                            disabled={!song}
                        >
                            <GrChapterNext size={20} />
                        </button>
                    </div>

                    {/* Desktop center section */}
                    <div className="hidden md:flex flex-col items-center justify-center w-1/3">
                        {song?.audio && (
                            <audio 
                                ref={audioRef} 
                                src={song.audio.url} 
                                onError={(e) => console.error("Audio error:", e)}
                            />
                        )}

                        <div className="flex items-center justify-center gap-6 mb-2">
                            <button
                                className="text-slate-300 hover:text-sky-300 transition-colors duration-200 hover:scale-110"
                                onClick={prevMusic}
                                title="Previous"
                                disabled={!song}
                            >
                                <GrChapterPrevious size={22} />
                            </button>
                            <button
                                className="bg-sky-500 text-white rounded-full p-3 hover:bg-sky-400 transition-colors duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                                onClick={handlePlayPause}
                                title={isPlaying ? 'Pause' : 'Play'}
                                disabled={!song}
                            >
                                {isPlaying ? <FaPause size={18} /> : <FaPlay size={18} className="ml-0.5" />}
                            </button>
                            <button
                                className="text-slate-300 hover:text-sky-300 transition-colors duration-200 hover:scale-110"
                                onClick={nextMusic}
                                title="Next"
                                disabled={!song}
                            >
                                <GrChapterNext size={22} />
                            </button>
                        </div>

                        <div className="w-full flex items-center gap-3">
                            <span className="text-xs text-slate-400 w-10 text-right">
                                {formatTime(progress)}
                            </span>
                            <div className="relative flex-1 h-2 group">
                                <div className="absolute inset-0 h-full bg-slate-700 rounded-full overflow-hidden">
                                    <div
                                        className="absolute inset-0 h-full bg-gradient-to-r from-sky-500 to-blue-400 rounded-full transition-all duration-100"
                                        style={{ width: `${(progress / duration) * 100}%` }}
                                    />
                                </div>
                                <input
                                    ref={desktopProgressRef}
                                    type="range"
                                    min="0"
                                    max="100"
                                    step="0.1"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    value={(progress / duration) * 100}
                                    onChange={handleProgressChange}
                                    disabled={!song}
                                />
                                <div
                                    className="absolute top-1/2 h-3 w-3 -mt-1.5 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg transform -translate-x-1/2"
                                    style={{ left: `${(progress / duration) * 100}%` }}
                                />
                            </div>
                            <span className="text-xs text-slate-400 w-10">
                                {formatTime(duration)}
                            </span>
                        </div>
                    </div>

                    {/* Desktop right section */}
                    <div className="hidden md:flex items-center justify-end gap-3 w-1/3">
                        <button
                            onClick={toggleMute}
                            className="text-slate-300 hover:text-sky-300 transition-colors duration-200"
                            title={isMuted ? 'Unmute' : 'Mute'}
                            disabled={!song}
                        >
                            {isMuted ? <FaVolumeMute size={18} /> : <FaVolumeUp size={18} />}
                        </button>
                        <div className="relative w-24 h-2 group">
                            <div className="absolute inset-0 h-full bg-slate-700 rounded-full overflow-hidden">
                                <div
                                    className="absolute inset-0 h-full bg-gradient-to-r from-sky-500 to-blue-400 rounded-full transition-all duration-100"
                                    style={{ width: `${isMuted ? 0 : volume * 100}%` }}
                                />
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                value={isMuted ? 0 : volume}
                                onChange={handleVolumeChange}
                                disabled={!song}
                            />
                            <div
                                className="absolute top-1/2 h-3 w-3 -mt-1.5 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg transform -translate-x-1/2"
                                style={{ left: `${isMuted ? 0 : volume * 100}%` }}
                            />
                        </div>
                    </div>
                </div>
            ) : null}

            {/* Mobile details modal */}
            {showMobileDetails && song && (
                <MobileSongDetails
                    song={song}
                    onClose={() => setShowMobileDetails(false)}
                    isPlaying={isPlaying}
                    handlePlayPause={handlePlayPause}
                    nextMusic={nextMusic}
                    prevMusic={prevMusic}
                    isInPlaylist={isInPlaylist}
                    handleAddToPlaylist={handleAddToPlaylist}
                    progress={progress}
                    duration={duration}
                    formatTime={formatTime}
                    handleProgressChange={handleProgressChange}
                    currentContext={currentContext}
                />
            )}

            {/* Add the custom animation keyframes */}
            <style jsx>{`
                @keyframes pulseShadow {
                    0% {
                        box-shadow: 0 0 15px 0 rgba(56, 189, 248, 0.7);
                    }
                    50% {
                        box-shadow: 0 0 20px 2px rgba(56, 189, 248, 0.9);
                    }
                    100% {
                        box-shadow: 0 0 15px 0 rgba(56, 189, 248, 0.7);
                    }
                }
            `}</style>
        </div>
    );
};

export default Player;