import React from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { UserData } from '../context/User';
import PlayListCard from './PlayListCard';

const MobileSidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { user } = UserData();

  const handleItemClick = (path) => {
    navigate(path);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Sidebar Content */}
      <div className="absolute left-0 top-0 h-full w-3/4 bg-[#121212] overflow-y-auto">
       

        <div className='flex flex-col gap-6 p-4 pt-16'>
          <div 
            className='flex items-center gap-3 p-3 rounded hover:bg-[#282828] cursor-pointer'
            onClick={() => handleItemClick("/")}
          >
            <img src={assets.home_icon} className='w-6' alt="Home" />
            <p className='font-bold text-white'>Home</p>
          </div>
                 
          <div className="border-t border-gray-800 my-2"></div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={assets.stack_icon} className='w-8' alt="Library" />
              <p className='font-semibold text-white'>Your Library</p>
            </div>
          </div>
          
          <div 
            onClick={() => handleItemClick("/playlist")}
            className='hover:bg-[#282828] text-white transition-all rounded'
          >
            <PlayListCard />
          </div>
          
          <div className="p-4 bg-gradient-to-br from-[#2c2c2c] to-[#121212] rounded font-semibold flex flex-col gap-2">
            <h1 className='text-lg text-white'>Let's find some podcasts</h1>
            <button className='px-4 py-1.5 bg-white text-black rounded-full hover:scale-105 transition-transform'>
              Browse Podcasts
            </button>
          </div>
          
          {user && user.role === "admin" && (
            <button 
              className='w-full px-4 py-2 bg-white text-black rounded-full hover:bg-gray-200 transition-all'
              onClick={() => handleItemClick("/admin")}
            >
              Admin Dashboard
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileSidebar;