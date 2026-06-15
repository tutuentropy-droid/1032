import React from 'react';
import { ParticleType } from '@/types/game';

interface ParticleProps {
  type: ParticleType;
  x: number;
  y: number;
  duration?: number;
  size?: number;
  scale?: number;
}

const Particle: React.FC<ParticleProps> = ({ type, x, y, duration = 2000, size = 24, scale = 1 }) => {
  const getContent = () => {
    switch (type) {
      case 'heart':
        return <HeartSVG size={size} />;
      case 'star':
        return <StarSVG size={size} />;
      case 'sparkle':
        return <SparkleSVG size={size} />;
      case 'zzz':
        return <ZzzSVG size={size} />;
      case 'exclamation':
        return <ExclamationSVG size={size} />;
      case 'sweat':
        return <SweatSVG size={size} />;
      case 'light':
        return <LightSVG size={size * scale} />;
      default:
        return <HeartSVG size={size} />;
    }
  };

  const horizontalOffset = (Math.random() - 0.5) * (type === 'light' ? 30 : 20);

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: `translate(-50%, -50%) scale(${scale})`,
        animation: type === 'light'
          ? `light-fade ${duration}ms ease-out forwards`
          : `float-up ${duration}ms ease-out forwards`,
        animationDelay: '0ms',
        zIndex: 500,
      }}
    >
      <div
        style={{
          transform: `translateX(${horizontalOffset}px)`,
          animation: type === 'light' ? 'none' : `float ${duration}ms ease-in-out infinite`,
        }}
      >
        {getContent()}
      </div>
    </div>
  );
};

const HeartSVG: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className="animate-pulse">
    <path
      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
      fill="#FF69B4"
      stroke="#FF1493"
      strokeWidth="1"
    />
  </svg>
);

const StarSVG: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className="animate-sparkle">
    <path
      d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
      fill="#FFD700"
      stroke="#FFA500"
      strokeWidth="0.5"
    />
  </svg>
);

const SparkleSVG: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className="animate-sparkle">
    <path
      d="M12 0L14 10L24 12L14 14L12 24L10 14L0 12L10 10L12 0Z"
      fill="#FFFACD"
      stroke="#FFD700"
      strokeWidth="0.5"
    />
  </svg>
);

const ZzzSVG: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size * 1.2} viewBox="0 0 20 24" className="animate-float">
    <text x="0" y="10" fontSize="14" fill="#4169E1" fontWeight="bold">Z</text>
    <text x="6" y="18" fontSize="10" fill="#6495ED" fontWeight="bold">z</text>
    <text x="12" y="24" fontSize="8" fill="#87CEEB" fontWeight="bold">z</text>
  </svg>
);

const ExclamationSVG: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size * 1.3} viewBox="0 0 16 24" className="animate-bounce">
    <circle cx="8" cy="4" r="4" fill="#FF4444" />
    <rect x="6" y="10" width="4" height="10" rx="2" fill="#FF4444" />
    <circle cx="7" cy="3" r="1" fill="#FFCCCC" />
  </svg>
);

const SweatSVG: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size * 0.6} height={size} viewBox="0 0 12 20">
    <path
      d="M6 0 Q0 10 0 14 Q0 20 6 20 Q12 20 12 14 Q12 10 6 0 Z"
      fill="#87CEEB"
      stroke="#4682B4"
      strokeWidth="0.5"
      opacity="0.9"
    />
    <ellipse cx="4" cy="12" rx="1.5" ry="3" fill="white" opacity="0.6" />
  </svg>
);

const LightSVG: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" className="animate-light-pulse">
    <defs>
      <radialGradient id="lightGrad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FFFEB3" stopOpacity="1" />
        <stop offset="40%" stopColor="#FFE066" stopOpacity="0.7" />
        <stop offset="100%" stopColor="#FFD700" stopOpacity="0" />
      </radialGradient>
    </defs>
    <circle cx="20" cy="20" r="18" fill="url(#lightGrad)" />
    <circle cx="20" cy="20" r="8" fill="#FFFEB3" opacity="0.9" />
  </svg>
);

export default Particle;
