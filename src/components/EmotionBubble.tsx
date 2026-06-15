import React from 'react';
import { EmotionType } from '@/types/game';

interface EmotionBubbleProps {
  emotion: EmotionType;
  show?: boolean;
}

const EmotionBubble: React.FC<EmotionBubbleProps> = ({ emotion, show = true }) => {
  if (!show) return null;

  const getEmoji = () => {
    switch (emotion) {
      case 'happy':
        return '😊';
      case 'angry':
        return '😠';
      case 'sleepy':
        return '😴';
      default:
        return '😊';
    }
  };

  const getBubbleColor = () => {
    switch (emotion) {
      case 'happy':
        return 'bg-yellow-100 border-yellow-300';
      case 'angry':
        return 'bg-red-100 border-red-300';
      case 'sleepy':
        return 'bg-blue-100 border-blue-300';
      default:
        return 'bg-white border-gray-200';
    }
  };

  return (
    <div
      className={`absolute -top-12 left-1/2 -translate-x-1/2 ${getBubbleColor()} 
        rounded-full border-2 px-3 py-1 text-2xl shadow-md
        animate-float pop-in`}
      style={{ animation: 'pop-in 0.3s ease-out, float 3s ease-in-out infinite' }}
    >
      <span className="relative z-10">{getEmoji()}</span>
      <div
        className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 
          border-r-2 border-b-2 ${emotion === 'happy' ? 'bg-yellow-100 border-yellow-300' : 
          emotion === 'angry' ? 'bg-red-100 border-red-300' : 'bg-blue-100 border-blue-300'}`}
      />
    </div>
  );
};

export default EmotionBubble;
