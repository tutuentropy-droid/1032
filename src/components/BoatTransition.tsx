import React, { useEffect, useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { ISLAND_INFO } from '@/types/game';

const BoatTransition: React.FC = () => {
  const { isTransitioning, targetIsland, completeIslandTransition } = useGameStore();
  const [phase, setPhase] = useState<'enter' | 'sailing' | 'exit'>('enter');

  useEffect(() => {
    if (isTransitioning) {
      setPhase('enter');
      const timer1 = setTimeout(() => setPhase('sailing'), 500);
      const timer2 = setTimeout(() => setPhase('exit'), 2000);
      const timer3 = setTimeout(() => {
        completeIslandTransition();
      }, 2500);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [isTransitioning, completeIslandTransition]);

  if (!isTransitioning || !targetIsland) return null;

  const islandInfo = ISLAND_INFO[targetIsland];

  return (
    <div
      className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center"
      style={{
        background: phase === 'enter'
          ? 'linear-gradient(180deg, rgba(100,150,200,0) 0%, rgba(50,100,150,0.95) 100%)'
          : phase === 'sailing'
            ? 'linear-gradient(180deg, #1a3a5c 0%, #2c5282 50%, #1e3a5f 100%)'
            : 'linear-gradient(180deg, rgba(50,100,150,0.95) 0%, rgba(100,150,200,0) 100%)',
        transition: 'background 0.5s ease-in-out',
      }}
    >
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${60 + Math.random() * 40}%`,
              width: 2 + Math.random() * 3,
              height: 1,
              background: 'rgba(255,255,255,0.3)',
              animation: `wave-rise ${1.5 + Math.random()}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div
        className="absolute animate-boat-sail"
        style={{
          bottom: '30%',
        }}
      >
        <div className="animate-boat-rock" style={{ transformOrigin: 'center bottom' }}>
          <BoatSVG />
        </div>
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
        <div
          className="text-5xl mb-4 animate-float-slow"
          style={{ opacity: phase === 'sailing' ? 1 : 0, transition: 'opacity 0.5s' }}
        >
          {islandInfo.icon}
        </div>
        <h2
          className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg mb-2"
          style={{
            fontFamily: '"Comic Sans MS", "Marker Felt", cursive',
            opacity: phase === 'sailing' ? 1 : 0,
            transition: 'opacity 0.5s 0.3s',
          }}
        >
          正在前往 {islandInfo.name}
        </h2>
        <p
          className="text-white/80 text-sm md:text-base"
          style={{
            opacity: phase === 'sailing' ? 1 : 0,
            transition: 'opacity 0.5s 0.5s',
          }}
        >
          {islandInfo.description}
        </p>
      </div>
    </div>
  );
};

const BoatSVG: React.FC = () => (
  <svg width="160" height="120" viewBox="0 0 160 120">
    <ellipse cx="80" cy="100" rx="60" ry="10" fill="rgba(0,0,0,0.2)" />
    <path d="M25,70 Q80,50 135,70 L125,90 Q80,100 35,90 Z" fill="#8B4513" />
    <path d="M30,68 Q80,52 130,68 L122,78 Q80,85 38,78 Z" fill="#A0522D" />
    <rect x="77" y="25" width="6" height="50" fill="#654321" />
    <path d="M83,25 L83,65 L130,55 Z" fill="#FFFAF0" opacity="0.95" />
    <path d="M77,25 L77,60 L35,52 Z" fill="#FFF8DC" opacity="0.9" />
    <ellipse cx="55" cy="78" rx="8" ry="4" fill="#5C4033" />
    <ellipse cx="80" cy="80" rx="10" ry="5" fill="#5C4033" />
    <ellipse cx="105" cy="78" rx="8" ry="4" fill="#5C4033" />
    <path d="M80,45 Q75,35 80,25" stroke="#8B4513" strokeWidth="2" fill="none" />
  </svg>
);

export default BoatTransition;
