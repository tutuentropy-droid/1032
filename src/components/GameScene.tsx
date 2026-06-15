import React, { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { useAnimalAI } from '@/hooks/useAnimalAI';
import { ANIMAL_MINI_GAMES, FUSION_COMBOS, ISLAND_INFO, TIME_OF_DAY_CONFIG, IslandType } from '@/types/game';
import IslandBackground from './IslandBackground';
import Animal from './Animal';
import FeedToolbar from './FeedToolbar';
import Particle from './Particle';
import MiniGameModal from './MiniGameModal';
import FusedAnimalSprite from './FusedAnimalSprite';
import FusionAnimation from './FusionAnimation';
import BoatTransition from './BoatTransition';

const WEATHER_ICONS: Record<string, string> = {
  sunny: '☀️',
  rainy: '🌧️',
  snowy: '❄️',
  foggy: '🌫️',
  starry: '✨',
};

const GameScene: React.FC = () => {
  const {
    animals,
    particles,
    selectedFood,
    setSelectedFood,
    globalBrightness,
    startMiniGame,
    fusedAnimals,
    currentIsland,
    weather,
    timeOfDay,
    travelToIsland,
    isTransitioning,
    advanceTimeOfDay,
  } = useGameStore();

  const [miniGameOpen, setMiniGameOpen] = useState(false);
  const [currentGameAnimalId, setCurrentGameAnimalId] = useState<string | null>(null);
  const [islandMenuOpen, setIslandMenuOpen] = useState(false);

  useAnimalAI();

  const islandInfo = ISLAND_INFO[currentIsland];
  const timeConfig = TIME_OF_DAY_CONFIG[timeOfDay];

  const handleBackgroundClick = () => {
    if (selectedFood) {
      setSelectedFood(null);
    }
    if (islandMenuOpen) {
      setIslandMenuOpen(false);
    }
  };

  const handleStartMiniGame = (animalId: string) => {
    const animal = animals.find(a => a.id === animalId);
    if (!animal) return;
    const gameInfo = ANIMAL_MINI_GAMES[animal.type];
    if (!gameInfo) return;

    setCurrentGameAnimalId(animalId);
    setMiniGameOpen(true);
    startMiniGame(animalId, gameInfo.type);
  };

  const handleCloseMiniGame = () => {
    setMiniGameOpen(false);
    setCurrentGameAnimalId(null);
  };

  const handleTravelToIsland = (island: IslandType) => {
    if (island === currentIsland) return;
    setIslandMenuOpen(false);
    travelToIsland(island);
  };

  const currentAnimal = animals.find(a => a.id === currentGameAnimalId);
  const currentGameInfo = currentAnimal ? ANIMAL_MINI_GAMES[currentAnimal.type] : null;

  const activeFusionTypes = fusedAnimals.map(f => f.fusionType);

  const allIslands = Object.values(ISLAND_INFO);

  return (
    <div
      className={`game-container ${selectedFood ? 'cursor-feed' : ''}`}
      onClick={handleBackgroundClick}
      style={{
        filter: `brightness(${globalBrightness})`,
        transition: 'filter 1s ease-in-out',
      }}
    >
      <IslandBackground activeFusions={activeFusionTypes} />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: globalBrightness > 1.1
            ? 'radial-gradient(ellipse at center, rgba(255,230,150,0.15) 0%, transparent 70%)'
            : globalBrightness < 0.95
              ? 'radial-gradient(ellipse at center, rgba(100,100,150,0.1) 0%, transparent 70%)'
              : 'none',
          transition: 'background 1s ease-in-out',
        }}
      />

      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 text-center">
        <h1
          className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg
            animate-breathing-slow"
          style={{
            fontFamily: '"Comic Sans MS", "Marker Felt", cursive',
            textShadow: '3px 3px 6px rgba(0,0,0,0.2)',
          }}
        >
          🌸 情绪动物园 🌸
        </h1>
        <p className="text-white/80 text-xs md:text-sm mt-1 drop-shadow-md">
          点击小动物和它们互动，选择食物投喂它们吧~
        </p>
      </div>

      <div className="absolute top-6 left-4 z-20 flex flex-col gap-2">
        <div
          className="bg-white/20 backdrop-blur-sm rounded-2xl px-3 py-2 shadow-lg
            border border-white/30 cursor-pointer hover:bg-white/30 transition-all"
          onClick={(e) => {
            e.stopPropagation();
            setIslandMenuOpen(!islandMenuOpen);
          }}
        >
          <div className="flex items-center gap-2">
            <span className="text-2xl">{islandInfo.icon}</span>
            <div>
              <div className="text-white font-bold text-sm drop-shadow-md">{islandInfo.name}</div>
              <div className="flex items-center gap-1 text-white/80 text-xs">
                <span>{WEATHER_ICONS[weather]}</span>
                <span>{timeConfig.name}</span>
              </div>
            </div>
          </div>
        </div>

        {islandMenuOpen && (
          <div
            className="bg-white/90 backdrop-blur-md rounded-2xl p-2 shadow-xl
              border border-white/50 min-w-[220px] animate-popIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-xs text-gray-500 px-2 py-1 font-medium">选择岛屿</div>
            {allIslands.map((island) => (
              <button
                key={island.type}
                className={`w-full flex items-center gap-2 px-2 py-2 rounded-xl
                  transition-all text-left ${
                    island.type === currentIsland
                      ? 'bg-gradient-to-r from-pink-100 to-purple-100 text-gray-800'
                      : 'hover:bg-gray-100 text-gray-600'
                  }`}
                onClick={() => handleTravelToIsland(island.type)}
                disabled={island.type === currentIsland || isTransitioning}
              >
                <span className="text-xl">{island.icon}</span>
                <div className="flex-1">
                  <div className="font-bold text-sm">{island.name}</div>
                  <div className="text-xs opacity-70">{island.description.slice(0, 15)}...</div>
                </div>
                {island.type === currentIsland && (
                  <span className="text-green-500 text-xs">✓</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="absolute top-6 right-4 z-20 flex flex-col gap-2">
        <button
          className="bg-white/20 backdrop-blur-sm rounded-full w-10 h-10
            flex items-center justify-center shadow-lg border border-white/30
            hover:bg-white/30 transition-all text-xl"
          onClick={(e) => {
            e.stopPropagation();
            advanceTimeOfDay();
          }}
          title="切换时间"
        >
          {timeOfDay === 'night' || timeOfDay === 'dusk' ? '🌙' : '☀️'}
        </button>
      </div>

      <div className="absolute top-24 left-1/2 -translate-x-1/2 z-10 flex gap-2 justify-center flex-wrap">
        <span className="text-xs bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-white/90">
          😊 快乐会传染
        </span>
        <span className="text-xs bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-white/90">
          ⚡ 焦虑会吓跑小伙伴
        </span>
        <span className="text-xs bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-white/90">
          ✨ 汪汪兴奋时会发光
        </span>
        <span className="text-xs bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-white/90">
          🧬 长期忽视情绪会触发融合
        </span>
        <span className="text-xs bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-white/90">
          🚤 左上角可以前往其他岛屿
        </span>
        <span className="text-xs bg-yellow-400/40 backdrop-blur-sm rounded-full px-3 py-1 text-white/95">
          ✋ 长按动物可以拖拽移动
        </span>
      </div>

      {animals.map((animal) => {
        return (
          <Animal
            key={animal.id}
            animal={animal}
            onStartMiniGame={handleStartMiniGame}
            miniGameActive={miniGameOpen}
          />
        );
      })}

      {fusedAnimals.map((fused) => {
        const combo = FUSION_COMBOS.find(c => c.type === fused.fusionType);
        if (!combo) return null;
        return (
          <div
            key={fused.id}
            className="absolute cursor-pointer transition-all duration-300 ease-out hover:scale-110"
            style={{
              left: `${fused.position.x}%`,
              top: `${fused.position.y}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: Math.floor(fused.position.y) + 10,
            }}
          >
            <div
              className="absolute rounded-full pointer-events-none"
              style={{
                width: 220,
                height: 220,
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                background: `radial-gradient(circle, ${combo.environmentGlow} 0%, transparent 70%)`,
                animation: 'aura-pulse 2s ease-in-out infinite',
                zIndex: -1,
              }}
            />
            <FusedAnimalSprite
              type={fused.fusionType}
              direction={fused.direction}
              size={140 * fused.scale}
            />
            <div
              className="absolute -bottom-2 left-1/2 -translate-x-1/2
                bg-white/90 backdrop-blur-sm rounded-full px-3 py-1
                text-xs font-bold text-gray-700 shadow-md
                border-2 flex items-center gap-1"
              style={{
                borderColor: combo.environmentGlow.replace('0.3', '0.8'),
              }}
            >
              <span>{combo.emoji}</span>
              <span>{combo.name}</span>
            </div>
          </div>
        );
      })}

      <FusionAnimation />

      {particles.map((particle) => (
        <Particle
          key={particle.id}
          type={particle.type}
          x={particle.x}
          y={particle.y}
          duration={particle.duration || 2000}
          size={particle.scale ? 20 + Math.random() * 10 * particle.scale : 20 + Math.random() * 10}
          scale={particle.scale || 1}
        />
      ))}

      <FeedToolbar />

      <div
        className="absolute animate-float pointer-events-none"
        style={{
          left: '15%',
          top: '30%',
          animationDuration: '4s',
          opacity: timeOfDay === 'night' ? 0.3 : 0.7,
        }}
      >
        <span className="text-3xl">{currentIsland === 'night' ? '🦇' : '🦋'}</span>
      </div>
      <div
        className="absolute animate-float-slow pointer-events-none"
        style={{
          left: '80%',
          top: '25%',
          animationDelay: '1s',
          opacity: timeOfDay === 'night' ? 0.2 : 0.6,
        }}
      >
        <span className="text-2xl">{currentIsland === 'night' ? '🌙' : '🐝'}</span>
      </div>

      {selectedFood && (
        <div className="fixed top-4 right-20 z-50 pointer-events-none">
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

      {miniGameOpen && currentGameAnimalId && currentGameInfo && (
        <MiniGameModal
          isOpen={miniGameOpen}
          onClose={handleCloseMiniGame}
          animalId={currentGameAnimalId}
          gameType={currentGameInfo.type}
        />
      )}

      <BoatTransition />
    </div>
  );
};

export default GameScene;
