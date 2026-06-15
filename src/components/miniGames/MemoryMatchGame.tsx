import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useGameStore } from '@/store/gameStore';

interface MemoryMatchGameProps {
  duration: number;
  onSuccess: () => void;
  onFail: () => void;
}

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const EMOJIS = ['🐢', '🐰', '🦔', '🐻', '🐶', '🐱', '🦊', '🐼'];

const MemoryMatchGame: React.FC<MemoryMatchGameProps> = ({ duration, onSuccess, onFail }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);
  const [moves, setMoves] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const gameEndedRef = useRef(false);
  const targetMatches = 6;
  const { updateMiniGameScore, setMiniGameTimeLeft } = useGameStore();

  const initializeCards = useCallback(() => {
    const selectedEmojis = EMOJIS.slice(0, targetMatches);
    const cardPairs = [...selectedEmojis, ...selectedEmojis];
    const shuffled = cardPairs
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(shuffled);
  }, [targetMatches]);

  useEffect(() => {
    initializeCards();
  }, [initializeCards]);

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
    updateMiniGameScore(matches);
  }, [matches, updateMiniGameScore]);

  useEffect(() => {
    if (gameEndedRef.current) return;
    if (matches >= targetMatches) {
      gameEndedRef.current = true;
      setTimeout(() => onSuccess(), 500);
    } else if (timeLeft <= 0) {
      gameEndedRef.current = true;
      onFail();
    }
  }, [matches, timeLeft, targetMatches, onSuccess, onFail]);

  const handleCardClick = (cardId: number) => {
    if (isChecking) return;
    if (flippedCards.length >= 2) return;
    
    const card = cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;

    const newFlipped = [...flippedCards, cardId];
    setFlippedCards(newFlipped);
    setCards(prev => prev.map(c => 
      c.id === cardId ? { ...c, isFlipped: true } : c
    ));

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      setIsChecking(true);
      
      const [first, second] = newFlipped;
      const firstCard = cards.find(c => c.id === first);
      const secondCard = cards.find(c => c.id === second);

      if (firstCard && secondCard && firstCard.emoji === secondCard.emoji) {
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.id === first || c.id === second ? { ...c, isMatched: true } : c
          ));
          setMatches(m => m + 1);
          setFlippedCards([]);
          setIsChecking(false);
        }, 600);
      } else {
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.id === first || c.id === second ? { ...c, isFlipped: false } : c
          ));
          setFlippedCards([]);
          setIsChecking(false);
        }, 1000);
      }
    }
  };

  return (
    <div className="flex flex-col items-center w-full h-full">
      <div className="flex justify-between w-full mb-4 px-4">
        <div className="bg-teal-100 rounded-full px-4 py-2 flex items-center gap-2">
          <span className="text-2xl">⏰</span>
          <span className="font-bold text-teal-800">{timeLeft}s</span>
        </div>
        <div className="bg-green-100 rounded-full px-4 py-2 flex items-center gap-2">
          <span className="text-2xl">✅</span>
          <span className="font-bold text-green-800">{matches}/{targetMatches}</span>
        </div>
        <div className="bg-blue-100 rounded-full px-4 py-2 flex items-center gap-2">
          <span className="text-2xl">👆</span>
          <span className="font-bold text-blue-800">{moves}步</span>
        </div>
      </div>

      <div
        className="relative w-full flex-1 bg-gradient-to-b from-teal-100 to-green-100 rounded-3xl overflow-hidden border-4 border-teal-300 p-4"
        style={{ minHeight: '300px' }}
      >
        <div className="absolute top-4 right-4 text-4xl opacity-30">
          🐢
        </div>

        <div className="grid grid-cols-4 gap-2 h-full items-center justify-items-center">
          {cards.map(card => (
            <div
              key={card.id}
              className={`relative cursor-pointer transition-all duration-300 transform-gpu
                ${card.isFlipped || card.isMatched ? '' : 'hover:scale-110 active:scale-95'}
                ${card.isMatched ? 'opacity-60' : ''}
              `}
              style={{
                width: '60px',
                height: '70px',
                perspective: '1000px',
              }}
              onClick={() => handleCardClick(card.id)}
            >
              <div
                className="relative w-full h-full transition-transform duration-500"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: card.isFlipped || card.isMatched ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
              >
                <div
                  className="absolute w-full h-full rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center shadow-lg border-2 border-teal-300"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <span className="text-3xl">❓</span>
                </div>
                <div
                  className={`absolute w-full h-full rounded-xl bg-gradient-to-br from-white to-gray-100 flex items-center justify-center shadow-lg border-2
                    ${card.isMatched ? 'border-green-400 bg-green-50' : 'border-gray-200'}
                  `}
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                  }}
                >
                  <span className="text-3xl">{card.emoji}</span>
                  {card.isMatched && (
                    <span className="absolute top-0 right-0 text-xl">✨</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-teal-800 text-sm font-medium">
          翻开卡片找出配对的动物！
        </div>
      </div>
    </div>
  );
};

export default MemoryMatchGame;
