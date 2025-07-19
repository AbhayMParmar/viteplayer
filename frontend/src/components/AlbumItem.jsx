import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlay } from 'react-icons/fa';
import { SongData } from '../context/song';

const AlbumItem = ({ image, name, desc, id, compact = false, hoverClass = "" }) => {
    const navigate = useNavigate();
    const { songs, setSelectedSong, setIsPlaying } = SongData();

    const handlePlayAlbum = async (e) => {
        e.stopPropagation();
        
        // Get all songs in this album and sort by track number
        const albumSongs = songs
            .filter(song => song.album === id)
            .sort((a, b) => a.trackNumber - b.trackNumber);
        
        if (albumSongs.length > 0) {
            // Play the LAST song (highest track number)
            const lastSong = albumSongs[albumSongs.length - 1];
            setSelectedSong(lastSong._id);
            setIsPlaying(true);
            
            // Wait for state updates to complete
            await new Promise(resolve => setTimeout(resolve, 0));
            
            // Navigate to album page
            navigate("/album/"+id);
        }
    };

    // Container size with 5px padding on each side (10px total increase)
    const containerStyle = {
        width: compact ? '147.79px' : '190px',
        padding: '5px'
    };

    const imageStyle = {
        width: compact ? '137.79px' : '180px',
        height: compact ? '137.79px' : '180px'
    };

    if (compact) {
        return (
            <div 
                className={`flex-shrink-0 rounded cursor-pointer group ${hoverClass}`}
                style={containerStyle}
                onClick={() => navigate("/album/"+id)}
            >
                <div className="relative">
                    <img 
                        src={image} 
                        className='rounded object-cover'
                        style={imageStyle}
                        alt="" 
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded">
                        <button 
                            className='absolute bottom-4 right-4 bg-sky-400 text-black p-3 rounded-full opacity-0 
                            group-hover:opacity-100 transition-all duration-200 hover:scale-110'
                            onClick={handlePlayAlbum}
                        >
                            <FaPlay size={18} />
                        </button>
                    </div>
                </div>
                <p className='font-bold mt-2 mb-1 text-sm truncate'>{name}</p>
                <p className='text-slate-200 text-xs truncate'>{desc}</p>
            </div>
        );
    }

    return (
        <div 
            className={`flex-none rounded cursor-pointer group ${hoverClass}`}
            style={containerStyle}
            onClick={() => navigate("/album/"+id)}
        >
            <div className="relative">
                <img 
                    src={image} 
                    className='rounded object-cover'
                    style={imageStyle}
                    alt="" 
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded">
                    <button 
                        className='absolute bottom-4 right-4 bg-sky-400 text-black p-3 rounded-full opacity-0 
                        group-hover:opacity-100 transition-all duration-200 hover:scale-110'
                        onClick={handlePlayAlbum}
                    >
                        <FaPlay size={18} />
                    </button>
                </div>
            </div>
            <p className='font-bold mt-2 mb-1 text-sm truncate'>{name}</p>
            <p className='text-slate-200 text-xs truncate'>{desc}</p>
        </div>
    );
};

export default AlbumItem;