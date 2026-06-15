import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Animal as AnimalType, EMOTION_COLORS, ANIMAL_MINI_GAMES, ISLAND_INFO } from '@/types/game';
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
  const { selectedFood, feedAnimal, petAnimal, fusedAnimals, currentIsland, startDragAnimal, updateDragPosition, endDragAnimal, isWalkingMode, selectedWalkingAnimals, toggleAnimalForWalk, activeWalkingCombination } = useGameStore();
  const gameInfo = ANIMAL_MINI_GAMES[animal.type];
  const islandInfo = ISLAND_INFO[currentIsland];

  const isSelectedForWalk = selectedWalkingAnimals.includes(animal.id);
  const isBeingWalked = activeWalkingCombination !== null && selectedWalkingAnimals.includes(animal.id);

  const containerRef = useRef<HTMLDivElement>(null);
  const [isLocalDragging, setIsLocalDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const pressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [longPressTriggered, setLongPressTriggered] = useState(false);
  const [currentReaction, setCurrentReaction] = useState<string | null>(null);
  const [showReactionText, setShowReactionText] = useState(false);

  const isFused = fusedAnimals.some(f => f.animalIds.includes(animal.id));
  const isFloating = islandInfo.hasAntiGravity || animal.animationState === 'floating';
  const isSleepwalking = islandInfo.hasSleepwalking || animal.animationState === 'sleepwalking';

  const getReactionText = (reaction: string | null): string => {
    switch (reaction) {
      case 'protest': return '抗议！😤';
      case 'escape': return '溜了溜了！💨';
      case 'play_dead': return '我死了...😵';
      case 'stubborn': return '我不走！🙅';
      case 'cooperate': return '好呀~😊';
      default: return '';
    }
  };

  const getWalkCombinationClass = (): string => {
    if (!activeWalkingCombination || !selectedWalkingAnimals.includes(animal.id)) return '';

    switch (activeWalkingCombination.animation) {
      case 'funny_tempo':
        return animal.type === 'dog' ? 'animate-fast-bounce' : 'animate-slow-wobble';
      case 'tortoise_hare':
        return animal.type === 'rabbit' ? 'animate-hop-fast' : 'animate-slow-roll';
      case 'sleepy_excited':
        return animal.type === 'dog' ? 'animate-super-bounce' : 'animate-sleepy-drag';
      case 'happy_party':
        return 'animate-party-dance';
      case 'calming':
        return 'animate-calm-sway';
      case 'chaos_harmony':
        return 'animate-chaos-mix';
      default:
        return '';
    }
  };

  const getScenePercentPosition = useCallback((clientX: number, clientY: number) => {
    const container = containerRef.current;
    if (!container) return { x: 50, y: 50 };

    const scene = container.closest('.game-container');
    if (!scene) return { x: 50, y: 50 };

    const rect = scene.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;
    return { x, y };
  }, []);

  const clearPressTimer = useCallback(() => {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
  }, []);

  const handleDragStart = useCallback((clientX: number, clientY: number) => {
    if (selectedFood || miniGameActive || isFused) return;

    pressTimerRef.current = setTimeout(() => {
      setLongPressTriggered(true);
      setIsLocalDragging(true);

      const pos = getScenePercentPosition(clientX, clientY);
      setDragOffset({
        x: animal.position.x - pos.x,
        y: animal.position.y - pos.y,
      });

      startDragAnimal(animal.id);
    }, 200);
  }, [selectedFood, miniGameActive, isFused, animal.id, animal.position.x, animal.position.y, getScenePercentPosition, startDragAnimal]);

  const handleDragMove = useCallback((clientX: number, clientY: number) => {
    if (!isLocalDragging && !longPressTriggered) return;

    if (pressTimerRef.current && !longPressTriggered) {
      return;
    }

    if (!isLocalDragging && longPressTriggered) {
      return;
    }

    const pos = getScenePercentPosition(clientX, clientY);
    const newPos = {
      x: pos.x + dragOffset.x,
      y: pos.y + dragOffset.y,
    };
    updateDragPosition(animal.id, newPos);
  }, [isLocalDragging, longPressTriggered, dragOffset, animal.id, getScenePercentPosition, updateDragPosition]);

  const handleDragEnd = useCallback((clientX: number, clientY: number) => {
    clearPressTimer();

    if (!isLocalDragging) {
      return;
    }

    const pos = getScenePercentPosition(clientX, clientY);
    const dropPos = {
      x: pos.x + dragOffset.x,
      y: pos.y + dragOffset.y,
    };

    const reaction = endDragAnimal(animal.id, dropPos);
    setCurrentReaction(reaction);
    setShowReactionText(true);

    setTimeout(() => {
      setShowReactionText(false);
      setCurrentReaction(null);
    }, 2000);

    setIsLocalDragging(false);
    setLongPressTriggered(false);
  }, [isLocalDragging, dragOffset, animal.id, clearPressTimer, getScenePercentPosition, endDragAnimal]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    handleDragStart(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: MouseEvent) => {
    handleDragMove(e.clientX, e.clientY);
  };

  const handleMouseUp = (e: MouseEvent) => {
    handleDragEnd(e.clientX, e.clientY);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      handleDragStart(touch.clientX, touch.clientY);
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      handleDragMove(touch.clientX, touch.clientY);
    }
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (e.changedTouches.length > 0) {
      const touch = e.changedTouches[0];
      handleDragEnd(touch.clientX, touch.clientY);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (longPressTriggered || isLocalDragging) {
      return;
    }
    if (isWalkingMode) {
      toggleAnimalForWalk(animal.id);
      return;
    }
    if (selectedFood) {
      feedAnimal(animal.id);
    } else {
      petAnimal(animal.id);
    }
  };

  useEffect(() => {
    if (isLocalDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isLocalDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  useEffect(() => {
    return () => {
      clearPressTimer();
    };
  }, [clearPressTimer]);

  const size = 100 * animal.scale;
  const aura = getEmotionAura(animal.emotion);
  const auraSize = (size + animal.emotionRadius * 3);

  let extraAnimationClass = isFloating
    ? 'animate-anti-gravity'
    : isSleepwalking
      ? 'animate-sleepwalking'
      : animal.animationState === 'reacting'
        ? 'animate-bounce-gentle'
        : '';

  const walkComboClass = getWalkCombinationClass();
  if (walkComboClass) {
    extraAnimationClass = walkComboClass;
  }

  if (animal.isDragged || isLocalDragging) {
    extraAnimationClass = 'animate-shake-drag';
  } else if (animal.animationState === 'protesting') {
    extraAnimationClass = 'animate-protest';
  } else if (animal.animationState === 'playing_dead') {
    extraAnimationClass = 'animate-play-dead';
  } else if (animal.animationState === 'stubborn') {
    extraAnimationClass = 'animate-stubborn';
  } else if (animal.animationState === 'escaping') {
    extraAnimationClass = 'animate-escaping';
  }

  const rotationClass = animal.animationState === 'playing_dead' ? 'rotate-180' : '';

  return (
    <div
      ref={containerRef}
      className={`absolute transition-all duration-300 ease-out
        ${isWalkingMode
          ? 'cursor-pointer hover:scale-110'
          : !selectedFood && !miniGameActive && !isFused
            ? 'cursor-grab active:cursor-grabbing hover:scale-105'
            : selectedFood
              ? 'hover:scale-110'
              : ''
        }
        ${extraAnimationClass}
        ${isLocalDragging || animal.isDragged ? 'select-none pointer-events-none z-[1000]' : ''}
        ${isSelectedForWalk ? 'ring-4 ring-yellow-400 rounded-full animate-pulse-slow' : ''}
        ${isBeingWalked ? 'ring-2 ring-green-400 rounded-full' : ''}
      `}
      style={{
        left: `${animal.position.x}%`,
        top: `${animal.position.y}%`,
        transform: `translate(-50%, -50%) ${isLocalDragging || animal.isDragged ? 'scale(1.15)' : ''} ${isSelectedForWalk ? 'scale(1.05)' : ''}`,
        zIndex: isLocalDragging || animal.isDragged ? 9999 : miniGameActive ? 1 : Math.floor(animal.position.y) + (isFloating ? 100 : 0),
        opacity: miniGameActive ? 0.5 : isFused ? 0.3 : 1,
        transition: isLocalDragging || animal.isDragged ? 'none' : 'opacity 0.3s ease, transform 0.3s ease, left 0.1s linear, top 0.1s linear',
        filter: isFused ? 'grayscale(50%) blur(1px)' : isSleepwalking ? 'blur(0.5px) brightness(1.1)' : isSelectedForWalk ? 'brightness(1.1)' : undefined,
        pointerEvents: isFused ? 'none' : undefined,
        touchAction: 'none',
        userSelect: 'none',
      }}
      onClick={handleClick}
      onMouseDown={isWalkingMode ? undefined : handleMouseDown}
      onTouchStart={isWalkingMode ? undefined : handleTouchStart}
    >
      {isSelectedForWalk && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-50 whitespace-nowrap pointer-events-none">
          <div className="bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full text-xs font-bold shadow-lg animate-bounce-gentle">
            ✓ 已选择
          </div>
        </div>
      )}
      {showReactionText && currentReaction && (
        <div
          className="absolute -top-16 left-1/2 -translate-x-1/2 z-50 whitespace-nowrap animate-reaction-pop pointer-events-none"
        >
          <div
            className="bg-white/95 backdrop-blur-sm rounded-full px-4 py-2 shadow-xl border-2 font-bold text-sm"
            style={{
              borderColor: currentReaction === 'cooperate' ? '#90EE90' : currentReaction === 'escape' ? '#FF6B6B' : currentReaction === 'protest' ? '#FFA500' : currentReaction === 'stubborn' ? '#9370DB' : '#808080',
              color: '#444',
            }}
          >
            {getReactionText(currentReaction)}
          </div>
        </div>
      )}

      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: auraSize,
          height: auraSize,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: `radial-gradient(circle, ${aura.color} 0%, transparent 70%)`,
          opacity: (isLocalDragging || animal.isDragged) ? aura.intensity * 1.2 : aura.intensity * 0.8,
          animation: `aura-pulse ${2 + animal.emotionStrength / 50}s ease-in-out infinite`,
          zIndex: -1,
        }}
      />

      {(isLocalDragging || animal.isDragged) && (
        <div
          className="absolute rounded-full pointer-events-none animate-drag-glow"
          style={{
            width: auraSize * 1.5,
            height: auraSize * 1.5,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, rgba(255,215,0,0.4) 0%, rgba(255,165,0,0.2) 40%, transparent 70%)',
            zIndex: -2,
          }}
        />
      )}

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

      {isSleepwalking && (
        <>
          {[...Array(3)].map((_, i) => (
            <div
              key={`sleep-z-${i}`}
              className="absolute animate-dream-z pointer-events-none"
              style={{
                left: `${60 + i * 15}%`,
                top: `${-20 - i * 10}%`,
                fontSize: `${14 + i * 4}px`,
                fontWeight: 'bold',
                color: '#9370DB',
                textShadow: '1px 1px 2px rgba(255,255,255,0.8)',
                animationDelay: `${i * 0.6}s`,
                opacity: 0.8,
              }}
            >
              💤
            </div>
          ))}
        </>
      )}

      {isFloating && (
        <>
          {[...Array(5)].map((_, i) => (
            <div
              key={`float-particle-${i}`}
              className="absolute rounded-full pointer-events-none animate-sparkle"
              style={{
                left: `${20 + i * 18}%`,
                top: `${80 + (i % 2) * 10}%`,
                width: 4 + (i % 3),
                height: 4 + (i % 3),
                background: i % 2 === 0 ? '#C39BD3' : '#BB8FCE',
                boxShadow: `0 0 6px 2px rgba(155, 89, 182, 0.5)`,
                animationDelay: `${i * 0.3}s`,
              }}
            />
          ))}
        </>
      )}

      {animal.animationState === 'protesting' && (
        <>
          {[...Array(4)].map((_, i) => (
            <div
              key={`protest-${i}`}
              className="absolute animate-protest-bounce pointer-events-none text-2xl"
              style={{
                left: `${10 + i * 25}%`,
                top: `${-30 - (i % 2) * 15}%`,
                animationDelay: `${i * 0.15}s`,
              }}
            >
              💢
            </div>
          ))}
        </>
      )}

      {animal.animationState === 'stubborn' && (
        <div
          className="absolute -top-10 left-1/2 -translate-x-1/2 pointer-events-none animate-bounce-gentle"
        >
          <span className="text-3xl">⛰️</span>
        </div>
      )}

      <EmotionBubble emotion={animal.emotion} show={!animal.isDragged && !isLocalDragging} />

      <div className={rotationClass}>
        <AnimalSprite
          type={animal.type}
          emotion={animal.emotion}
          animationState={animal.animationState}
          direction={animal.direction}
          size={size}
        />
      </div>

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
        {!selectedFood && gameInfo && !isLocalDragging && !animal.isDragged && (
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

      {(isLocalDragging || animal.isDragged) && (
        <div
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 pointer-events-none whitespace-nowrap"
        >
          <span className="text-xs bg-black/60 text-white px-2 py-1 rounded-full backdrop-blur-sm">
            拖拽中... ✋
          </span>
        </div>
      )}
    </div>
  );
};

export default Animal;
