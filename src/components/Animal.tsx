import React from 'react';
import { Animal as AnimalType, EMOTION_COLORS, ANIMAL_MINI_GAMES } from '@/types/game';
import AnimalSprite from './AnimalSprite';
import EmotionBubble from './EmotionBubble';
import { useGameStore } from '@/store/gameStore';
import { getEmotionAura } from '@/lib/emotionChain';

interface AnimalProps {
  animal: AnimalType;
  onStartMiniGame: (animalId: string) => void;
  miniGameActive?: boolean;
}

const Animal: React.FC<AnimalProps> = ({ animal, onStartMiniGame, miniGameActive = false }) => {
  const { selectedFood, feedAnimal, petAnimal } = useGameStore();
  const gameInfo = ANIMAL_MINI_GAMES[animal.type];

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedFood) {
      feedAnimal(animal.id);
    } else {
      petAnimal(animal.id);
    }
  };

  const size = 100 * animal.scale;
  const aura = getEmotionAura(animal.emotion);
  const auraSize = (size + animal.emotionRadius * 3);

  return (
    <div
      className={`absolute cursor-pointer transition-all duration-300 ease-out
        ${selectedFood ? 'hover:scale-110' : 'hover:scale-105'}
        ${animal.animationState === 'reacting' ? 'animate-bounce-gentle' : ''}
      `}
      style={{
        left: `${animal.position.x}%`,
        top: `${animal.position.y}%`,
        transform: 'translate(-50%, -50%)',
        zIndex: miniGameActive ? 1 : Math.floor(animal.position.y),
        opacity: miniGameActive ? 0.5 : 1,
        transition: 'opacity 0.3s ease',
      }}
      onClick={handleClick}
    >
      {/* 情绪光环 */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: auraSize,
          height: auraSize,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: `radial-gradient(circle, ${aura.color} 0%, transparent 70%)`,
          opacity: aura.intensity * 0.8,
          animation: `aura-pulse ${2 + animal.emotionStrength / 50}s ease-in-out infinite`,
          zIndex: -1,
        }}
      />

      {/* 兴奋小狗的光照效果 */}
      {animal.type === 'dog' && (animal.emotion === 'excited' || animal.animationState === 'glowing') && (
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: auraSize * 2,
            height: auraSize * 2,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, rgba(255,220,100,0.25) 0%, rgba(255,200,50,0.1) 40%, transparent 70%)',
            animation: 'glow-pulse 1.5s ease-in-out infinite',
            zIndex: -2,
          }}
        />
      )}

      {/* 焦虑刺猬的速度线 */}
      {animal.type === 'hedgehog' && animal.emotion === 'anxious' && animal.isMoving && (
        <div
          className="absolute pointer-events-none"
          style={{
            width: size * 1.2,
            height: size * 0.3,
            top: '60%',
            left: animal.direction === 'right' ? '-10%' : '30%',
            zIndex: 0,
          }}
        >
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-gray-400/50 rounded-full"
              style={{
                width: `${20 + i * 10}px`,
                height: '3px',
                top: `${i * 10}px`,
                left: `${i * 15}px`,
                animation: `speed-line ${0.3 + i * 0.1}s ease-in-out infinite alternate`,
              }}
            />
          ))}
        </div>
      )}

      {/* 情绪气泡 */}
      <EmotionBubble emotion={animal.emotion} show={true} />

      {/* 动物精灵 */}
      <AnimalSprite
        type={animal.type}
        emotion={animal.emotion}
        animationState={animal.animationState}
        direction={animal.direction}
        size={size}
      />

      {/* 名字标签 */}
      <div
        className="absolute -bottom-2 left-1/2 -translate-x-1/2
          bg-white/80 backdrop-blur-sm rounded-full px-3 py-0.5
          text-xs font-bold text-gray-600 shadow-sm
          border border-white/50 flex items-center gap-1"
        style={{
          borderTopColor: EMOTION_COLORS[animal.emotion],
          borderTopWidth: '2px',
        }}
      >
        {animal.name}
        {!selectedFood && gameInfo && (
          <button
            className="ml-1 w-5 h-5 rounded-full bg-gradient-to-br from-pink-400 to-purple-400
              flex items-center justify-center text-white text-xs
              hover:scale-125 active:scale-95 transition-transform shadow-md
              animate-pulse-slow"
            onClick={(e) => {
              e.stopPropagation();
              onStartMiniGame(animal.id);
            }}
            title={`玩小游戏：${gameInfo.name}`}
          >
            🎮
          </button>
        )}
      </div>

      {/* 选中食物时的提示光圈 */}
      {selectedFood && (
        <div
          className="absolute inset-0 rounded-full 
            border-4 border-yellow-400 border-dashed
            animate-spin opacity-50 pointer-events-none"
          style={{
            width: size,
            height: size,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            animationDuration: '8s',
          }}
        />
      )}
    </div>
  );
};

export default Animal;
