import React, { useState, useEffect } from 'react';
import { assets } from '../assets/assets';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserData } from '../context/User';

const Navbar = ({ onMenuClick }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { logoutUser, user } = UserData();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.user-dropdown-container')) {
                setIsUserDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
        if (onMenuClick) onMenuClick(!isMobileMenuOpen);
    };

    const toggleUserDropdown = () => {
        setIsUserDropdownOpen(!isUserDropdownOpen);
    };

    const handleLogout = () => {
        logoutUser();
        setIsUserDropdownOpen(false);
    };

    const isHomeActive = location.pathname === '/';
    const isPlaylistActive = location.pathname === '/playlist';
    const isSearchActive = location.pathname === '/search';

    const handleAllClick = () => navigate("/");
    const handlePlaylistClick = () => navigate("/playlist");
    const handleSearch = (e) => {
        e.preventDefault();
        navigate('/search');
        if (searchQuery.trim()) {
            setSearchQuery('');
        }
    };

    const handleSearchInputClick = () => {
        if (!isSearchActive) {
            navigate('/search');
        }
    };

    const handleHomeClick = () => navigate("/");

    const getUserAvatar = () => {
        if (!user || !user.email) return '';
        const firstLetter = user.email.charAt(0).toUpperCase();
        const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-yellow-500', 'bg-pink-500'];
        const colorIndex = firstLetter.charCodeAt(0) % colors.length;
        return (
            <div className={`${colors[colorIndex]} w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold`}>
                {firstLetter}
            </div>
        );
    };

    return (
        <div className="fixed top-0 left-0 lg:left-[25%] right-0 z-50 bg-[#121212] px-4 py-2">
            <div className="flex justify-between items-center font-semibold">
                <div className="lg:hidden flex items-center gap-4">
                    <div
                        className="hamburger-menu cursor-pointer p-2 flex flex-col items-center justify-center"
                        onClick={toggleMobileMenu}
                    >
                        <div className={`hamburger-line w-6 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? 'transform rotate-45 translate-y-1.5' : 'mb-1.5'}`}></div>
                        <div className={`hamburger-line w-6 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : 'mb-1.5'}`}></div>
                        <div className={`hamburger-line w-6 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? 'transform -rotate-45 -translate-y-1.5' : ''}`}></div>
                    </div>
                    <p className="text-white font-bold text-lg md:hidden">Music App</p>
                </div>

                <div className="hidden lg:flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="relative group">
                            <img
                                src={assets.arrow_left}
                                className='w-9 bg-black p-2 rounded-2xl cursor-pointer transition-all duration-300 group-hover:bg-sky-400 group-hover:scale-110'
                                alt="Back"
                                onClick={() => navigate(-1)}
                            />
                        </div>
                        <div className="relative group">
                            <img
                                src={assets.arrow_right}
                                className='w-9 bg-black p-2 rounded-2xl cursor-pointer transition-all duration-300 group-hover:bg-sky-400 group-hover:scale-110'
                                alt="Forward"
                                onClick={() => navigate(+1)}
                            />
                        </div>
                    </div>
                    <div className="relative group">
                        <img
                            src={assets.home_icon}
                            className={`w-10 p-2 rounded-2xl cursor-pointer transition-all duration-300 ${isHomeActive ? 'bg-white/20' : 'bg-black'} hover:bg-sky-400 hover:scale-110`}
                            alt="Home"
                            onClick={handleHomeClick}
                        />
                    </div>
                    <form onSubmit={handleSearch} className="flex items-center relative">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onClick={handleSearchInputClick}
                            className="bg-[#282828] text-white text-sm pr-12 pl-4 py-3 h-10 rounded-2xl w-[350px] focus:outline-none focus:ring-2 focus:ring-white"
                        />
                        <button
                            type="submit"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        >
                            <img
                                src={assets.search_icon}
                                className={`w-5 h-5 cursor-pointer transition-all duration-300 ${isSearchActive ? 'opacity-80' : ''}`}
                                alt="Search"
                            />
                        </button>
                    </form>
                </div>

                <div className="flex items-center gap-4">
                    <button className='bg-white/10 backdrop-blur-md text-white text-[15px] px-4 py-1 rounded-full hidden md:block cursor-pointer border border-white/20 transition-all duration-300 hover:bg-white/20 hover:scale-105 hover:shadow-glow'>
                        Explore Premium
                    </button>
                    <button className='bg-white/10 backdrop-blur-md text-white text-[15px] px-4 py-1 rounded-full hidden md:block cursor-pointer border border-white/20 transition-all duration-300 hover:bg-white/20 hover:scale-105 hover:shadow-glow'>
                        Install App
                    </button>
                    <div className="user-dropdown-container relative">
                        <div
                            className="cursor-pointer flex items-center gap-2 bg-black/40 px-2 py-1 rounded-full transition-all duration-300 hover:bg-black/60"
                            onClick={toggleUserDropdown}
                        >
                            {user && user.email ? (
                                <>
                                    {getUserAvatar()}
                                    {isUserDropdownOpen && (
                                        <span className="text-white text-sm hidden md:block">
                                            {user.name || user.email.split('@')[0]}
                                        </span>
                                    )}
                                </>
                            ) : (
                                <button
                                    className='bg-sky-400 text-white text-sm md:text-[15px] px-4 py-1 rounded-full cursor-pointer transition-all duration-300 hover:shadow-lg hover:bg-sky-500 hover:scale-105'
                                    onClick={handleLogout}
                                >
                                    Login
                                </button>
                            )}
                        </div>

                        {isUserDropdownOpen && user && (
                            <div className="absolute right-0 mt-2 w-56 bg-[#1e1e1e] rounded-xl shadow-2xl z-50 border border-gray-700/50 overflow-hidden backdrop-blur-sm transition-all duration-300 transform origin-top">
                                <div className="px-4 py-3 hover:bg-[#282828]/50 transition-all duration-300 group/user-info relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-sky-400/5 to-transparent opacity-0 group-hover/user-info:opacity-100 transition-opacity duration-500 -translate-x-full group-hover/user-info:translate-x-0"></div>
                                    <p className="text-white font-medium truncate text-sm relative z-10 group-hover/user-info:text-sky-400 transition-colors duration-300">
                                        {user.name || 'User'}
                                    </p>
                                    <p className="text-gray-400 text-xs truncate mt-1 relative z-10 group-hover/user-info:text-gray-300 transition-colors duration-500">
                                        {user.email}
                                    </p>
                                </div>
                                <div className="relative h-px overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-sky-400/30 to-transparent animate-[pulse_3s_ease-in-out_infinite]"></div>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="w-full px-4 py-3 flex items-center gap-3 group/logout relative overflow-hidden transition-all duration-300 hover:bg-[#282828]/50"
                                >
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#00a6fb55_0%,transparent_70%)] opacity-0 group-hover/logout:opacity-100 scale-0 group-hover/logout:scale-100 transition-all duration-700 origin-center"></div>
                                    <div className="relative z-10">
                                        <svg className="w-5 h-5 text-gray-400 group-hover/logout:text-sky-400 transition-all duration-300 group-hover/logout:scale-110"
                                            fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                        <div className="absolute -inset-1 rounded-full bg-sky-400/10 opacity-0 group-hover/logout:opacity-100 group-hover/logout:animate-[ping_1.5s_ease-in-out_1]"></div>
                                    </div>
                                    <span className="relative z-10 text-sm text-gray-300 group-hover/logout:text-white transition-colors duration-300">
                                        <span>Logout</span>
                                        <span className="absolute bottom-0 left-0 w-0 h-px bg-sky-400 group-hover/logout:w-full transition-all duration-500"></span>
                                    </span>
                                    <svg className="ml-auto w-4 h-4 text-sky-400 opacity-0 -translate-x-2 group-hover/logout:opacity-100 group-hover/logout:translate-x-0 transition-all duration-500"
                                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="lg:hidden flex items-center justify-between gap-2 mt-4 pb-2">
                <form onSubmit={handleSearch} className="flex-1 relative">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onClick={handleSearchInputClick}
                        className="bg-[#282828] text-white text-sm pr-10 pl-3 py-2 h-10 rounded-full w-full focus:outline-none focus:ring-1 focus:ring-white"
                    />
                    <button
                        type="submit"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    >
                        <img src={assets.search_icon} className="w-5 h-5" alt="Search" />
                    </button>
                </form>

                <div className="flex items-center gap-2 ml-2">
                    <div className="relative group flex-shrink-0">
                        <p
                            className={`${isHomeActive ? 'bg-white text-black' : 'bg-black/80 text-white'} px-3 py-1 rounded-full cursor-pointer transition-all duration-300 hover:shadow-md text-sm`}
                            onClick={handleAllClick}
                        >
                            All
                        </p>
                        <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 ${isHomeActive ? 'w-3/4' : 'bg-sky-400 w-0 group-hover:w-3/4'} transition-all duration-300`}></div>
                    </div>
                    <div className="relative group flex-shrink-0">
                        <p
                            onClick={handlePlaylistClick}
                            className={`${isPlaylistActive ? 'bg-white text-black' : 'bg-black/80 text-white'} px-3 py-1 rounded-full cursor-pointer transition-all duration-300 hover:bg-black/60 hover:shadow-md text-sm`}
                        >
                            Playlists
                        </p>
                        <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 ${isPlaylistActive ? 'bg-white w-3/4' : 'bg-white w-0 group-hover:w-3/4'} transition-all duration-300`}></div>
                    </div>
                </div>
            </div>

            <div className="hidden lg:flex items-center gap-2 mt-6 overflow-x-auto pb-2">
                <div className="relative group flex-shrink-0">
                    <p
                        className={`${isHomeActive ? 'bg-white text-black' : 'bg-black/80 text-white'} px-4 py-1 rounded-full cursor-pointer transition-all duration-300 hover:shadow-md text-base`}
                        onClick={handleAllClick}
                    >
                        All
                    </p>
                    <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 ${isHomeActive ? 'w-3/4' : 'bg-sky-400 w-0 group-hover:w-3/4'} transition-all duration-300`}></div>
                </div>
                <div className="relative group flex-shrink-0">
                    <p className='bg-black/80 px-4 py-1 rounded-full cursor-pointer transition-all duration-300 hover:bg-black/60 hover:shadow-md'>
                        Music
                    </p>
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-sky-400 w-0 group-hover:w-3/4 transition-all duration-300"></div>
                </div>
                <div className="relative group flex-shrink-0">
                    <p className='bg-black/80 px-4 py-1 rounded-full cursor-pointer transition-all duration-300 hover:bg-black/60 hover:shadow-md'>
                        Podcasts
                    </p>
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-sky-400 w-0 group-hover:w-3/4 transition-all duration-300"></div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;