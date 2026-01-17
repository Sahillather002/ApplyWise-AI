import React, { useEffect, useRef } from 'react';

const Globe: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;

      // Use requestAnimationFrame for smooth CSS variable updates
      requestAnimationFrame(() => {
        containerRef.current?.style.setProperty('--mouse-x', x.toString());
        containerRef.current?.style.setProperty('--mouse-y', y.toString());
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-[320px] h-[320px] md:w-[540px] md:h-[540px] flex items-center justify-center pointer-events-none select-none transition-opacity duration-1000"
      style={{
        // Define default values
        ['--mouse-x' as any]: '0',
        ['--mouse-y' as any]: '0',
      }}
    >
      {/* Intense Core Glow */}
      <div className="absolute inset-0 bg-indigo-500/10 dark:bg-indigo-600/20 blur-[120px] rounded-full animate-pulse" />

      {/* Outer Atmospheric Ring */}
      <div
        className="absolute inset-0 border-[0.5px] border-indigo-400/20 rounded-full transition-transform duration-700 ease-out"
        style={{
          transform: `scale(1.1) rotateX(calc(var(--mouse-y) * 10deg)) rotateY(calc(var(--mouse-x) * 10deg))`
        }}
      />

      {/* 3D Globe Container */}
      <div
        className="relative w-full h-full transition-transform duration-700 ease-out"
        style={{
          transform: `perspective(1200px) rotateX(calc(var(--mouse-y) * -10deg)) rotateY(calc(var(--mouse-x) * 10deg))`
        }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_20px_rgba(99,102,241,0.3)] overflow-visible">
          <defs>
            <radialGradient id="globeGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.05" />
              <stop offset="70%" stopColor="#4338ca" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#3730a3" stopOpacity="0.5" />
            </radialGradient>
            <radialGradient id="shineGradient" cx="30%" cy="30%" r="50%">
              <stop offset="0%" stopColor="white" stopOpacity="0.3" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Base Sphere */}
          <circle cx="50" cy="50" r="48" fill="url(#globeGradient)" stroke="rgba(99, 102, 241, 0.15)" strokeWidth="0.5" />

          {/* Latitude Lines */}
          <g className="opacity-20 stroke-indigo-400 dark:stroke-indigo-300" fill="none" strokeWidth="0.15">
            {[15, 30, 45, 50, 65, 80].map((y) => (
              <ellipse
                key={`lat-${y}`}
                cx="50"
                cy={y}
                rx={Math.sqrt(Math.max(0, Math.pow(48, 2) - Math.pow(y - 50, 2)))}
                ry={Math.abs(y - 50) < 5 ? 4 : 1.5}
              />
            ))}
          </g>

          {/* Longitude Lines - Rotating */}
          <g className="animate-[spin_40s_linear_infinite] origin-center opacity-30 stroke-indigo-400 dark:stroke-indigo-200" fill="none" strokeWidth="0.15">
            {[0, 45, 90, 135].map((angle) => (
              <ellipse
                key={`long-${angle}`}
                cx="50" cy="50" rx="48" ry="48"
                transform={`rotate(${angle} 50 50) scale(0.2 1) translate(${(50 / 0.2) - 50} 0)`}
                style={{ transformOrigin: 'center' }}
              />
            ))}
          </g>

          {/* Highlight */}
          <circle cx="50" cy="50" r="48" fill="url(#shineGradient)" pointerEvents="none" />

          {/* Static Nodes (Simpler than dynamic pulsing nodes) */}
          <g>
            {[...Array(6)].map((_, i) => (
              <circle
                key={`node-${i}`}
                cx={50 + 40 * Math.cos(i * Math.PI / 3)}
                cy={50 + 40 * Math.sin(i * Math.PI / 3)}
                r="0.5"
                className="fill-indigo-300/60"
              />
            ))}
          </g>
        </svg>

        {/* Orbiting Satellite Data Points */}
        <div className="absolute inset-[-10%] animate-[spin_50s_linear_infinite]">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.6)]"
              style={{
                top: `${50 + 45 * Math.sin((i * 120 * Math.PI) / 180)}%`,
                left: `${50 + 45 * Math.cos((i * 120 * Math.PI) / 180)}%`,
                transform: 'translate(-50%, -50%)',
              }}
            />
          ))}
        </div>

        {/* Outer Tech Ring */}
        <div className="absolute inset-[-5%] border-[0.5px] border-dashed border-indigo-400/5 rounded-full animate-[spin_60s_linear_infinite_reverse]" />
      </div>
    </div>
  );
};

export default Globe;
