import React from 'react';
import { AnimalType, EmotionType, AnimationState } from '@/types/game';

interface AnimalSpriteProps {
  type: AnimalType;
  emotion: EmotionType;
  animationState: AnimationState;
  direction: 'left' | 'right';
  size?: number;
}

const AnimalSprite: React.FC<AnimalSpriteProps> = ({
  type,
  emotion,
  animationState,
  direction,
  size = 120,
}) => {
  const getAnimationClass = () => {
    switch (animationState) {
      case 'walking':
        return 'animate-walking';
      case 'eating':
        return 'animate-bounce-gentle';
      case 'reacting':
        return 'animate-wiggle';
      default:
        return 'animate-breathing';
    }
  };

  const renderAnimal = () => {
    switch (type) {
      case 'rabbit':
        return <RabbitSVG emotion={emotion} animationState={animationState} />;
      case 'hedgehog':
        return <HedgehogSVG emotion={emotion} animationState={animationState} />;
      case 'bear':
        return <BearSVG emotion={emotion} animationState={animationState} />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`relative ${getAnimationClass()}`}
      style={{
        width: size,
        height: size,
        transform: direction === 'left' ? 'scaleX(-1)' : 'scaleX(1)',
      }}
    >
      {renderAnimal()}
    </div>
  );
};

const getEyeStyle = (emotion: EmotionType) => {
  switch (emotion) {
    case 'happy':
      return { eyeShape: 'happy', eyeSize: 1 };
    case 'angry':
      return { eyeShape: 'angry', eyeSize: 1.1 };
    case 'sleepy':
      return { eyeShape: 'sleepy', eyeSize: 0.5 };
    default:
      return { eyeShape: 'normal', eyeSize: 1 };
  }
};

const RabbitSVG: React.FC<{ emotion: EmotionType; animationState: AnimationState }> = ({ emotion }) => {
  const eyeStyle = getEyeStyle(emotion);

  return (
    <svg viewBox="0 0 120 120" className="w-full h-full">
      {/* 阴影 */}
      <ellipse cx="60" cy="110" rx="35" ry="8" fill="rgba(0,0,0,0.15)" />

      {/* 身体 */}
      <ellipse cx="60" cy="75" rx="30" ry="28" fill="#FFFAF0" />
      <ellipse cx="60" cy="72" rx="25" ry="22" fill="#FFF5EE" />

      {/* 腿 */}
      <ellipse cx="45" cy="100" rx="10" ry="8" fill="#FFFAF0" />
      <ellipse cx="75" cy="100" rx="10" ry="8" fill="#FFFAF0" />

      {/* 头 */}
      <circle cx="60" cy="50" r="28" fill="#FFFAF0" />
      <circle cx="60" cy="48" r="24" fill="#FFF5EE" />

      {/* 长耳朵 */}
      <ellipse cx="45" cy="20" rx="8" ry="22" fill="#FFFAF0" />
      <ellipse cx="45" cy="22" rx="5" ry="18" fill="#FFB6C1" opacity="0.5" />
      <ellipse cx="75" cy="20" rx="8" ry="22" fill="#FFFAF0" />
      <ellipse cx="75" cy="22" rx="5" ry="18" fill="#FFB6C1" opacity="0.5" />

      {/* 眼睛 */}
      {eyeStyle.eyeShape === 'happy' && (
        <>
          <path d="M48,48 Q52,44 56,48" stroke="#333" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M64,48 Q68,44 72,48" stroke="#333" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </>
      )}
      {eyeStyle.eyeShape === 'angry' && (
        <>
          <path d="M46,44 L54,48" stroke="#333" strokeWidth="3" strokeLinecap="round" />
          <path d="M74,44 L66,48" stroke="#333" strokeWidth="3" strokeLinecap="round" />
          <circle cx="50" cy="50" r="4" fill="#333" />
          <circle cx="70" cy="50" r="4" fill="#333" />
        </>
      )}
      {eyeStyle.eyeShape === 'sleepy' && (
        <>
          <path d="M46,50 Q50,48 54,50" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M66,50 Q70,48 74,50" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round" />
        </>
      )}
      {eyeStyle.eyeShape === 'normal' && (
        <>
          <circle cx="50" cy="49" r="4" fill="#333" />
          <circle cx="70" cy="49" r="4" fill="#333" />
          <circle cx="51" cy="48" r="1.5" fill="white" />
          <circle cx="71" cy="48" r="1.5" fill="white" />
        </>
      )}

      {/* 鼻子 */}
      <ellipse cx="60" cy="58" rx="4" ry="3" fill="#FFB6C1" />

      {/* 嘴巴 */}
      {emotion === 'happy' && (
        <path d="M55,63 Q60,68 65,63" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round" />
      )}
      {emotion === 'angry' && (
        <path d="M55,65 Q60,62 65,65" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round" />
      )}
      {emotion === 'sleepy' && (
        <ellipse cx="60" cy="64" rx="4" ry="2" fill="#333" opacity="0.7" />
      )}

      {/* 腮红 */}
      <circle cx="42" cy="58" r="5" fill="#FFB6C1" opacity={emotion === 'happy' ? '0.6' : '0.3'} />
      <circle cx="78" cy="58" r="5" fill="#FFB6C1" opacity={emotion === 'happy' ? '0.6' : '0.3'} />

      {/* 尾巴 */}
      <circle cx="32" cy="78" r="8" fill="#FFFAF0" />
    </svg>
  );
};

