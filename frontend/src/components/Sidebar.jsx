import React from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import PlayListCard from './PlayListCard';
import { UserData } from '../context/User';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {
  const navigate = useNavigate();
  const { user } = UserData();

  return (
    <div className="w-[25%] h-screen flex-col text-white hidden lg:flex sticky top-0 pr-2 pl-[5px] pt-[6px]">
      {/* First Container: Your Library and Playlist */}
      <div className="bg-[#1a1a1a] h-[30%] shadow-2xl overflow-y-auto custom-scrollbar flex flex-col border border-gray-800 m-0 mb-2">
        {/* Header Section */}
        <div className="p-4 flex items-center bg-[#1a1a1a] sticky top-0 z-10">
          <div className="flex items-center gap-3 group">
            <img 
              src={assets.stack_icon} 
              className="w-8 transform group-hover:scale-110 transition-transform duration-300" 
              alt="Library icon" 
            />
            <p className="font-bold text-lg group-hover:text-sky-400 transition-colors duration-300">
              Your Library
            </p>
          </div>
        </div>

        {/* Playlist Card */}
        <div
          onClick={() => navigate('/playlist')}
          className="mx-2 my-2 hover:bg-sky-400/20 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
        >
          <PlayListCard />
        </div>
      </div>

      {/* Second Container: Podcast and Admin Dashboard */}
      <div className="bg-[#1a1a1a] h-[70%] shadow-2xl overflow-y-auto custom-scrollbar flex flex-col border border-gray-800 m-0">
        {/* Podcast Section */}
        <div className="p-4 bg-gradient-to-br from-[#2c2c2c] to-[#1a1a1a] font-semibold flex flex-col items-start gap-2">
          <h1 className="text-xl font-bold group-hover:text-sky-400 transition-colors duration-300">
            Discover Podcasts
          </h1>
          <p className="font-light text-sm text-gray-300 group-hover:text-sky-400 transition-colors duration-300">
            Follow your favorite shows
          </p>
          <button 
            className="px-4 py-2 bg-sky-400 text-black text-[15px] font-semibold rounded-full hover:bg-sky-500 hover:shadow-[0_0_15px_rgba(56,189,248,0.5)] transition-all duration-300 transform hover:scale-105"
          >
            Browse Podcasts
          </button>
        </div>

        {/* Admin Dashboard Button */}
        {user && user.role === 'admin' && (
          <div className="px-4 py-2">
            <button
              className="relative w-full px-4 py-2 bg-[#1a1a1a] text-white text-[15px] font-bold tracking-wide rounded-xl shadow-lg hover:bg-sky-400/20 hover:shadow-[0_0_20px_rgba(56,189,248,0.7)] hover:scale-105 hover:-rotate-1 transition-all duration-300 flex items-center justify-start gap-2 overflow-hidden group"
              onClick={() => navigate('/admin')}
              style={{
                position: 'relative',
              }}
            >
              <FontAwesomeIcon
                icon={faCircleUser}
                className="w-6 h-6 animate-pulse group-hover:animate-none"
              />
              <span>Admin Dashboard</span>
              <span
                className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                style={{
                  animation: 'ripple 1.5s ease-out infinite',
                  background: 'radial-gradient(circle, rgba(56,189,248,0.3) 0%, transparent 70%)',
                  pointerEvents: 'none',
                }}
              ></span>
              <style>
                {`
                  @keyframes ripple {
                    0% {
                      transform: scale(0);
                      opacity: 0.3;
                    }
                    100% {
                      transform: scale(4);
                      opacity: 0;
                    }
                  }
                `}
              </style>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;