import React, { useEffect, useState, useRef } from 'react';
import Layout from '../components/Layout';
import { SongData } from '../context/song';
import { FaPlay, FaEllipsisH } from 'react-icons/fa';
import { UserData } from '../context/User';
import { MdAudiotrack } from 'react-icons/md';

const PlayList = ({ user }) => {
    const { songs, setSelectedSong, setIsPlaying, selectedSong, isPlaying, setPlaylistSongs } = SongData();
    const { addToPlaylist } = UserData();
    const [myPlaylist, setMyPlaylist] = useState([]);
    const [activeItem, setActiveItem] = useState(null);
    const [menuOpen, setMenuOpen] = useState(null);
    const menuRef = useRef(null);

    useEffect(() => {
        if (songs && user && Array.isArray(user.playlist)) {
            const filteredSongs = songs.filter((e) =>
                user.playlist.includes(e._id.toString())
            );
            setMyPlaylist(filteredSongs);
            setPlaylistSongs(filteredSongs);
        }
    }, [songs, user]);

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
            <div className="bg-[#121212] min-h-screen text-gray-100 p-4">
                <div className="flex flex-col md:flex-row items-center mb-6">
                    <div className="relative w-full max-w-[280px] aspect-square mb-4 md:mb-0 md:mr-6">
                        {myPlaylist[0] ? (
                            <img 
                                src={myPlaylist[0].thumbnail.url} 
                                className="w-full h-full object-cover rounded-xl shadow-2xl"
                                alt="Playlist cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-[#282828] rounded-xl flex items-center justify-center">
                                <MdAudiotrack className="text-6xl text-[#535353]" />
                            </div>
                        )}
                        <button 
                            onClick={() => myPlaylist[0] && playSong(myPlaylist[0]._id, 0)}
                            className="absolute bottom-3 right-3 bg-sky-400 text-black rounded-full p-3 shadow-lg hover:bg-sky-300 transition-colors"
                        >
                            <FaPlay className="text-lg" />
                        </button>
                    </div>
                    <div className="text-left md:text-left w-full px-4 mr-[25px]">
                        <h1 className="text-2xl font-bold mb-2 truncate">
                            {user?.name}'s Playlist
                        </h1>
                        <p className="text-[#b3b3b3] text-xs mb-3 line-clamp-2">
                            Your personal collection of favorite tracks
                        </p>
                        <div className="flex justify-left md:justify-start space-x-3 text-xs">
                            <span className="px-2 py-1 bg-[#2a2a2a] rounded-full text-[#b3b3b3]">Personal</span>
                            <span className="text-[#b3b3b3] mt-[4px]">{myPlaylist.length} {myPlaylist.length === 1 ? 'song' : 'songs'}</span>
                        </div>
                    </div>
                </div>
                <div className="space-y-1 px-0 md:px-0">
                    {myPlaylist.length > 0 ? (
                        myPlaylist.map((song, index) => (
                            <div 
                                key={song._id}
                                className={`flex items-center p-2 md:p-3 rounded-lg transition-all duration-200 cursor-pointer 
                                    ${selectedSong === song._id && isPlaying 
                                        ? 'bg-[#1a3c4a]' 
                                        : activeItem === index 
                                            ? 'bg-[#2a2a2a]' 
                                            : ''}`}
                                onClick={() => playSong(song._id, index)}
                            >
                                <div className="w-8 text-center text-[#b3b3b3]">
                                    {activeItem === index ? (
                                        <FaPlay className="mx-auto text-[#50d2ef]" />
                                    ) : (
                                        selectedSong === song._id && isPlaying ? (
                                            <FaPlay className="mx-auto text-[#50d2ef] animate-pulse" />
                                        ) : (
                                            index + 1
                                        )
                                    )}
                                </div>
                                <img 
                                    src={song.thumbnail.url} 
                                    className="w-10 h-10 object-cover rounded-lg mr-2 md:mr-3"
                                    alt={song.title}
                                />
                                <div className="hidden md:flex items-center flex-1 min-w-0">
                                    <div className="min-w-0">
                                        <h3 className={`text-sm font-medium truncate ${selectedSong === song._id ? 'text-[#50d2ef]' : 'text-white'}`}>
                                            {song.title}
                                        </h3>
                                        <p className="text-[#b3b3b3] text-xs truncate">{song.singer}</p>
                                    </div>
                                </div>
                                <div className="md:hidden flex flex-col flex-1 min-w-0 ml-1">
                                    <h3 className={`text-sm font-medium truncate ${selectedSong === song._id ? 'text-[#50d2ef]' : 'text-white'}`}>
                                        {song.title}
                                    </h3>
                                    <p className="text-[#b3b3b3] text-xs truncate">{song.singer}</p>
                                </div>
                                <div className="flex items-center space-x-1 md:space-x-2 relative" ref={menuRef}>
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
                                        <FaEllipsisH size={14} />
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
                        <div className="text-center py-12">
                            <div className="max-w-[280px] mx-auto bg-[#282828] rounded-xl p-6">
                                <MdAudiotrack className="text-5xl text-[#535353] mx-auto mb-3" />
                                <h3 className="text-base font-medium mb-2 text-white">Your playlist is empty</h3>
                                <p className="text-[#b3b3b3] text-xs">Start adding your favorite songs to see them here</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default PlayList;

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