const HedgehogSVG: React.FC<{ emotion: EmotionType; animationState: AnimationState }> = ({ emotion }) => {
  const eyeStyle = getEyeStyle(emotion);

  return (
    <svg viewBox="0 0 120 120" className="w-full h-full">
      {/* 阴影 */}
      <ellipse cx="60" cy="105" rx="40" ry="8" fill="rgba(0,0,0,0.15)" />

      {/* 身体（脸 */}
      <ellipse cx="65" cy="70" rx="35" ry="28" fill="#DEB887" />
      <ellipse cx="65" cy="68" rx="30" ry="24" fill="#F5DEB3" />

      {/* 刺 */}
      <g fill="#8B4513">
        <path d="M30,50 L25,30 L35,45 Z" />
        <path d="M38,40 L32,20 L42,35 Z" />
        <path d="M48,35 L42,15 L52,30 Z" />
        <path d="M58,32 L52,12 L62,28 Z" />
        <path d="M68,32 L62,12 L72,28 Z" />
        <path d="M78,35 L72,15 L82,30 Z" />
        <path d="M88,40 L82,20 L92,35 Z" />
        <path d="M95,50 L90,30 L100,45 Z" />
      </g>

      {/* 脸 */}
      <ellipse cx="85" cy="65" rx="20" ry="18" fill="#FFE4C4" />
      <ellipse cx="85" cy="63" rx="16" ry="14" fill="#FFFAF0" />

      {/* 耳朵 */}
      <ellipse cx="72" cy="42" rx="6" ry="8" fill="#DEB887" />
      <ellipse cx="72" cy="44" rx="4" ry="5" fill="#FFB6C1" opacity="0.4" />

      {/* 眼睛 */}
      {eyeStyle.eyeShape === 'happy' && (
        <>
          <path d="M78,60 Q82,56 86,60" stroke="#333" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </>
      )}
      {eyeStyle.eyeShape === 'angry' && (
        <>
          <path d="M76,56 L84,60" stroke="#333" strokeWidth="3" strokeLinecap="round" />
          <circle cx="80" cy="62" r="4" fill="#333" />
        </>
      )}
      {eyeStyle.eyeShape === 'sleepy' && (
        <>
          <path d="M77,62 Q80,60 84,62" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round" />
        </>
      )}
      {eyeStyle.eyeShape === 'normal' && (
        <>
          <circle cx="80" cy="61" r="4" fill="#333" />
          <circle cx="81" cy="60" r="1.5" fill="white" />
        </>
      )}

      {/* 鼻子 */}
      <ellipse cx="98" cy="65" rx="5" ry="4" fill="#333" />
      <ellipse cx="97" cy="64" rx="2" ry="1.5" fill="#666" />

      {/* 嘴巴 */}
      {emotion === 'happy' && (
        <path d="M90,70 Q95,75 100,70" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round" />
      )}
      {emotion === 'angry' && (
        <path d="M90,72 Q95,69 100,72" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round" />
      )}
      {emotion === 'sleepy' && (
        <ellipse cx="95" cy="72" rx="3" ry="2" fill="#333" opacity="0.7" />
      )}

      {/* 腮红 */}
      <circle cx="75" cy="68" r="5" fill="#FFB6C1" opacity={emotion === 'happy' ? '0.5' : '0.2'} />

      {/* 小脚 */}
      <ellipse cx="50" cy="95" rx="8" ry="5" fill="#DEB887" />
      <ellipse cx="75" cy="95" rx="8" ry="5" fill="#DEB887" />
    </svg>
  );
};

