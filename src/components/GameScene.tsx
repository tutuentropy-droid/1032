import React from 'react';
import { useGameStore } from '@/store/gameStore';
import { useAnimalAI } from '@/hooks/useAnimalAI';
import IslandBackground from './IslandBackground';
import Animal from './Animal';
import FeedToolbar from './FeedToolbar';
import Particle from './Particle';

const GameScene: React.FC = () => {
  const { animals, particles, selectedFood, setSelectedFood } = useGameStore();

  useAnimalAI();

  const handleBackgroundClick = () => {
    if (selectedFood) {
      setSelectedFood(null);
    }
  };

  return (
    <div
      className={`game-container ${selectedFood ? 'cursor-feed' : ''}`}
      onClick={handleBackgroundClick}
    >
      <IslandBackground />

      {/* 标题 */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 text-center">
        <h1
          className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg
            animate-breathing-slow"
          style={{
            fontFamily: '"Comic Sans MS", "Marker Felt", cursive',
            textShadow: '3px 3px 6px rgba(0,0,0,0.2)',
          }}
        >
          🌸 情绪动物园 🌸
        </h1>
        <p className="text-white/80 text-sm mt-1 drop-shadow-md">
          点击小动物和它们互动，选择食物投喂它们吧~
        </p>
      </div>

      {/* 动物们 */}
      {animals.map((animal) => (
        <Animal key={animal.id} animal={animal} />
      ))}

      {/* 粒子特效 */}
      {particles.map((particle) => (
        <Particle
          key={particle.id}
          type={particle.type}
          x={particle.x}
          y={particle.y}
          duration={particle.duration || 2000}
          size={20 + Math.random() * 10}
        />
      ))}

      {/* 喂食工具栏 */}
      <FeedToolbar />

      {/* 装饰性花朵和蝴蝶（随机位置） */}
      <div
        className="absolute animate-float pointer-events-none"
        style={{
          left: '15%',
          top: '30%',
          animationDuration: '4s',
        }}
      >
        <span className="text-3xl opacity-70">🦋</span>
      </div>
      <div
        className="absolute animate-float-slow pointer-events-none"
        style={{
          left: '80%',
          top: '25%',
          animationDelay: '1s',
        }}
      >
        <span className="text-2xl opacity-60">🐝</span>
      </div>

      {/* 食物跟随鼠标提示（选中食物时显示） */}
      {selectedFood && (
        <div className="fixed top-4 right-4 z-50 pointer-events-none">
          <div
            className="bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-2
              shadow-lg border border-yellow-200 flex items-center gap-2
              animate-bounce-gentle"
          >
            <span className="text-2xl">🍽️</span>
            <span className="text-sm text-gray-600 font-medium">投喂模式</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameScene;
