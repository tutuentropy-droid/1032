import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useGameStore } from '@/store/gameStore';

interface CatchFrisbeeGameProps {
  duration: number;
  onSuccess: () => void;
  onFail: () => void;
}

interface Frisbee {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
}

const COLORS = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#F38181', '#AA96DA'];

const CatchFrisbeeGame: React.FC<CatchFrisbeeGameProps> = ({ duration, onSuccess, onFail }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [score, setScore] = useState(0);
  const [dogX, setDogX] = useState(50);
  const [frisbees, setFrisbees] = useState<Frisbee[]>([]);
  const [combo, setCombo] = useState(0);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const gameEndedRef = useRef(false);
  const targetScore = 12;
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
    if (gameEndedRef.current) return;
    if (timeLeft <= 0) {
      gameEndedRef.current = true;
      if (score >= targetScore) {
        onSuccess();
      } else {
        onFail();
      }
    }
  }, [timeLeft, score, targetScore, onSuccess, onFail]);

  const spawnFrisbee = useCallback(() => {
    const side = Math.random() > 0.5 ? 'left' : 'right';
    const newFrisbee: Frisbee = {
      id: Date.now() + Math.random(),
      x: side === 'left' ? -10 : 110,
      y: 10 + Math.random() * 30,
      vx: side === 'left' ? 8 + Math.random() * 6 : -(8 + Math.random() * 6),
      vy: 2 + Math.random() * 3,
      size: 35 + Math.random() * 15,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    };
    setFrisbees(prev => [...prev, newFrisbee]);
  }, []);

  useEffect(() => {
    const spawnInterval = setInterval(() => {
      if (frisbees.length < 6) {
        spawnFrisbee();
      }
    }, 1200);

    return () => clearInterval(spawnInterval);
  }, [frisbees.length, spawnFrisbee]);

  useEffect(() => {
    const gameLoop = () => {
      setFrisbees(prev => {
        return prev
          .map(f => ({
            ...f,
            x: f.x + f.vx * 0.05,
            y: f.y + f.vy * 0.05,
            vy: f.vy + 0.02,
          }))
          .filter(f => f.x > -20 && f.x < 120 && f.y < 100);
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
    setDogX(Math.max(10, Math.min(90, x)));
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!gameAreaRef.current) return;
    const rect = gameAreaRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = ((touch.clientX - rect.left) / rect.width) * 100;
    setDogX(Math.max(10, Math.min(90, x)));
  };

  useEffect(() => {
    setFrisbees(prev => {
      const remaining: Frisbee[] = [];
      let caught = 0;

      prev.forEach(f => {
        const dogWidth = 15;
        const dogLeft = dogX - dogWidth / 2;
        const dogRight = dogX + dogWidth / 2;
        
        if (f.y >= 70 && f.y <= 85 && f.x >= dogLeft && f.x <= dogRight) {
          caught++;
        } else {
          remaining.push(f);
        }
      });

      if (caught > 0) {
        setScore(s => s + caught);
        setCombo(c => c + caught);
        setTimeout(() => setCombo(c => Math.max(0, c - 1)), 2000);
      }

      return remaining;
    });
  }, [dogX, frisbees.length]);

  return (
    <div className="flex flex-col items-center w-full h-full">
      <div className="flex justify-between w-full mb-4 px-4">
        <div className="bg-yellow-100 rounded-full px-4 py-2 flex items-center gap-2">
          <span className="text-2xl">⏰</span>
          <span className="font-bold text-yellow-800">{timeLeft}s</span>
        </div>
        <div className="bg-purple-100 rounded-full px-4 py-2 flex items-center gap-2">
          <span className="text-2xl">🥏</span>
          <span className="font-bold text-purple-800">{score}/{targetScore}</span>
        </div>
        {combo > 2 && (
          <div className="bg-orange-100 rounded-full px-4 py-2 animate-bounce">
            <span className="font-bold text-orange-600">连击 x{combo}!</span>
          </div>
        )}
      </div>

      <div
        ref={gameAreaRef}
        className="relative w-full flex-1 bg-gradient-to-b from-sky-300 to-green-300 rounded-3xl overflow-hidden border-4 border-sky-400 cursor-none"
        style={{ minHeight: '300px' }}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
      >
        <div className="absolute top-2 left-4 text-3xl opacity-50">☁️</div>
        <div className="absolute top-8 right-8 text-2xl opacity-40">☁️</div>
        <div className="absolute top-4 left-1/3 text-3xl opacity-30">☁️</div>

        {frisbees.map(f => (
          <div
            key={f.id}
            className="absolute"
            style={{
              left: `${f.x}%`,
              top: `${f.y}%`,
              transform: 'translate(-50%, -50%)',
              width: `${f.size}px`,
              height: `${f.size / 2.5}px`,
              backgroundColor: f.color,
              borderRadius: '50%',
              boxShadow: `0 3px 10px ${f.color}80`,
              animation: 'spin 1s linear infinite',
            }}
          >
            <div
              className="absolute inset-1 rounded-full"
              style={{ backgroundColor: 'white', opacity: 0.5 }}
            />
          </div>
        ))}

        <div
          className="absolute transition-all duration-75"
          style={{
            left: `${dogX}%`,
            top: '80%',
            transform: 'translate(-50%, -50%)',
            fontSize: '4rem',
          }}
        >
          🐶
        </div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sky-900 text-sm font-medium bg-white/50 rounded-full px-3 py-1">
          移动汪汪接住飞盘！
        </div>
      </div>
    </div>
  );
};

export default CatchFrisbeeGame;
