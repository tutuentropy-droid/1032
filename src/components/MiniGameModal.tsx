import React, { useState, useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { ANIMAL_MINI_GAMES, MiniGameType } from '@/types/game';
import PushTimeBallGame from './miniGames/PushTimeBallGame';
import FindKeyGame from './miniGames/FindKeyGame';
import CatchCarrotGame from './miniGames/CatchCarrotGame';
import MemoryMatchGame from './miniGames/MemoryMatchGame';
import CatchFrisbeeGame from './miniGames/CatchFrisbeeGame';

interface MiniGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  animalId: string;
  gameType: MiniGameType;
}

const MiniGameModal: React.FC<MiniGameModalProps> = ({ isOpen, onClose, animalId, gameType }) => {
  const [gamePhase, setGamePhase] = useState<'intro' | 'playing' | 'result'>('intro');
  const [gameResult, setGameResult] = useState<'success' | 'failed' | null>(null);
  const { animals, endMiniGame } = useGameStore();

  const animal = animals.find(a => a.id === animalId);
  const gameInfo = Object.values(ANIMAL_MINI_GAMES).find(g => g.type === gameType);

  useEffect(() => {
    if (isOpen) {
      setGamePhase('intro');
      setGameResult(null);
    }
  }, [isOpen]);

  const handleStart = () => {
    setGamePhase('playing');
  };

  const handleSuccess = () => {
    setGameResult('success');
    setGamePhase('result');
    endMiniGame('success');
  };

  const handleFail = () => {
    setGameResult('failed');
    setGamePhase('result');
    endMiniGame('failed');
  };

  const handleClose = () => {
    onClose();
  };

  const renderGame = () => {
    if (!gameInfo) return null;

    const props = {
      duration: gameInfo.duration,
      onSuccess: handleSuccess,
      onFail: handleFail,
    };

    switch (gameType) {
      case 'push_time_ball':
        return <PushTimeBallGame {...props} />;
      case 'find_key':
        return <FindKeyGame {...props} />;
      case 'catch_carrot':
        return <CatchCarrotGame {...props} />;
      case 'memory_match':
        return <MemoryMatchGame {...props} />;
      case 'catch_frisbee':
        return <CatchFrisbeeGame {...props} />;
      default:
        return null;
    }
  };

  if (!isOpen || !animal || !gameInfo) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: 'rgba(0,0,0,0.5)',
        animation: 'fadeIn 0.3s ease-out',
      }}
      onClick={handleClose}
    >
      <div
        className="relative bg-white rounded-3xl shadow-2xl overflow-hidden max-w-md w-full"
        style={{
          animation: 'popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          maxHeight: '90vh',
        }}
        onClick={e => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 z-10 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
          onClick={handleClose}
        >
          <span className="text-gray-500 text-lg">✕</span>
        </button>

        <div className="bg-gradient-to-r from-pink-200 via-purple-200 to-blue-200 p-6 text-center">
          <div className="text-5xl mb-2">{gameInfo.icon}</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">{gameInfo.name}</h2>
          <p className="text-gray-600 text-sm">{gameInfo.description}</p>
        </div>

        <div className="p-4">
          {gamePhase === 'intro' && (
            <div className="text-center py-8">
              <div className="text-7xl mb-4 animate-bounce-gentle">
                {animal.type === 'rabbit' && '🐰'}
                {animal.type === 'hedgehog' && '🦔'}
                {animal.type === 'bear' && '🐻'}
                {animal.type === 'turtle' && '🐢'}
                {animal.type === 'dog' && '🐶'}
              </div>
              <p className="text-gray-700 mb-2 text-lg font-medium">
                {animal.name} 需要你的帮助！
              </p>
              <p className="text-gray-500 text-sm mb-6">
                限时 {gameInfo.duration} 秒，成功后 {animal.name} 会很开心哦~
              </p>
              <button
                className="px-8 py-3 bg-gradient-to-r from-pink-400 to-purple-400 text-white font-bold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                onClick={handleStart}
              >
                开始游戏 🎮
              </button>
            </div>
          )}

          {gamePhase === 'playing' && (
            <div className="min-h-[400px]">
              {renderGame()}
            </div>
          )}

          {gamePhase === 'result' && (
            <div className="text-center py-8">
              {gameResult === 'success' ? (
                <>
                  <div className="text-7xl mb-4">
                    <span className="animate-bounce inline-block">🎉</span>
                    <span className="animate-bounce inline-block" style={{ animationDelay: '0.1s' }}>✨</span>
                    <span className="animate-bounce inline-block" style={{ animationDelay: '0.2s' }}>🎊</span>
                  </div>
                  <h3 className="text-2xl font-bold text-green-600 mb-2">太棒了！</h3>
                  <p className="text-gray-600 mb-4">
                    成功帮助了 {animal.name}！
                  </p>
                  <p className="text-gray-500 text-sm mb-6">
                    {animal.name} 现在心情好多了~
                  </p>
                  <div className="text-5xl mb-6 animate-wiggle inline-block">
                    {animal.type === 'rabbit' && '🐰'}
                    {animal.type === 'hedgehog' && '🦔'}
                    {animal.type === 'bear' && '🐻'}
                    {animal.type === 'turtle' && '🐢'}
                    {animal.type === 'dog' && '🐶'}
                  </div>
                </>
              ) : (
                <>
                  <div className="text-7xl mb-4">
                    <span className="inline-block" style={{ animation: 'shake 0.5s ease-in-out' }}>😅</span>
                  </div>
                  <h3 className="text-2xl font-bold text-orange-500 mb-2">差一点点！</h3>
                  <p className="text-gray-600 mb-4">
                    这次没能成功呢...
                  </p>
                  <p className="text-gray-500 text-sm mb-6">
                    {animal.name} 有点失落，但不会怪你的~
                  </p>
                  <div className="text-5xl mb-6" style={{ animation: 'shake 0.5s ease-in-out' }}>
                    {animal.type === 'rabbit' && '🐰'}
                    {animal.type === 'hedgehog' && '🦔'}
                    {animal.type === 'bear' && '🐻'}
                    {animal.type === 'turtle' && '🐢'}
                    {animal.type === 'dog' && '🐶'}
                  </div>
                  <div className="flex gap-2 justify-center">
                    <button
                      className="px-6 py-2 bg-gray-200 text-gray-700 font-medium rounded-full hover:bg-gray-300 transition-colors"
                      onClick={handleClose}
                    >
                      下次再试
                    </button>
                    <button
                      className="px-6 py-2 bg-gradient-to-r from-pink-400 to-purple-400 text-white font-bold rounded-full shadow-md hover:shadow-lg transform hover:scale-105 transition-all"
                      onClick={handleStart}
                    >
                      再玩一次 🔄
                    </button>
                  </div>
                </>
              )}
              {gameResult === 'success' && (
                <button
                  className="px-8 py-3 bg-gradient-to-r from-green-400 to-teal-400 text-white font-bold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                  onClick={handleClose}
                >
                  太棒啦！ ✨
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MiniGameModal;
