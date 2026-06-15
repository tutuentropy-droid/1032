import React from 'react';
import { Animal as AnimalType } from '@/types/game';
import AnimalSprite from './AnimalSprite';
import EmotionBubble from './EmotionBubble';
import { useGameStore } from '@/store/gameStore';

interface AnimalProps {
  animal: AnimalType;
}

const Animal: React.FC<AnimalProps> = ({ animal }) => {
  const { selectedFood, feedAnimal, petAnimal } = useGameStore();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedFood) {
      feedAnimal(animal.id);
    } else {
      petAnimal(animal.id);
    }
  };

  const size = 100 * animal.scale;

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
        zIndex: Math.floor(animal.position.y),
      }}
      onClick={handleClick}
    >
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
          border border-white/50"
      >
        {animal.name}
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
