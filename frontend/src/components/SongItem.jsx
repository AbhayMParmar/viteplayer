import React, { useEffect, useState } from 'react';
import { FaBookmark, FaPlay, FaRegBookmark } from 'react-icons/fa';
import { UserData } from '../context/User';
import { SongData } from '../context/song';

const SongItem = ({ image, name, desc, id, compact = false, hoverClass = "" }) => {
    const [saved, setSaved] = useState(false);
    const { addToPlaylist, user } = UserData();
    const { setSelectedSong, isPlaying, setIsPlaying } = SongData();
    const playList = user.playlist;

    useEffect(() => {
        if (playList && playList.includes(id)) {
            setSaved(true);
        }
    }, [user]);

    const savetoPlaylistHandler = (e) => {
        e.stopPropagation();
        setSaved(!saved);
        addToPlaylist(id);
    };

    const playSongHandler = (e) => {
        e.stopPropagation();
        setSelectedSong(id);
        setIsPlaying(true);
    };

    if (compact) {
        return (
            <div className={`w-[calc(50%-4px)] p-1 rounded cursor-pointer group ${hoverClass}`}>
                <div className="relative">
                    <img 
                        src={image} 
                        className='rounded'
                        style={{ width: '137.79px', height: '137.79px' }}
                        alt="" 
                    />
                    <button 
                        className='absolute bottom-3 right-3 bg-sky-400 text-black p-3 rounded-full opacity-0 
                        group-hover:opacity-100 transition-opacity duration-200 hover:scale-110'
                        style={{ transform: 'translate(2.5px, 2.5px)' }}
                        onClick={playSongHandler}
                    >
                        <FaPlay size={16} />
                    </button>
                </div>
                <p className='font-bold mt-2 mb-1 text-sm truncate'>{name}</p>
                <p className='text-slate-200 text-xs truncate'>{desc}</p>
            </div>
        );
    }

    return (
        <div className={`flex-none p-1 rounded cursor-pointer group ${hoverClass}`} style={{ width: '185px' }}>
            <div className="relative">
                <img 
                    src={image} 
                    className='rounded'
                    style={{ width: '180px', height: '180px' }}
                    alt="" 
                />
                <div className="absolute bottom-3 right-3 flex gap-3" style={{ transform: 'translate(2.5px, 2.5px)' }}>
                    <button 
                        className='bg-sky-400 text-black p-3 rounded-full opacity-0 
                        group-hover:opacity-100 transition-opacity duration-200 hover:scale-110'
                        onClick={playSongHandler}
                    >
                        <FaPlay size={16} />
                    </button>
                    <button 
                        className='bg-sky-400 text-black p-3 rounded-full opacity-0 
                        group-hover:opacity-100 transition-opacity duration-200 hover:scale-110'
                        onClick={savetoPlaylistHandler}
                    >
                        {saved ? <FaBookmark size={16} /> : <FaRegBookmark size={16} />}
                    </button>
                </div>
            </div>
            <p className='font-bold mt-2 mb-1 text-sm truncate'>{name}</p>
            <p className='text-slate-200 text-xs truncate'>{desc}</p>
        </div>
    );
};

export default SongItem;