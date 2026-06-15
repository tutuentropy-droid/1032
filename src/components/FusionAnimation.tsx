import React, { useEffect, useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { FUSION_COMBOS } from '@/types/game';
import FusedAnimalSprite from './FusedAnimalSprite';

const FusionAnimation: React.FC = () => {
  const fusionAnimation = useGameStore(s => s.fusionAnimation);
  const [phase, setPhase] = useState<'spiral' | 'burst' | 'reveal' | 'done'>('spiral');

  useEffect(() => {
    if (!fusionAnimation) {
      setPhase('spiral');
      return;
    }

    const t1 = setTimeout(() => setPhase('burst'), 800);
    const t2 = setTimeout(() => setPhase('reveal'), 1600);
    const t3 = setTimeout(() => setPhase('done'), 3000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [fusionAnimation]);

  if (!fusionAnimation || phase === 'done') return null;

  const combo = FUSION_COMBOS.find(c => c.type === fusionAnimation.type);
  if (!combo) return null;

  const posX = fusionAnimation.position.x;
  const posY = fusionAnimation.position.y;

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: `${posX}%`,
        top: `${posY}%`,
        transform: 'translate(-50%, -50%)',
        zIndex: 100,
      }}
    >
      {phase === 'spiral' && (
        <div className="relative" style={{ width: 200, height: 200 }}>
          <div
            className="absolute inset-0 animate-fusion-spiral"
            style={{
              background: `conic-gradient(from 0deg, ${combo.environmentGlow}, transparent, ${combo.environmentGlow}, transparent)`,
              borderRadius: '50%',
            }}
          />
          <div
            className="absolute inset-8 rounded-full animate-fusion-pulse"
            style={{
              background: `radial-gradient(circle, white 0%, ${combo.environmentGlow} 60%, transparent 100%)`,
            }}
          />
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-fusion-orbit"
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: i % 2 === 0 ? combo.environmentGlow : '#FFD700',
                top: '50%',
                left: '50%',
                animationDelay: `${i * 0.1}s`,
                animationDuration: `${0.6 + i * 0.05}s`,
                boxShadow: `0 0 10px ${combo.environmentGlow}`,
              }}
            />
          ))}
        </div>
      )}

      {phase === 'burst' && (
        <div className="relative" style={{ width: 250, height: 250 }}>
          <div
            className="absolute inset-0 animate-fusion-burst"
            style={{
              background: `radial-gradient(circle, white 0%, ${combo.environmentGlow} 40%, transparent 70%)`,
              borderRadius: '50%',
            }}
          />
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-fusion-shard"
              style={{
                width: 6 + Math.random() * 8,
                height: 6 + Math.random() * 8,
                borderRadius: '50%',
                background: ['#FFD700', '#FF6B6B', '#4ECDC4', '#9B59B6', combo.environmentGlow][i % 5],
                top: '50%',
                left: '50%',
                animationDelay: `${i * 0.04}s`,
                boxShadow: `0 0 8px rgba(255,255,255,0.6)`,
              }}
            />
          ))}
          <div
            className="absolute animate-fusion-ring"
            style={{
              inset: 20,
              border: `3px solid ${combo.environmentGlow}`,
              borderRadius: '50%',
              opacity: 0.7,
            }}
          />
        </div>
      )}

      {phase === 'reveal' && (
        <div className="relative animate-fusion-reveal" style={{ width: 160, height: 160 }}>
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle, ${combo.environmentGlow} 0%, transparent 70%)`,
              opacity: 0.5,
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <FusedAnimalSprite type={fusionAnimation.type} direction="right" size={140} />
          </div>
          <div
            className="absolute -top-8 left-1/2 -translate-x-1/2
              bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-2
              shadow-lg border-2 text-center
              animate-fusion-name"
            style={{ borderColor: combo.environmentGlow.replace('0.3', '0.8') }}
          >
            <div className="text-2xl">{combo.emoji}</div>
            <div className="text-sm font-bold text-gray-800 whitespace-nowrap">{combo.name}</div>
            <div className="text-xs text-gray-500 mt-0.5 whitespace-nowrap">{combo.description}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FusionAnimation;
