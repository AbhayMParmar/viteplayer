import React from 'react';

const Loading = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#121212] bg-opacity-90">
      {/* Main spinner with gradient effect */}
      <div className="relative w-24 h-24">
        {/* Outer ring with pulse animation */}
        <div className="absolute inset-0 rounded-full border-4 border-sky-400 border-opacity-30 animate-pulse"></div>
        
        {/* Main spinning ring with gradient */}
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-sky-400 border-r-sky-400 animate-spin">
          <div className="absolute -top-1 -left-1 w-2 h-2 rounded-full bg-sky-400 shadow-[0_0_10px_2px_rgba(56,189,248,0.8)]"></div>
          <div className="absolute -bottom-1 -right-1 w-2 h-2 rounded-full bg-sky-400 shadow-[0_0_10px_2px_rgba(56,189,248,0.8)]"></div>
        </div>
        
        {/* Inner dot with glow effect */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-sky-400 shadow-[0_0_15px_5px_rgba(56,189,248,0.6)] animate-pulse"></div>
        </div>
      </div>
      
      {/* Text with typing animation */}
      <div className="mt-6 text-center">
        <span className="text-sky-400 text-lg font-medium relative">
          Loading
          <span className="typing-dots">
            <span className="animate-bounce">.</span>
            <span className="animate-bounce delay-100">.</span>
            <span className="animate-bounce delay-200">.</span>
          </span>
        </span>
      </div>
      
      {/* Subtle floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-sky-400 opacity-20"
            style={{
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 6 + 4}s linear infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>
      
      {/* CSS for custom animations */}
      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0) translateX(0); opacity: 0.2; }
          50% { transform: translateY(-50px) translateX(10px); opacity: 0.5; }
          100% { transform: translateY(-100px) translateX(20px); opacity: 0; }
        }
        .typing-dots span {
          display: inline-block;
          margin-left: 1px;
        }
      `}</style>
    </div>
  );
};

export default Loading;