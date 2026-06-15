import React from 'react';
import { EmotionType, EMOTION_COLORS } from '@/types/game';

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
      case 'calm':
        return '😌';
      case 'anxious':
        return '😰';
      case 'excited':
        return '🤩';
      default:
        return '😊';
    }
  };

  const getBubbleStyle = () => {
    const color = EMOTION_COLORS[emotion] || '#FFFFFF';
    return {
      backgroundColor: color + '40',
      borderColor: color,
      boxShadow: `0 2px 10px ${color}50`,
    };
  };

  const getArrowStyle = () => {
    const color = EMOTION_COLORS[emotion] || '#FFFFFF';
    return {
      backgroundColor: color + '40',
      borderRightColor: color,
      borderBottomColor: color,
    };
  };

  return (
    <div
      className="absolute -top-12 left-1/2 -translate-x-1/2
        rounded-full border-2 px-3 py-1 text-2xl shadow-md
        animate-float"
      style={{
        ...getBubbleStyle(),
        animation: 'pop-in 0.3s ease-out, float 3s ease-in-out infinite',
      }}
    >
      <span className="relative z-10">{getEmoji()}</span>
      <div
        className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45
          border-r-2 border-b-2"
        style={getArrowStyle()}
      />
    </div>
  );
};

export default EmotionBubble;
