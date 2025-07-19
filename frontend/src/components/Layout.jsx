import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Player from './Player';
import MobileSidebar from './MobileSidebar';

const Layout = ({children}) => {
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    return (
        <div className='h-screen relative'>
            <div className='h-[90%] flex'>
                {/* Always show sidebar */}
                <Sidebar />
                
                <MobileSidebar 
                    isOpen={isMobileSidebarOpen} 
                    onClose={() => setIsMobileSidebarOpen(false)}
                />
                
                {/* Main content area */}
                <div className="w-[100%] m-2 p-6 pt-4 rounded bg-[#121212] text-white overflow-auto lg:w-[75%] lg:ml-0">
                    <Navbar onMenuClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)} />
                    {/* Extra padding for fixed navbar */}
                    <div className="pt-24">
                        {children}
                    </div>
                </div>
            </div>
            <Player />
        </div>
    );
};

export default Layout;