
import React, { useState, useEffect } from 'react';

const Globe: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse position to -1 to 1 range
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative w-[300px] h-[300px] md:w-[500px] md:h-[500px] flex items-center justify-center pointer-events-none select-none">
      {/* Glow Backlighting */}
      <div className="absolute inset-0 bg-indigo-500/20 dark:bg-indigo-600/30 blur-[100px] rounded-full animate-pulse" />
      
      {/* 3D Globe Container */}
      <div 
        className="relative w-full h-full transition-transform duration-700 ease-out"
        style={{
          transform: `perspective(1000px) rotateX(${-mousePos.y * 10}deg) rotateY(${mousePos.x * 10}deg)`
        }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(99,102,241,0.3)]">
          {/* Base Sphere */}
          <circle cx="50" cy="50" r="48" fill="url(#globeGradient)" />
          
          {/* Latitude Lines */}
          <g className="opacity-20 stroke-indigo-400 dark:stroke-indigo-300" fill="none" strokeWidth="0.2">
            {[10, 20, 30, 40, 50, 60, 70, 80, 90].map((y) => (
              <ellipse key={`lat-${y}`} cx="50" cy={y} rx={Math.sqrt(Math.pow(48, 2) - Math.pow(y - 50, 2))} ry={y === 50 ? 5 : 2} />
            ))}
          </g>

          {/* Longitude Lines - Rotating */}
          <g className="animate-[spin_20s_linear_infinite] origin-center opacity-30 stroke-indigo-400 dark:stroke-indigo-200" fill="none" strokeWidth="0.2">
            {[0, 30, 60, 90, 120, 150].map((angle) => (
              <ellipse 
                key={`long-${angle}`} 
                cx="50" cy="50" rx="48" ry="48" 
                transform={`rotate(${angle} 50 50) scale(0.3 1) translate(${(50/0.3)-50} 0)`}
                style={{ transformOrigin: 'center' }}
              />
            ))}
          </g>

          {/* Highlight / Shine */}
          <circle cx="35" cy="35" r="48" fill="url(#shineGradient)" />

          <defs>
            <radialGradient id="globeGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#4338ca" stopOpacity="0.4" />
            </radialGradient>
            <radialGradient id="shineGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="white" stopOpacity="0.2" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>

        {/* Floating Data Points */}
        <div className="absolute inset-0 animate-[spin_40s_linear_infinite]">
          {[...Array(6)].map((_, i) => (
             <div 
               key={i} 
               className="absolute w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white]"
               style={{
                 top: `${50 + 40 * Math.sin((i * 60 * Math.PI) / 180)}%`,
                 left: `${50 + 40 * Math.cos((i * 60 * Math.PI) / 180)}%`,
                 transform: 'translate(-50%, -50%)'
               }}
             />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Globe;
