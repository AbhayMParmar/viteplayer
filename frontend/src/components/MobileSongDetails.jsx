import React from 'react';
import { FaChevronDown, FaPause, FaPlay, FaPlus, FaCheck } from 'react-icons/fa';
import { GrChapterNext, GrChapterPrevious } from "react-icons/gr";

const MobileSongDetails = ({ 
    song,
    onClose,
    isPlaying,
    handlePlayPause,
    nextMusic,
    prevMusic,
    isInPlaylist,
    handleAddToPlaylist,
    progress,
    duration,
    formatTime,
    handleProgressChange,
    currentContext
}) => {
    if (!song) return null;

    const getContextText = () => {
        if (!currentContext) return 'Now Playing';
        return `Now Playing • ${
            {
                playlist: 'From Playlist',
                album: 'From Album',
                all: 'From Library'
            }[currentContext] || ''
        }`;
    };

    const getArtistName = () => {
        if (!song) return 'Unknown Artist';
        
        if (song.artist) {
            if (typeof song.artist === 'string') return song.artist;
            if (song.artist.name) return song.artist.name;
        }
        if (song.singer) return song.singer;
        if (song.artistName) return song.artistName;
        if (song.artists) {
            if (Array.isArray(song.artists)) {
                return song.artists.map(a => a.name || a).join(', ');
            }
            return song.artists;
        }
        return 'Unknown Artist';
    };

    return (
        <div className="fixed inset-0 z-50 bg-gradient-to-b from-black to-slate-900 flex flex-col p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <p className="text-slate-400 text-sm transition-all duration-700 
                    hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-sky-400 hover:to-sky-400">
                    {getContextText()}
                </p>
                <button 
                    onClick={onClose}
                    className="text-white p-2 rounded-full transition-all duration-500
                    hover:bg-gradient-to-br hover:from-sky-500 hover:to-sky-600
                    hover:scale-110 hover:rotate-180 hover:shadow-[0_0_20px_-5px_rgba(56,189,248,0.5)]
                    hover:text-white/90"
                >
                    <FaChevronDown size={20} />
                </button>
            </div>

            {/* Album Art */}
            <div className="flex-1 flex items-center justify-center mb-6 perspective-800">
                <div className="relative w-full max-w-[300px] transition-all duration-700 hover:rotate-x-6 hover:rotate-y-6">
                    <img
                        src={song.thumbnail?.url || "https://dummyimage.com/300x300"}
                        className={`w-full rounded-xl object-cover aspect-square shadow-2xl
                        transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]
                        hover:saturate-150 hover:contrast-110
                        ${isPlaying ? 'animate-[pulseShadow_1.5s_ease-in-out_infinite]' : 'shadow-sky-700'}`}
                        alt="Song cover"
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-sky-500/20 via-transparent to-sky-500/20 opacity-0 hover:opacity-100 transition-opacity duration-700 mix-blend-overlay" />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-black/30 via-transparent to-black/30 opacity-0 hover:opacity-100 transition-opacity duration-500" />
                </div>
            </div>

            {/* Song Info */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-8 mx-[11px]">
                    <div className="transition-all duration-500 hover:translate-x-1 group">
                        <h2 className="text-2xl font-bold text-white transition-all duration-700
                            hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-sky-400 hover:to-sky-400">
                            {song.title || 'Unknown Title'}
                        </h2>
                        <p className="text-slate-300 transition-all duration-700
                            hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-sky-400 hover:to-sky-400">
                            {getArtistName()}
                        </p>
                    </div>
                    <button
                        onClick={handleAddToPlaylist}
                        className={`p-3 rounded-full relative overflow-hidden transition-all duration-500
                        ${isInPlaylist ? 
                            'bg-gradient-to-br from-sky-600 to-sky-600 hover:from-sky-500 hover:to-sky-500' : 
                            'bg-gradient-to-br from-slate-700 to-slate-600 hover:from-slate-500 hover:to-slate-400'
                        }
                        hover:scale-110 hover:shadow-lg hover:shadow-slate-500/40
                        before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/30 before:via-white/15 before:to-transparent
                        before:opacity-0 hover:before:opacity-100 before:transition-all before:duration-700`}
                    >
                        {isInPlaylist ? 
                            <FaCheck size={16} className="relative transition-all duration-500 hover:rotate-[360deg] hover:scale-125" /> : 
                            <FaPlus size={16} className="relative transition-all duration-500 hover:rotate-180 hover:scale-125" />
                        }
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="w-full flex items-center gap-3 group ml-[7px]">
                    <span className="text-xs text-slate-400 w-[1.5rem] transition-all duration-500
                        hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-sky-300 hover:to-sky-300">
                        {formatTime(progress)}
                    </span>
                    <div className="relative flex-1 h-2 bg-gradient-to-r from-slate-700 to-slate-600 rounded-full transition-all duration-500 group-hover:h-[6px] group-hover:bg-slate-600">
                        <div
                            className="absolute inset-0 h-full bg-gradient-to-r from-sky-400 to-sky-400 rounded-full transition-all duration-300 group-hover:shadow-[0_0_15px_0_rgba(56,189,248,0.7)]"
                            style={{ width: `${duration ? (progress / duration) * 100 : 0}%` }}
                        />
                        <input
                            type="range"
                            min="0"
                            max="100"
                            step="0.1"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            value={duration ? (progress / duration) * 100 : 0}
                            onChange={handleProgressChange}
                        />
                        <div className="absolute h-2 w-full top-1/2 -translate-y-1/2 pointer-events-none
                            group-hover:h-[6px] transition-all duration-300"></div>
                        <div
                            className="absolute top-1/2 h-3 w-3 -mt-1.5 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg transform -translate-x-1/2"
                            style={{ left: `${duration ? (progress / duration) * 100 : 0}%` }}
                        />
                    </div>
                    <span className="text-xs text-slate-400 w-10 transition-all duration-500
                        hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-sky-300 hover:to-sky-300">
                        {formatTime(duration)}
                    </span>
                </div>
            </div>

            {/* Player Controls */}
            <div className="flex items-center justify-center gap-6 mb-[25px]">
                <button 
                    onClick={prevMusic} 
                    className="text-white text-2xl p-2 rounded-full transition-all duration-300 
                    hover:bg-slate-700/50 hover:shadow-[0_0_15px_-3px_rgba(255,255,255,0.2)]"
                >
                    <GrChapterPrevious size={24} />
                </button>
                <button 
                    onClick={handlePlayPause} 
                    className="bg-gradient-to-br from-sky-500 to-sky-500 text-white rounded-full p-4
                    transition-all duration-300 hover:scale-105 hover:from-sky-400 hover:to-sky-400
                    hover:shadow-[0_0_20px_-5px_rgba(56,189,248,0.7)]
                    active:scale-95"
                >
                    {isPlaying ? 
                        <FaPause size={24} className="transition-all duration-300 hover:scale-90" /> : 
                        <FaPlay size={24} className="relative left-[1px] transition-all duration-300 hover:scale-110" />
                    }
                </button>
                <button 
                    onClick={nextMusic} 
                    className="text-white text-2xl p-2 rounded-full transition-all duration-300 
                    hover:bg-slate-700/50 hover:shadow-[0_0_15px_-3px_rgba(255,255,255,0.2)]"
                >
                    <GrChapterNext size={24} />
                </button>
            </div>

            {/* Add the custom animation keyframes */}
            <style jsx>{`
                @keyframes pulseShadow {
                    0% {
                        box-shadow: 0 0 20px 0 rgba(56, 189, 248, 0.7);
                    }
                    50% {
                        box-shadow: 0 0 30px 5px rgba(56, 189, 248, 0.9);
                    }
                    100% {
                        box-shadow: 0 0 20px 0 rgba(56, 189, 248, 0.7);
                    }
                }
            `}</style>
        </div>
    );
};

export default MobileSongDetails;