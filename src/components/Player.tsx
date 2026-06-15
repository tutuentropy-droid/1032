import React from 'react';
import { Player as PlayerType } from '@/types/game';
import { useGameStore } from '@/store/gameStore';

interface PlayerProps {
  player: PlayerType;
  onClick?: () => void;
}

const Player: React.FC<PlayerProps> = ({ player, onClick }) => {
  const { isWalkingMode, selectedWalkingAnimals, activeWalkingCombination } = useGameStore();

  const size = 90;

  const getAnimationClass = () => {
    if (player.isMoving) {
      return 'animate-walking';
    }
    return 'animate-breathing';
  };

  const getSpecialAnimationClass = () => {
    if (!activeWalkingCombination) return '';

    switch (activeWalkingCombination.animation) {
      case 'funny_tempo':
        return 'animate-funny-tempo';
      case 'tortoise_hare':
        return 'animate-tortoise-hare';
      case 'sleepy_excited':
        return 'animate-sleepy-excited';
      case 'happy_party':
        return 'animate-happy-party';
      case 'calming':
        return 'animate-calming';
      case 'chaos_harmony':
        return 'animate-chaos-harmony';
      default:
        return '';
    }
  };

  return (
    <div
      className={`absolute cursor-pointer transition-all duration-300 ease-out hover:scale-110
        ${isWalkingMode ? 'ring-4 ring-yellow-400 ring-dashed rounded-full animate-pulse-slow' : ''}
        ${player.isWalkingAnimals ? 'ring-2 ring-green-400 rounded-full' : ''}
      `}
      style={{
        left: `${player.position.x}%`,
        top: `${player.position.y}%`,
        transform: `translate(-50%, -50%) scaleX(${player.direction === 'left' ? -1 : 1})`,
        zIndex: Math.floor(player.position.y) + 10,
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
    >
      {activeWalkingCombination && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-50 whitespace-nowrap animate-bounce-gentle pointer-events-none">
          <div className="bg-gradient-to-r from-pink-400 to-purple-400 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
            ✨ {activeWalkingCombination.name} ✨
          </div>
        </div>
      )}

      {isWalkingMode && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-50 whitespace-nowrap pointer-events-none">
          <div className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-bounce-gentle">
            点击选择动物 🚶
          </div>
        </div>
      )}

      <div
        className={`relative ${getAnimationClass()} ${getSpecialAnimationClass()}`}
        style={{ width: size, height: size }}
      >
        <svg viewBox="0 0 120 120" className="w-full h-full">
          <ellipse cx="60" cy="112" rx="25" ry="6" fill="rgba(0,0,0,0.15)" />

          <ellipse cx="60" cy="78" rx="22" ry="28" fill="#4A90D9" />
          <ellipse cx="60" cy="76" rx="18" ry="24" fill="#5BA3EC" />

          <ellipse cx="38" cy="72" rx="8" ry="14" fill="#4A90D9" transform="rotate(-15 38 72)" />
          <ellipse cx="82" cy="72" rx="8" ry="14" fill="#4A90D9" transform="rotate(15 82 72)" />

          <ellipse cx="48" cy="102" rx="10" ry="8" fill="#8B4513" />
          <ellipse cx="72" cy="102" rx="10" ry="8" fill="#8B4513" />

          <circle cx="60" cy="42" r="24" fill="#FFE4C4" />
          <circle cx="60" cy="40" r="20" fill="#FFEBCD" />

          <ellipse cx="60" cy="22" rx="22" ry="10" fill="#8B4513" />
          <ellipse cx="60" cy="24" rx="18" ry="8" fill="#A0522D" />

          <path d="M40,38 Q42,32 48,38" stroke="#333" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M72,38 Q74,32 80,38" stroke="#333" strokeWidth="2.5" fill="none" strokeLinecap="round" />

          <circle cx="50" cy="42" r="3" fill="#333" />
          <circle cx="70" cy="42" r="3" fill="#333" />
          <circle cx="51" cy="41" r="1.2" fill="white" />
          <circle cx="71" cy="41" r="1.2" fill="white" />

          <ellipse cx="60" cy="52" rx="4" ry="3" fill="#FFB6C1" />

          <path d="M52,56 Q60,64 68,56" stroke="#333" strokeWidth="2.5" fill="none" strokeLinecap="round" />

          <circle cx="42" cy="48" r="4" fill="#FFB6C1" opacity="0.4" />
          <circle cx="78" cy="48" r="4" fill="#FFB6C1" opacity="0.4" />
        </svg>
      </div>

      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-0.5 text-xs font-bold text-gray-700 shadow-sm border border-white/50">
        🧑 你
      </div>

      {player.isWalkingAnimals && selectedWalkingAnimals.length > 0 && (
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex -space-x-1">
          {selectedWalkingAnimals.map((_, idx) => (
            <div
              key={idx}
              className="w-4 h-4 rounded-full bg-green-400 border-2 border-white shadow-sm"
              style={{ animationDelay: `${idx * 0.1}s` }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Player;