const BearSVG: React.FC<{ emotion: EmotionType; animationState: AnimationState }> = ({ emotion }) => {
  const eyeStyle = getEyeStyle(emotion);

  return (
    <svg viewBox="0 0 120 120" className="w-full h-full">
      {/* 阴影 */}
      <ellipse cx="60" cy="108" rx="38" ry="8" fill="rgba(0,0,0,0.15)" />

      {/* 身体 */}
      <ellipse cx="60" cy="72" rx="35" ry="32" fill="#D2691E" />
      <ellipse cx="60" cy="70" rx="30" ry="27" fill="#DEB887" />
      {/* 肚子 */}
      <ellipse cx="60" cy="78" rx="20" ry="18" fill="#F5DEB3" />

      {/* 腿 */}
      <ellipse cx="42" cy="100" rx="12" ry="10" fill="#D2691E" />
      <ellipse cx="78" cy="100" rx="12" ry="10" fill="#D2691E" />
      <ellipse cx="42" cy="98" rx="8" ry="6" fill="#F5DEB3" />
      <ellipse cx="78" cy="98" rx="8" ry="6" fill="#F5DEB3" />

      {/* 头 */}
      <circle cx="60" cy="45" r="30" fill="#D2691E" />
      <circle cx="60" cy="43" r="26" fill="#DEB887" />

      {/* 耳朵 */}
      <circle cx="38" cy="22" r="12" fill="#D2691E" />
      <circle cx="38" cy="24" r="7" fill="#F5DEB3" />
      <circle cx="82" cy="22" r="12" fill="#D2691E" />
      <circle cx="82" cy="24" r="7" fill="#F5DEB3" />

      {/* 眼睛 */}
      {eyeStyle.eyeShape === 'happy' && (
        <>
          <path d="M46,40 Q50,36 54,40" stroke="#333" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M66,40 Q70,36 74,40" stroke="#333" strokeWidth="3" fill="none" strokeLinecap="round" />
        </>
      )}
      {eyeStyle.eyeShape === 'angry' && (
        <>
          <path d="M42,36 L52,40" stroke="#333" strokeWidth="3" strokeLinecap="round" />
          <path d="M78,36 L68,40" stroke="#333" strokeWidth="3" strokeLinecap="round" />
          <circle cx="48" cy="43" r="5" fill="#333" />
          <circle cx="72" cy="43" r="5" fill="#333" />
        </>
      )}
      {eyeStyle.eyeShape === 'sleepy' && (
        <>
          <path d="M43,42 Q48,40 53,42" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M67,42 Q72,40 77,42" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round" />
        </>
      )}
      {eyeStyle.eyeShape === 'normal' && (
        <>
          <circle cx="48" cy="42" r="5" fill="#333" />
          <circle cx="72" cy="42" r="5" fill="#333" />
          <circle cx="49" cy="41" r="2" fill="white" />
          <circle cx="73" cy="41" r="2" fill="white" />
        </>
      )}

      {/* 鼻子 */}
      <ellipse cx="60" cy="52" rx="6" ry="5" fill="#333" />
      <ellipse cx="59" cy="50" rx="2.5" ry="2" fill="#666" />

      {/* 嘴巴 */}
      {emotion === 'happy' && (
        <path d="M52,58 Q60,65 68,58" stroke="#333" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      )}
      {emotion === 'angry' && (
        <path d="M52,60 Q60,56 68,60" stroke="#333" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      )}
      {emotion === 'sleepy' && (
        <ellipse cx="60" cy="60" rx="5" ry="3" fill="#333" opacity="0.7" />
      )}

      {/* 腮红 */}
      <circle cx="38" cy="50" r="6" fill="#FFB6C1" opacity={emotion === 'happy' ? '0.5' : '0.2'} />
      <circle cx="82" cy="50" r="6" fill="#FFB6C1" opacity={emotion === 'happy' ? '0.5' : '0.2'} />
    </svg>
  );
};

export default AnimalSprite;
