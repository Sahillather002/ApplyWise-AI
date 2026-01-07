
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
    <div className="relative w-[320px] h-[320px] md:w-[540px] md:h-[540px] flex items-center justify-center pointer-events-none select-none">
      {/* Intense Core Glow */}
      <div className="absolute inset-0 bg-indigo-500/10 dark:bg-indigo-600/20 blur-[120px] rounded-full animate-pulse" />
      
      {/* Outer Atmospheric Ring */}
      <div 
        className="absolute inset-0 border-[0.5px] border-indigo-400/20 rounded-full transition-transform duration-1000 ease-out"
        style={{ transform: `scale(1.1) rotateX(${mousePos.y * 15}deg) rotateY(${mousePos.x * 15}deg)` }}
      />
      
      {/* 3D Globe Container */}
      <div 
        className="relative w-full h-full transition-transform duration-1000 ease-out"
        style={{
          transform: `perspective(1200px) rotateX(${-mousePos.y * 15}deg) rotateY(${mousePos.x * 15}deg)`
        }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_25px_rgba(99,102,241,0.4)] overflow-visible">
          <defs>
            <radialGradient id="globeGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.05" />
              <stop offset="70%" stopColor="#4338ca" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#3730a3" stopOpacity="0.6" />
            </radialGradient>
            <radialGradient id="shineGradient" cx="30%" cy="30%" r="50%">
              <stop offset="0%" stopColor="white" stopOpacity="0.4" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Base Sphere with subtle border */}
          <circle cx="50" cy="50" r="48" fill="url(#globeGradient)" stroke="rgba(99, 102, 241, 0.2)" strokeWidth="0.5" />
          
          {/* Latitude Lines */}
          <g className="opacity-30 stroke-indigo-400 dark:stroke-indigo-300" fill="none" strokeWidth="0.15">
            {[10, 25, 40, 50, 60, 75, 90].map((y) => (
              <ellipse 
                key={`lat-${y}`} 
                cx="50" 
                cy={y} 
                rx={Math.sqrt(Math.max(0, Math.pow(48, 2) - Math.pow(y - 50, 2)))} 
                ry={Math.abs(y - 50) < 5 ? 4 : 1.5} 
              />
            ))}
          </g>

          {/* Longitude Lines - Rotating with slight parallax */}
          <g className="animate-[spin_25s_linear_infinite] origin-center opacity-40 stroke-indigo-400 dark:stroke-indigo-200" fill="none" strokeWidth="0.15">
            {[0, 30, 60, 90, 120, 150].map((angle) => (
              <ellipse 
                key={`long-${angle}`} 
                cx="50" cy="50" rx="48" ry="48" 
                transform={`rotate(${angle} 50 50) scale(0.2 1) translate(${(50/0.2)-50} 0)`}
                style={{ transformOrigin: 'center' }}
              />
            ))}
          </g>

          {/* Highlight / Atmospheric Shine */}
          <circle cx="50" cy="50" r="48" fill="url(#shineGradient)" pointerEvents="none" />

          {/* Glowing Connection Nodes */}
          <g filter="url(#glow)">
            {[...Array(8)].map((_, i) => (
              <circle
                key={`node-${i}`}
                cx={50 + 48 * Math.cos(i * Math.PI / 4) * Math.sin(i * 0.5)}
                cy={50 + 48 * Math.sin(i * Math.PI / 4)}
                r="0.6"
                className="fill-indigo-300 animate-pulse"
                style={{ animationDelay: `${i * 0.3}s` }}
              />
            ))}
          </g>
        </svg>

        {/* Orbiting Satellite Data Points */}
        <div className="absolute inset-[-10%] animate-[spin_60s_linear_infinite]">
          {[...Array(5)].map((_, i) => (
             <div 
               key={i} 
               className="absolute w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_12px_rgba(255,255,255,0.8)]"
               style={{
                 top: `${50 + 45 * Math.sin((i * 72 * Math.PI) / 180)}%`,
                 left: `${50 + 45 * Math.cos((i * 72 * Math.PI) / 180)}%`,
                 transform: 'translate(-50%, -50%)',
                 opacity: 0.6 + Math.random() * 0.4
               }}
             />
          ))}
        </div>

        {/* Outer Tech Ring */}
        <div className="absolute inset-[-5%] border-[0.5px] border-dashed border-indigo-400/10 rounded-full animate-[spin_40s_linear_infinite_reverse]" />
      </div>
    </div>
  );
};

export default Globe;
