import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useGameStore } from '@/store/gameStore';

interface PushTimeBallGameProps {
  duration: number;
  onSuccess: () => void;
  onFail: () => void;
}

interface Ball {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
}

const PushTimeBallGame: React.FC<PushTimeBallGameProps> = ({ duration, onSuccess, onFail }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [score, setScore] = useState(0);
  const [balls, setBalls] = useState<Ball[]>([]);
  const [combo, setCombo] = useState(0);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const targetScore = 8;
  const { updateMiniGameScore, setMiniGameTimeLeft } = useGameStore();

  const spawnBall = useCallback(() => {
    const side = Math.random() > 0.5 ? 'left' : 'right';
    const newBall: Ball = {
      id: Date.now() + Math.random(),
      x: side === 'left' ? -10 : 110,
      y: 30 + Math.random() * 40,
      vx: side === 'left' ? 15 + Math.random() * 10 : -(15 + Math.random() * 10),
      vy: (Math.random() - 0.5) * 5,
      size: 50 + Math.random() * 20,
    };
    setBalls(prev => [...prev, newBall]);
  }, []);

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
    if (timeLeft <= 0) {
      if (score >= targetScore) {
        onSuccess();
      } else {
        onFail();
      }
    }
  }, [timeLeft, score, targetScore, onSuccess, onFail]);

  useEffect(() => {
    updateMiniGameScore(score);
  }, [score, updateMiniGameScore]);

  useEffect(() => {
    const spawnInterval = setInterval(() => {
      if (balls.length < 5) {
        spawnBall();
      }
    }, 1500);

    return () => clearInterval(spawnInterval);
  }, [balls.length, spawnBall]);

  useEffect(() => {
    const gameLoop = () => {
      setBalls(prev => {
        return prev
          .map(ball => ({
            ...ball,
            x: ball.x + ball.vx * 0.02,
            y: ball.y + ball.vy * 0.02,
          }))
          .filter(ball => ball.x > -20 && ball.x < 120);
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

  const handleBallClick = (ballId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setBalls(prev => prev.filter(b => b.id !== ballId));
    setScore(prev => prev + 1);
    setCombo(prev => prev + 1);
    setTimeout(() => setCombo(prev => Math.max(0, prev - 1)), 2000);
  };

  return (
    <div className="flex flex-col items-center w-full h-full">
      <div className="flex justify-between w-full mb-4 px-4">
        <div className="bg-yellow-100 rounded-full px-4 py-2 flex items-center gap-2">
          <span className="text-2xl">⏰</span>
          <span className="font-bold text-yellow-800">{timeLeft}s</span>
        </div>
        <div className="bg-orange-100 rounded-full px-4 py-2 flex items-center gap-2">
          <span className="text-2xl">🏆</span>
          <span className="font-bold text-orange-800">{score}/{targetScore}</span>
        </div>
        {combo > 2 && (
          <div className="bg-pink-100 rounded-full px-4 py-2 animate-bounce">
            <span className="font-bold text-pink-600">连击 x{combo}!</span>
          </div>
        )}
      </div>

      <div
        ref={gameAreaRef}
        className="relative w-full flex-1 bg-gradient-to-b from-amber-100 to-amber-200 rounded-3xl overflow-hidden border-4 border-amber-300"
        style={{ minHeight: '300px' }}
      >
        <div className="absolute top-4 left-1/2 -translate-x-1/2 text-6xl opacity-30">
          🐻
        </div>
        
        {balls.map(ball => (
          <div
            key={ball.id}
            className="absolute cursor-pointer transition-transform hover:scale-110 active:scale-90"
            style={{
              left: `${ball.x}%`,
              top: `${ball.y}%`,
              transform: 'translate(-50%, -50%)',
              fontSize: `${ball.size}px`,
              animation: 'spin 3s linear infinite',
            }}
            onClick={(e) => handleBallClick(ball.id, e)}
          >
            ⏳
          </div>
        ))}

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-amber-700 text-sm font-medium">
          点击时间球把它们推回去！
        </div>
      </div>
    </div>
  );
};

export default PushTimeBallGame;
