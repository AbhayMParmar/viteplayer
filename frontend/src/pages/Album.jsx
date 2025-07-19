import React, { useEffect, useState, useRef } from 'react';
import Layout from '../components/Layout';
import { SongData } from '../context/song';
import { useParams } from 'react-router-dom';
import { UserData } from '../context/User';
import { FaPlay, FaEllipsisH } from 'react-icons/fa';
import { MdAudiotrack } from 'react-icons/md';

const Album = () => {
    const { 
        fetchAlbumSong, 
        albumData, 
        albumSong, 
        setSelectedSong, 
        setIsPlaying, 
        selectedSong, 
        isPlaying,
        setAlbumSongs
    } = SongData();
    const { user, addToPlaylist } = UserData();
    const params = useParams();
    const [activeItem, setActiveItem] = useState(null);
    const [isHovered, setIsHovered] = useState(false);
    const [menuOpen, setMenuOpen] = useState(null);
    const menuRef = useRef(null);

    useEffect(() => {
        fetchAlbumSong(params.id);
    }, [params.id]);

    useEffect(() => {
        if (albumSong && albumSong.length > 0) {
            setAlbumSongs(albumSong);
        }
    }, [albumSong]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, []);

    const playSong = (id, index) => {
        setSelectedSong(id);
        setIsPlaying(true);
        setActiveItem(index);
        setMenuOpen(null);
    };

    const toggleMenu = (index) => {
        setMenuOpen(menuOpen === index ? null : index);
    };

    return (
        <Layout>
            <div className="bg-[#121212] min-h-screen text-gray-100 p-4 md:p-8">
                {/* Album Header */}
                <div className="flex flex-col md:flex-row items-start gap-6 mb-8">
                    <div 
                        className="w-full md:w-[250px] lg:w-[300px] aspect-square relative group"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        onTouchStart={() => setIsHovered(true)}
                        onTouchEnd={() => setIsHovered(false)}
                    >
                        <div className={`
                            absolute -inset-2 rounded-xl transition-all duration-500
                            ${isHovered ? 'bg-gradient-to-br from-sky-400/30 to-sky-500/30 blur-md' : 'opacity-0'}
                            z-0
                        `}></div>
                        {albumData?.thumbnail ? (
                            <div className="relative w-full h-full overflow-hidden rounded-lg shadow-lg z-10">
                                <img 
                                    src={albumData.thumbnail.url} 
                                    className="w-full h-full object-cover transition-all duration-300"
                                    alt={albumData.title}
                                />
                                <div className={`
                                    absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center 
                                    transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}
                                `}>
                                    <button 
                                        onClick={() => albumSong[0] && playSong(albumSong[0]._id, 0)}
                                        className={`
                                            transform transition-all duration-300 flex items-center justify-center
                                            ${isHovered ? 'scale-100' : 'scale-90'} 
                                            bg-sky-400 text-black rounded-full p-4 shadow-xl
                                            hover:bg-sky-300 active:scale-95
                                        `}
                                    >
                                        <FaPlay className="text-xl" />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="w-full h-full bg-[#282828] rounded-lg flex items-center justify-center z-10">
                                <MdAudiotrack className="text-7xl text-[#535353]" />
                            </div>
                        )}
                    </div>
                    <div className="flex-1 w-full">
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 line-clamp-2">
                            {albumData?.title}
                        </h1>
                        <p className="text-[#b3b3b3] text-sm md:text-base mb-4 line-clamp-3">
                            {albumData?.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm">
                            <span className="px-3 py-1 bg-[#2a2a2a] rounded-full text-[#b3b3b3]">
                                Album
                            </span>
                            <span className="text-[#b3b3b3]">
                                {albumSong?.length} {albumSong?.length === 1 ? 'song' : 'songs'}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="space-y-2">
                    {albumSong?.length > 0 ? (
                        albumSong.map((song, index) => (
                            <div 
                                key={song._id}
                                className={`flex items-center p-3 rounded-lg transition-colors cursor-pointer 
                                    ${selectedSong === song._id && isPlaying 
                                        ? 'bg-[#1a3c4a]' 
                                        : activeItem === index 
                                            ? 'bg-[#2a2a2a]' 
                                            : 'hover:bg-[#2a2a2a]'}`}
                                onClick={() => playSong(song._id, index)}
                            >
                                <div className="w-10 text-center text-[#b3b3b3]">
                                    {activeItem === index ? (
                                        <FaPlay className="mx-auto text-[#50d2ef]" />
  ) : (
                                        selectedSong === song._id && isPlaying ? (
                                            <FaPlay className="mx-auto text-[#50d2ef] animate-pulse" />
                                        ) : (
                                            <span>{index + 1}</span>
                                        )
                                    )}
                                </div>
                                <div className="w-12 h-12 md:w-14 md:h-14 ml-2 mr-4">
                                    <img 
                                        src={song.thumbnail.url} 
                                        className="w-full h-full object-cover rounded"
                                        alt={song.title}
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className={`text-sm md:text-base font-medium truncate ${selectedSong === song._id ? 'text-[#50d2ef]' : 'text-white'}`}>
                                        {song.title}
                                    </h3>
                                    <p className="text-[#b3b3b3] text-xs md:text-sm truncate">
                                        {song.singer}
                                    </p>
                                </div>
                                <div className="flex items-center gap-4 relative" ref={menuRef}>
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            addToPlaylist(song._id);
                                        }}
                                        className={`transition-all duration-300 transform hover:scale-110 p-1
                                            ${user?.playlist?.includes(song._id.toString()) 
                                                ? 'text-sky-400 scale-105' 
                                                : 'text-[#b3b3b3] hover:text-[#50d2ef]'}`}
                                    >
                                        <svg
                                            className={`w-5 h-5 ${user?.playlist?.includes(song._id.toString()) ? 'animate-pulse-once' : ''}`}
                                            fill={user?.playlist?.includes(song._id.toString()) ? '#50d2ef' : 'none'}
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                                            />
                                        </svg>
                                    </button>
                                    <button 
                                        className="text-[#b3b3b3] hover:text-white hover:bg-[#2a2a2a] rounded-full p-2 transition-all duration-200 transform hover:scale-110 focus:outline-none"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleMenu(index);
                                        }}
                                        onTouchStart={(e) => {
                                            e.stopPropagation();
                                            toggleMenu(index);
                                        }}
                                        aria-label={`More options for ${song.title}`}
                                    >
                                        <FaEllipsisH size={16} />
                                    </button>
                                    {menuOpen === index && (
                                        <div 
                                            className="absolute right-0 top-full mt-2 w-80 max-w-[90vw] bg-[#282828] rounded-xl shadow-2xl z-20 p-4 
                                            border border-[#ffffff1a] backdrop-blur-sm animate-[dropdown_0.3s_ease-out] 
                                            hover:shadow-[0_0_10px_#50d2ef] hover:bg-gradient-to-br hover:from-[#282828] hover:to-[#2a2a2a]
                                            transition-all duration-300 transform origin-top-right scale-95"
                                            style={{ animation: 'dropdown 0.3s ease-out forwards' }}
                                            onMouseEnter={(e) => e.currentTarget.classList.add('scale-100', 'shadow-[0_0_15px_rgba(80,210,239,0.5)]')}
                                            onMouseLeave={(e) => e.currentTarget.classList.remove('scale-100', 'shadow-[0_0_15px_rgba(80,210,239,0.5)]')}
                                            onTouchStart={(e) => e.currentTarget.classList.add('scale-100', 'shadow-[0_0_15px_rgba(80,210,239,0.5)]')}
                                            onTouchEnd={(e) => e.currentTarget.classList.remove('scale-100', 'shadow-[0_0_15px_rgba(80,210,239,0.5)]')}
                                        >
                                            <div className="flex items-center space-x-3 mb-3">
                                                <div className="relative group">
                                                    <img 
                                                        src={song.thumbnail.url} 
                                                        className="w-12 h-12 object-cover rounded-lg transition-transform duration-300 group-hover:scale-110"
                                                        alt={song.title}
                                                    />
                                                    <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_8px_rgba(80,210,239,0.7)]"></div>
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-bold text-white truncate hover:text-[#50d2ef] transition-all duration-200 hover:scale-105 origin-left">
                                                        {song.title}
                                                    </h3>
                                                    <p className="text-xs text-[#b3b3b3] truncate hover:text-white transition-all duration-200">
                                                        {song.singer}
                                                    </p>
                                                </div>
                                            </div>
                                            <hr className="border-[#ffffff1a] mb-3 animate-[borderPulse_2s_infinite]" />
                                            <p className="text-xs text-[#b3b3b3] line-clamp-4 hover:text-white transition-all duration-200 hover:scale-105 origin-left">
                                                {song.description || 'No description available'}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16">
                            <div className="max-w-xs bg-[#282828] rounded-xl p-6 text-center">
                                <MdAudiotrack className="text-6xl text-[#535353] mx-auto mb-4" />
                                <h3 className="text-lg font-medium mb-2 text-white">
                                    No songs in this album
                                </h3>
                                <p className="text-[#b3b3b3] text-sm">
                                    This album doesn't contain any songs yet
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default Album;

// CSS Keyframes for dropdown, border, and pulse animations
const style = document.createElement('style');
style.textContent = `
@keyframes dropdown {
    0% {
        transform: translateY(-10px) scale(0.95);
        opacity: 0;
    }
    60% {
        transform: translateY(2px) scale(1.02);
        opacity: 1;
    }
    100% {
        transform: translateY(0) scale(1);
        opacity: 1;
    }
}
@keyframes borderPulse {
    0% {
        border-color: rgba(255, 255, 255, 0.1);
    }
    50% {
        border-color: rgba(80, 210, 239, 0.3);
    }
    100% {
        border-color: rgba(255, 255, 255, 0.1);
    }
}
@keyframes pulse-once {
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.3);
    }
    100% {
        transform: scale(1.05);
    }
}
.animate-pulse-once {
    animation: pulse-once 0.3s ease-out;
}
`;
document.head.appendChild(style);