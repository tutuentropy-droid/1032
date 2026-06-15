import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useGameStore } from '@/store/gameStore';

interface CatchCarrotGameProps {
  duration: number;
  onSuccess: () => void;
  onFail: () => void;
}

interface FallingItem {
  id: number;
  x: number;
  y: number;
  speed: number;
  type: 'carrot' | 'bomb' | 'golden';
}

const CatchCarrotGame: React.FC<CatchCarrotGameProps> = ({ duration, onSuccess, onFail }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [score, setScore] = useState(0);
  const [basketX, setBasketX] = useState(50);
  const [items, setItems] = useState<FallingItem[]>([]);
  const [combo, setCombo] = useState(0);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const targetScore = 15;
  const { updateMiniGameScore, setMiniGameTimeLeft } = useGameStore();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setMiniGameTimeLeft(timeLeft);
  }, [timeLeft, setMiniGameTimeLeft]);

  useEffect(() => {
    updateMiniGameScore(score);
  }, [score, updateMiniGameScore]);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (score >= targetScore) {
        onSuccess();
      } else {
        onFail();
      }
    }
  }, [timeLeft, score, targetScore, onSuccess, onFail]);

  const spawnItem = useCallback(() => {
    const rand = Math.random();
    let type: 'carrot' | 'bomb' | 'golden';
    if (rand < 0.7) type = 'carrot';
    else if (rand < 0.9) type = 'bomb';
    else type = 'golden';

    const newItem: FallingItem = {
      id: Date.now() + Math.random(),
      x: 10 + Math.random() * 80,
      y: -10,
      speed: 1 + Math.random() * 1.5,
      type,
    };
    setItems(prev => [...prev, newItem]);
  }, []);

  useEffect(() => {
    const spawnInterval = setInterval(() => {
      if (items.length < 8) {
        spawnItem();
      }
    }, 800);

    return () => clearInterval(spawnInterval);
  }, [items.length, spawnItem]);

  useEffect(() => {
    const gameLoop = () => {
      setItems(prev => {
        const updated = prev
          .map(item => ({
            ...item,
            y: item.y + item.speed * 0.5,
          }))
          .filter(item => item.y < 100);
        return updated;
      });
      animationRef.current = requestAnimationFrame(gameLoop);
    };

    animationRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!gameAreaRef.current) return;
    const rect = gameAreaRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    setBasketX(Math.max(10, Math.min(90, x)));
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!gameAreaRef.current) return;
    const rect = gameAreaRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = ((touch.clientX - rect.left) / rect.width) * 100;
    setBasketX(Math.max(10, Math.min(90, x)));
  };

  useEffect(() => {
    setItems(prev => {
      const remaining: FallingItem[] = [];
      let scoreChange = 0;
      let caught = false;
      let bombCaught = false;

      prev.forEach(item => {
        const basketWidth = 20;
        const basketLeft = basketX - basketWidth / 2;
        const basketRight = basketX + basketWidth / 2;
        
        if (item.y >= 75 && item.y <= 85 && item.x >= basketLeft && item.x <= basketRight) {
          if (item.type === 'carrot') {
            scoreChange += 1;
            caught = true;
          } else if (item.type === 'golden') {
            scoreChange += 5;
            caught = true;
          } else if (item.type === 'bomb') {
            scoreChange -= 3;
            bombCaught = true;
          }
        } else {
          remaining.push(item);
        }
      });

      if (scoreChange !== 0) {
        setScore(s => Math.max(0, s + scoreChange));
        if (caught) {
          setCombo(c => c + 1);
          setTimeout(() => setCombo(c => Math.max(0, c - 1)), 2000);
        }
        if (bombCaught) {
          setCombo(0);
        }
      }

      return remaining;
    });
  }, [basketX, items.length]);

  return (
    <div className="flex flex-col items-center w-full h-full">
      <div className="flex justify-between w-full mb-4 px-4">
        <div className="bg-orange-100 rounded-full px-4 py-2 flex items-center gap-2">
          <span className="text-2xl">⏰</span>
          <span className="font-bold text-orange-800">{timeLeft}s</span>
        </div>
        <div className="bg-green-100 rounded-full px-4 py-2 flex items-center gap-2">
          <span className="text-2xl">🥕</span>
          <span className="font-bold text-green-800">{score}/{targetScore}</span>
        </div>
        {combo > 2 && (
          <div className="bg-yellow-100 rounded-full px-4 py-2 animate-bounce">
            <span className="font-bold text-yellow-600">连击 x{combo}!</span>
          </div>
        )}
      </div>

      <div
        ref={gameAreaRef}
        className="relative w-full flex-1 bg-gradient-to-b from-sky-200 to-green-200 rounded-3xl overflow-hidden border-4 border-sky-300 cursor-none"
        style={{ minHeight: '300px' }}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
      >
        <div className="absolute top-4 left-1/2 -translate-x-1/2 text-4xl opacity-30">
          🐰
        </div>

        {items.map(item => (
          <div
            key={item.id}
            className="absolute"
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
              transform: 'translate(-50%, -50%)',
              fontSize: item.type === 'golden' ? '2.5rem' : '2rem',
              animation: item.type === 'bomb' ? 'pulse 0.5s ease-in-out infinite' : undefined,
            }}
          >
            {item.type === 'carrot' && '🥕'}
            {item.type === 'bomb' && '💣'}
            {item.type === 'golden' && '🌟'}
          </div>
        ))}

        <div
          className="absolute transition-all duration-75"
          style={{
            left: `${basketX}%`,
            top: '80%',
            transform: 'translate(-50%, -50%)',
            fontSize: '3rem',
          }}
        >
          🧺
        </div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sky-800 text-sm font-medium">
          移动篮子接住胡萝卜！躲开💣，抓住🌟得高分！
        </div>
      </div>
    </div>
  );
};

export default CatchCarrotGame;
