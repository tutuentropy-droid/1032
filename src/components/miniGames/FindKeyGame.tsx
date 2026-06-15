import React, { useState, useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';

interface FindKeyGameProps {
  duration: number;
  onSuccess: () => void;
  onFail: () => void;
}

interface HidingSpot {
  id: number;
  x: number;
  y: number;
  hasKey: boolean;
  revealed: boolean;
  type: 'bush' | 'rock' | 'flower' | 'mushroom';
}

const SPOT_TYPES: ('bush' | 'rock' | 'flower' | 'mushroom')[] = ['bush', 'rock', 'flower', 'mushroom'];
const SPOT_EMOJIS: Record<string, string> = {
  bush: '🌳',
  rock: '🪨',
  flower: '🌸',
  mushroom: '🍄',
};

const FindKeyGame: React.FC<FindKeyGameProps> = ({ duration, onSuccess, onFail }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [spots, setSpots] = useState<HidingSpot[]>([]);
  const [foundKeys, setFoundKeys] = useState(0);
  const [wrongClicks, setWrongClicks] = useState(0);
  const targetKeys = 3;
  const { updateMiniGameScore, setMiniGameTimeLeft } = useGameStore();

  useEffect(() => {
    const newSpots: HidingSpot[] = [];
    const positions = [
      { x: 15, y: 40 }, { x: 35, y: 30 }, { x: 55, y: 45 },
      { x: 75, y: 35 }, { x: 25, y: 65 }, { x: 50, y: 70 },
      { x: 70, y: 60 }, { x: 85, y: 75 }, { x: 10, y: 75 },
      { x: 40, y: 55 }, { x: 60, y: 25 }, { x: 80, y: 50 },
    ];
    
    const shuffled = [...positions].sort(() => Math.random() - 0.5);
    
    for (let i = 0; i < 12; i++) {
      newSpots.push({
        id: i,
        x: shuffled[i].x,
        y: shuffled[i].y,
        hasKey: i < targetKeys,
        revealed: false,
        type: SPOT_TYPES[Math.floor(Math.random() * SPOT_TYPES.length)],
      });
    }
    
    setSpots(newSpots.sort(() => Math.random() - 0.5));
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
    updateMiniGameScore(foundKeys);
  }, [foundKeys, updateMiniGameScore]);

  useEffect(() => {
    if (foundKeys >= targetKeys) {
      onSuccess();
    } else if (timeLeft <= 0) {
      onFail();
    }
  }, [foundKeys, timeLeft, targetKeys, onSuccess, onFail]);

  const handleSpotClick = (spotId: number) => {
    setSpots(prev => prev.map(spot => {
      if (spot.id === spotId && !spot.revealed) {
        if (spot.hasKey) {
          setFoundKeys(k => k + 1);
        } else {
          setWrongClicks(w => w + 1);
        }
        return { ...spot, revealed: true };
      }
      return spot;
    }));
  };

  return (
    <div className="flex flex-col items-center w-full h-full">
      <div className="flex justify-between w-full mb-4 px-4">
        <div className="bg-purple-100 rounded-full px-4 py-2 flex items-center gap-2">
          <span className="text-2xl">⏰</span>
          <span className="font-bold text-purple-800">{timeLeft}s</span>
        </div>
        <div className="bg-pink-100 rounded-full px-4 py-2 flex items-center gap-2">
          <span className="text-2xl">🔑</span>
          <span className="font-bold text-pink-800">{foundKeys}/{targetKeys}</span>
        </div>
        <div className="bg-gray-100 rounded-full px-4 py-2 flex items-center gap-2">
          <span className="text-2xl">❌</span>
          <span className="font-bold text-gray-600">{wrongClicks}</span>
        </div>
      </div>

      <div
        className="relative w-full flex-1 bg-gradient-to-b from-green-200 to-green-300 rounded-3xl overflow-hidden border-4 border-green-400"
        style={{ minHeight: '300px' }}
      >
        <div className="absolute top-4 right-4 text-5xl opacity-50">
          🦔
        </div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-4xl opacity-40">
          🏠
        </div>

        {spots.map(spot => (
          <div
            key={spot.id}
            className={`absolute cursor-pointer transition-all duration-300 ${
              spot.revealed ? '' : 'hover:scale-125 active:scale-95'
            }`}
            style={{
              left: `${spot.x}%`,
              top: `${spot.y}%`,
              transform: 'translate(-50%, -50%)',
              fontSize: spot.revealed ? '2rem' : '3rem',
              opacity: spot.revealed ? 0.5 : 1,
            }}
            onClick={() => handleSpotClick(spot.id)}
          >
            {spot.revealed ? (
              <div className="relative">
                <span style={{ fontSize: '2rem', opacity: 0.5 }}>
                  {SPOT_EMOJIS[spot.type]}
                </span>
                {spot.hasKey && (
                  <span
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-bounce"
                    style={{ fontSize: '2.5rem' }}
                  >
                    🔑✨
                  </span>
                )}
              </div>
            ) : (
              <span className="drop-shadow-lg">{SPOT_EMOJIS[spot.type]}</span>
            )}
          </div>
        ))}

        <div className="absolute top-4 left-4 text-green-800 text-sm font-medium bg-white/50 rounded-full px-3 py-1">
          帮刺刺找到 {targetKeys} 把钥匙！
        </div>
      </div>
    </div>
  );
};

export default FindKeyGame;
