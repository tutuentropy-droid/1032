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
      case 'scared':
        return 'animate-shake';
      case 'glowing':
        return 'animate-glow-pulse';
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
      case 'turtle':
        return <TurtleSVG emotion={emotion} animationState={animationState} />;
      case 'dog':
        return <DogSVG emotion={emotion} animationState={animationState} />;
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
        filter: animationState === 'glowing' ? 'drop-shadow(0 0 15px rgba(255,200,50,0.8))' : undefined,
      }}
    >
      {renderAnimal()}
    </div>
  );
};

const getEyeStyle = (emotion: EmotionType) => {
  switch (emotion) {
    case 'happy':
    case 'excited':
      return { eyeShape: 'happy', eyeSize: 1 };
    case 'angry':
      return { eyeShape: 'angry', eyeSize: 1.1 };
    case 'sleepy':
    case 'calm':
      return { eyeShape: 'sleepy', eyeSize: 0.5 };
    case 'anxious':
      return { eyeShape: 'anxious', eyeSize: 1.2 };
    default:
      return { eyeShape: 'normal', eyeSize: 1 };
  }
};

const RabbitSVG: React.FC<{ emotion: EmotionType; animationState: AnimationState }> = ({ emotion }) => {
  const eyeStyle = getEyeStyle(emotion);

  return (
    <svg viewBox="0 0 120 120" className="w-full h-full">
      <ellipse cx="60" cy="110" rx="35" ry="8" fill="rgba(0,0,0,0.15)" />
      <ellipse cx="60" cy="75" rx="30" ry="28" fill="#FFFAF0" />
      <ellipse cx="60" cy="72" rx="25" ry="22" fill="#FFF5EE" />
      <ellipse cx="45" cy="100" rx="10" ry="8" fill="#FFFAF0" />
      <ellipse cx="75" cy="100" rx="10" ry="8" fill="#FFFAF0" />
      <circle cx="60" cy="50" r="28" fill="#FFFAF0" />
      <circle cx="60" cy="48" r="24" fill="#FFF5EE" />
      <ellipse cx="45" cy="20" rx="8" ry="22" fill="#FFFAF0" />
      <ellipse cx="45" cy="22" rx="5" ry="18" fill="#FFB6C1" opacity="0.5" />
      <ellipse cx="75" cy="20" rx="8" ry="22" fill="#FFFAF0" />
      <ellipse cx="75" cy="22" rx="5" ry="18" fill="#FFB6C1" opacity="0.5" />
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
      {eyeStyle.eyeShape === 'anxious' && (
        <>
          <circle cx="50" cy="50" r="5" fill="none" stroke="#333" strokeWidth="2" />
          <circle cx="70" cy="50" r="5" fill="none" stroke="#333" strokeWidth="2" />
          <circle cx="50" cy="50" r="2" fill="#333" />
          <circle cx="70" cy="50" r="2" fill="#333" />
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
      <ellipse cx="60" cy="58" rx="4" ry="3" fill="#FFB6C1" />
      {emotion === 'happy' || emotion === 'excited' ? (
        <path d="M54,62 Q60,70 66,62" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round" />
      ) : emotion === 'angry' || emotion === 'anxious' ? (
        <path d="M55,65 Q60,62 65,65" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round" />
      ) : (
        <ellipse cx="60" cy="64" rx="4" ry="2" fill="#333" opacity="0.7" />
      )}
      <circle cx="42" cy="58" r="5" fill="#FFB6C1" opacity={emotion === 'happy' || emotion === 'excited' ? '0.6' : '0.3'} />
      <circle cx="78" cy="58" r="5" fill="#FFB6C1" opacity={emotion === 'happy' || emotion === 'excited' ? '0.6' : '0.3'} />
      <circle cx="32" cy="78" r="8" fill="#FFFAF0" />
    </svg>
  );
};

const HedgehogSVG: React.FC<{ emotion: EmotionType; animationState: AnimationState }> = ({ emotion }) => {
  const eyeStyle = getEyeStyle(emotion);
  const spikyOffset = emotion === 'anxious' ? -3 : 0;

  return (
    <svg viewBox="0 0 120 120" className="w-full h-full">
      <ellipse cx="60" cy="105" rx="40" ry="8" fill="rgba(0,0,0,0.15)" />
      <ellipse cx="65" cy="70" rx="35" ry="28" fill="#DEB887" />
      <ellipse cx="65" cy="68" rx="30" ry="24" fill="#F5DEB3" />
      <g fill="#8B4513">
        <path d={`M30,${50 + spikyOffset} L25,${25 + spikyOffset} L35,${45 + spikyOffset} Z`} />
        <path d={`M38,${40 + spikyOffset} L32,${15 + spikyOffset} L42,${35 + spikyOffset} Z`} />
        <path d={`M48,${35 + spikyOffset} L42,${10 + spikyOffset} L52,${30 + spikyOffset} Z`} />
        <path d={`M58,${32 + spikyOffset} L52,${7 + spikyOffset} L62,${28 + spikyOffset} Z`} />
        <path d={`M68,${32 + spikyOffset} L62,${7 + spikyOffset} L72,${28 + spikyOffset} Z`} />
        <path d={`M78,${35 + spikyOffset} L72,${10 + spikyOffset} L82,${30 + spikyOffset} Z`} />
        <path d={`M88,${40 + spikyOffset} L82,${15 + spikyOffset} L92,${35 + spikyOffset} Z`} />
        <path d={`M95,${50 + spikyOffset} L90,${25 + spikyOffset} L100,${45 + spikyOffset} Z`} />
      </g>
      <ellipse cx="85" cy="65" rx="20" ry="18" fill="#FFE4C4" />
      <ellipse cx="85" cy="63" rx="16" ry="14" fill="#FFFAF0" />
      <ellipse cx="72" cy="42" rx="6" ry="8" fill="#DEB887" />
      <ellipse cx="72" cy="44" rx="4" ry="5" fill="#FFB6C1" opacity="0.4" />
      {eyeStyle.eyeShape === 'happy' && (
        <path d="M78,60 Q82,56 86,60" stroke="#333" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      )}
      {eyeStyle.eyeShape === 'angry' && (
        <>
          <path d="M76,56 L84,60" stroke="#333" strokeWidth="3" strokeLinecap="round" />
          <circle cx="80" cy="62" r="4" fill="#333" />
        </>
      )}
      {eyeStyle.eyeShape === 'sleepy' && (
        <path d="M77,62 Q80,60 84,62" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round" />
      )}
      {eyeStyle.eyeShape === 'anxious' && (
        <>
          <circle cx="80" cy="61" r="5" fill="none" stroke="#333" strokeWidth="2" />
          <circle cx="80" cy="61" r="2" fill="#333" />
        </>
      )}
      {eyeStyle.eyeShape === 'normal' && (
        <>
          <circle cx="80" cy="61" r="4" fill="#333" />
          <circle cx="81" cy="60" r="1.5" fill="white" />
        </>
      )}
      <ellipse cx="98" cy="65" rx="5" ry="4" fill="#333" />
      <ellipse cx="97" cy="64" rx="2" ry="1.5" fill="#666" />
      {emotion === 'happy' || emotion === 'excited' ? (
        <path d="M90,70 Q95,75 100,70" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round" />
      ) : emotion === 'angry' || emotion === 'anxious' ? (
        <path d="M90,72 Q95,69 100,72" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round" />
      ) : (
        <ellipse cx="95" cy="72" rx="3" ry="2" fill="#333" opacity="0.7" />
      )}
      <circle cx="75" cy="68" r="5" fill="#FFB6C1" opacity={emotion === 'happy' ? '0.5' : '0.2'} />
      <ellipse cx="50" cy="95" rx="8" ry="5" fill="#DEB887" />
      <ellipse cx="75" cy="95" rx="8" ry="5" fill="#DEB887" />
    </svg>
  );
};

const BearSVG: React.FC<{ emotion: EmotionType; animationState: AnimationState }> = ({ emotion }) => {
  const eyeStyle = getEyeStyle(emotion);

  return (
    <svg viewBox="0 0 120 120" className="w-full h-full">
      <ellipse cx="60" cy="108" rx="38" ry="8" fill="rgba(0,0,0,0.15)" />
      <ellipse cx="60" cy="72" rx="35" ry="32" fill="#D2691E" />
      <ellipse cx="60" cy="70" rx="30" ry="27" fill="#DEB887" />
      <ellipse cx="60" cy="78" rx="20" ry="18" fill="#F5DEB3" />
      <ellipse cx="42" cy="100" rx="12" ry="10" fill="#D2691E" />
      <ellipse cx="78" cy="100" rx="12" ry="10" fill="#D2691E" />
      <ellipse cx="42" cy="98" rx="8" ry="6" fill="#F5DEB3" />
      <ellipse cx="78" cy="98" rx="8" ry="6" fill="#F5DEB3" />
      <circle cx="60" cy="45" r="30" fill="#D2691E" />
      <circle cx="60" cy="43" r="26" fill="#DEB887" />
      <circle cx="38" cy="22" r="12" fill="#D2691E" />
      <circle cx="38" cy="24" r="7" fill="#F5DEB3" />
      <circle cx="82" cy="22" r="12" fill="#D2691E" />
      <circle cx="82" cy="24" r="7" fill="#F5DEB3" />
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
      {eyeStyle.eyeShape === 'anxious' && (
        <>
          <circle cx="48" cy="42" r="6" fill="none" stroke="#333" strokeWidth="2" />
          <circle cx="72" cy="42" r="6" fill="none" stroke="#333" strokeWidth="2" />
          <circle cx="48" cy="42" r="2.5" fill="#333" />
          <circle cx="72" cy="42" r="2.5" fill="#333" />
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
      <ellipse cx="60" cy="52" rx="6" ry="5" fill="#333" />
      <ellipse cx="59" cy="50" rx="2.5" ry="2" fill="#666" />
      {emotion === 'happy' || emotion === 'excited' ? (
        <path d="M52,58 Q60,65 68,58" stroke="#333" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      ) : emotion === 'angry' ? (
        <path d="M52,60 Q60,56 68,60" stroke="#333" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      ) : (
        <ellipse cx="60" cy="60" rx="5" ry="3" fill="#333" opacity="0.7" />
      )}
      <circle cx="38" cy="50" r="6" fill="#FFB6C1" opacity={emotion === 'happy' || emotion === 'excited' ? '0.5' : '0.2'} />
      <circle cx="82" cy="50" r="6" fill="#FFB6C1" opacity={emotion === 'happy' || emotion === 'excited' ? '0.5' : '0.2'} />
    </svg>
  );
};

const TurtleSVG: React.FC<{ emotion: EmotionType; animationState: AnimationState }> = ({ emotion, animationState }) => {
  const eyeStyle = getEyeStyle(emotion);
  const isHiding = animationState === 'scared';

  return (
    <svg viewBox="0 0 120 120" className="w-full h-full">
      <ellipse cx="60" cy="108" rx="40" ry="6" fill="rgba(0,0,0,0.15)" />

      {!isHiding ? (
        <>
          <ellipse cx="95" cy="72" rx="18" ry="16" fill="#8FBC8F" />
          <ellipse cx="95" cy="70" rx="14" ry="12" fill="#98D89E" />

          {eyeStyle.eyeShape === 'happy' && (
            <path d="M89,66 Q92,62 96,66" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round" />
          )}
          {eyeStyle.eyeShape === 'angry' && (
            <>
              <path d="M87,62 L94,65" stroke="#333" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="91" cy="67" r="3" fill="#333" />
            </>
          )}
          {eyeStyle.eyeShape === 'sleepy' && (
            <path d="M88,67 Q91,65 95,67" stroke="#333" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          )}
          {eyeStyle.eyeShape === 'anxious' && (
            <>
              <circle cx="91" cy="66" r="4" fill="none" stroke="#333" strokeWidth="1.8" />
              <circle cx="91" cy="66" r="1.8" fill="#333" />
            </>
          )}
          {eyeStyle.eyeShape === 'normal' && (
            <>
              <circle cx="91" cy="66" r="3" fill="#333" />
              <circle cx="92" cy="65" r="1" fill="white" />
            </>
          )}

          <ellipse cx="104" cy="70" rx="4" ry="3" fill="#333" />
          {emotion === 'happy' || emotion === 'calm' ? (
            <path d="M96,75 Q100,78 104,75" stroke="#333" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          ) : emotion === 'anxious' ? (
            <path d="M97,76 Q100,74 103,76" stroke="#333" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          ) : (
            <ellipse cx="100" cy="75" rx="3" ry="1.5" fill="#333" opacity="0.6" />
          )}
        </>
      ) : null}

      <ellipse cx="58" cy="78" rx="38" ry="28" fill="#228B22" />
      <ellipse cx="58" cy="76" rx="34" ry="24" fill="#32CD32" />

      <g fill="#8B4513" opacity="0.4">
        <polygon points="58,52 50,62 66,62" />
        <polygon points="38,72 30,80 46,80" />
        <polygon points="78,72 70,80 86,80" />
        <polygon points="48,88 42,95 58,95" />
        <polygon points="68,88 58,95 74,95" />
        <circle cx="58" cy="78" r="8" />
      </g>

      {!isHiding ? (
        <>
          <ellipse cx="28" cy="88" rx="8" ry="6" fill="#8FBC8F" />
          <ellipse cx="88" cy="88" rx="8" ry="6" fill="#8FBC8F" />
          <ellipse cx="30" cy="95" rx="9" ry="5" fill="#8FBC8F" />
          <ellipse cx="86" cy="95" rx="9" ry="5" fill="#8FBC8F" />
          <path d="M22,75 Q14,72 18,80 Q20,78 22,75" fill="#8FBC8F" />
        </>
      ) : null}
    </svg>
  );
};

const DogSVG: React.FC<{ emotion: EmotionType; animationState: AnimationState }> = ({ emotion }) => {
  const eyeStyle = getEyeStyle(emotion);
  const tailWag = emotion === 'happy' || emotion === 'excited';

  return (
    <svg viewBox="0 0 120 120" className="w-full h-full">
      <ellipse cx="60" cy="110" rx="38" ry="7" fill="rgba(0,0,0,0.15)" />

      <g style={{ transformOrigin: '25px 75px', animation: tailWag ? 'animate-tail-wag 0.3s ease-in-out infinite alternate' : undefined }}>
        <path d="M28,72 Q15,65 20,55 Q22,62 30,70" fill="#DAA520" stroke="#B8860B" strokeWidth="1" />
      </g>

      <ellipse cx="55" cy="78" rx="30" ry="24" fill="#DAA520" />
      <ellipse cx="55" cy="75" rx="26" ry="20" fill="#F4C430" />
      <ellipse cx="55" cy="82" rx="18" ry="14" fill="#FFF8DC" opacity="0.6" />

      <ellipse cx="38" cy="100" rx="8" ry="7" fill="#DAA520" />
      <ellipse cx="72" cy="100" rx="8" ry="7" fill="#DAA520" />

      <circle cx="80" cy="52" r="28" fill="#DAA520" />
      <circle cx="80" cy="50" r="24" fill="#F4C430" />

      <ellipse cx="58" cy="30" rx="10" ry="16" fill="#DAA520" transform="rotate(-20 58 30)" />
      <ellipse cx="58" cy="32" rx="6" ry="12" fill="#FFB6C1" opacity="0.4" transform="rotate(-20 58 32)" />
      <ellipse cx="100" cy="28" rx="10" ry="18" fill="#DAA520" transform="rotate(15 100 28)" />
      <ellipse cx="100" cy="30" rx="6" ry="14" fill="#FFB6C1" opacity="0.4" transform="rotate(15 100 30)" />

      <ellipse cx="82" cy="60" rx="12" ry="10" fill="#FFF8DC" />

      {eyeStyle.eyeShape === 'happy' && (
        <>
          <path d="M70,48 Q74,44 78,48" stroke="#333" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M86,48 Q90,44 94,48" stroke="#333" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </>
      )}
      {eyeStyle.eyeShape === 'angry' && (
        <>
          <path d="M68,44 L76,48" stroke="#333" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M96,44 L88,48" stroke="#333" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="73" cy="50" r="4" fill="#333" />
          <circle cx="91" cy="50" r="4" fill="#333" />
        </>
      )}
      {eyeStyle.eyeShape === 'sleepy' && (
        <>
          <path d="M70,50 Q73,48 77,50" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M87,50 Q90,48 94,50" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round" />
        </>
      )}
      {eyeStyle.eyeShape === 'anxious' && (
        <>
          <circle cx="73" cy="49" r="5" fill="none" stroke="#333" strokeWidth="2" />
          <circle cx="91" cy="49" r="5" fill="none" stroke="#333" strokeWidth="2" />
          <circle cx="73" cy="49" r="2" fill="#333" />
          <circle cx="91" cy="49" r="2" fill="#333" />
        </>
      )}
      {eyeStyle.eyeShape === 'normal' && (
        <>
          <circle cx="73" cy="49" r="4" fill="#333" />
          <circle cx="91" cy="49" r="4" fill="#333" />
          <circle cx="74" cy="48" r="1.5" fill="white" />
          <circle cx="92" cy="48" r="1.5" fill="white" />
        </>
      )}

      <ellipse cx="82" cy="58" rx="5" ry="4" fill="#333" />
      <ellipse cx="81" cy="56" rx="2" ry="1.5" fill="#555" />

      {emotion === 'happy' || emotion === 'excited' ? (
        <path d="M75,64 Q82,72 90,64" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round" />
      ) : emotion === 'angry' || emotion === 'anxious' ? (
        <path d="M75,66 Q82,63 90,66" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round" />
      ) : (
        <ellipse cx="82" cy="66" rx="5" ry="2" fill="#333" opacity="0.6" />
      )}

      {(emotion === 'happy' || emotion === 'excited') && (
        <path d="M78,67 Q82,75 87,67" fill="#FF6B6B" opacity="0.8" />
      )}

      <circle cx="65" cy="55" r="5" fill="#FFB6C1" opacity={emotion === 'happy' || emotion === 'excited' ? '0.5' : '0.2'} />
      <circle cx="98" cy="55" r="5" fill="#FFB6C1" opacity={emotion === 'happy' || emotion === 'excited' ? '0.5' : '0.2'} />
    </svg>
  );
};

export default AnimalSprite;
