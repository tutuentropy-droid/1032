import React from 'react';
import { FusionType } from '@/types/game';

interface FusedAnimalSpriteProps {
  type: FusionType;
  direction: 'left' | 'right';
  size?: number;
}

const FusedAnimalSprite: React.FC<FusedAnimalSpriteProps> = ({
  type,
  direction,
  size = 140,
}) => {
  const renderSprite = () => {
    switch (type) {
      case 'mechanical_fox':
        return <MechanicalFoxSVG />;
      case 'lying_dolphin':
        return <LyingDolphinSVG />;
      case 'flame_cat':
        return <FlameCatSVG />;
      case 'crystal_owl':
        return <CrystalOwlSVG />;
      case 'rainbow_deer':
        return <RainbowDeerSVG />;
      default:
        return null;
    }
  };

  return (
    <div
      className="relative animate-breathing"
      style={{
        width: size,
        height: size,
        transform: direction === 'left' ? 'scaleX(-1)' : 'scaleX(1)',
      }}
    >
      {renderSprite()}
    </div>
  );
};

const MechanicalFoxSVG: React.FC = () => (
  <svg viewBox="0 0 140 140" className="w-full h-full">
    <ellipse cx="70" cy="128" rx="40" ry="8" fill="rgba(0,0,0,0.12)" />

    <ellipse cx="70" cy="85" rx="32" ry="30" fill="#A0A0B8" />
    <ellipse cx="70" cy="82" rx="28" ry="26" fill="#C0C0D0" />
    <ellipse cx="70" cy="90" rx="18" ry="14" fill="#D8D8E8" opacity="0.7" />

    <ellipse cx="50" cy="115" rx="10" ry="8" fill="#A0A0B8" />
    <ellipse cx="90" cy="115" rx="10" ry="8" fill="#A0A0B8" />

    <circle cx="70" cy="55" r="30" fill="#A0A0B8" />
    <circle cx="70" cy="53" r="26" fill="#C0C0D0" />

    <ellipse cx="48" cy="22" rx="10" ry="24" fill="#A0A0B8" />
    <ellipse cx="48" cy="24" rx="6" ry="18" fill="#FF8C42" opacity="0.7" />
    <ellipse cx="92" cy="22" rx="10" ry="24" fill="#A0A0B8" />
    <ellipse cx="92" cy="24" rx="6" ry="18" fill="#FF8C42" opacity="0.7" />

    <path d="M50,18 L42,0 L55,15 Z" fill="#A0A0B8" />
    <path d="M90,18 L98,0 L85,15 Z" fill="#A0A0B8" />

    <circle cx="58" cy="50" r="6" fill="#4488FF" opacity="0.9" />
    <circle cx="82" cy="50" r="6" fill="#4488FF" opacity="0.9" />
    <circle cx="58" cy="50" r="3" fill="#88CCFF" />
    <circle cx="82" cy="50" r="3" fill="#88CCFF" />
    <circle cx="58" cy="49" r="1.5" fill="white" />
    <circle cx="82" cy="49" r="1.5" fill="white" />

    <ellipse cx="70" cy="62" rx="4" ry="3" fill="#666" />

    <g transform="translate(30, 65) rotate(-15)">
      <rect x="0" y="0" width="3" height="30" fill="#888" rx="1" />
      <circle cx="1.5" cy="0" r="5" fill="none" stroke="#888" strokeWidth="2" />
      <circle cx="1.5" cy="0" r="8" fill="none" stroke="#888" strokeWidth="1" opacity="0.5" />
      <rect x="-6" y="-2" width="15" height="2" fill="#666" rx="1" />
      <ellipse cx="8" cy="-1" rx="6" ry="4" fill="#AAD4FF" opacity="0.4" />
    </g>

    <rect x="58" y="88" width="4" height="8" fill="#666" rx="1" />
    <rect x="78" y="88" width="4" height="8" fill="#666" rx="1" />
    <circle cx="60" cy="96" r="3" fill="#888" />
    <circle cx="80" cy="96" r="3" fill="#888" />

    <rect x="60" y="95" width="20" height="2" fill="#4488FF" opacity="0.5" rx="1" />
    <circle cx="62" cy="82" r="2" fill="#4488FF" opacity="0.6" />
    <circle cx="78" cy="82" r="2" fill="#4488FF" opacity="0.6" />
    <circle cx="70" cy="78" r="1.5" fill="#4488FF" opacity="0.4" />

    <path d="M62,68 Q70,76 78,68" stroke="#555" strokeWidth="2" fill="none" strokeLinecap="round" />
  </svg>
);

const LyingDolphinSVG: React.FC = () => (
  <svg viewBox="0 0 140 140" className="w-full h-full">
    <ellipse cx="70" cy="120" rx="55" ry="10" fill="rgba(0,0,0,0.08)" />

    <ellipse cx="65" cy="100" rx="50" ry="20" fill="#6CB4EE" />
    <ellipse cx="65" cy="95" rx="45" ry="16" fill="#87CEEB" />
    <ellipse cx="65" cy="90" rx="35" ry="12" fill="#B0E0E6" opacity="0.6" />

    <ellipse cx="35" cy="88" rx="15" ry="12" fill="#6CB4EE" />
    <ellipse cx="35" cy="86" rx="10" ry="8" fill="#87CEEB" />

    <path d="M95,85 Q110,70 105,85 Q100,80 95,90" fill="#6CB4EE" />
    <path d="M98,86 Q108,75 104,86" fill="#87CEEB" opacity="0.7" />

    <ellipse cx="105" cy="80" rx="12" ry="10" fill="#6CB4EE" transform="rotate(-20 105 80)" />
    <ellipse cx="105" cy="78" rx="8" ry="7" fill="#87CEEB" transform="rotate(-20 105 78)" />

    <circle cx="100" cy="75" r="5" fill="#333" />
    <circle cx="101" cy="74" r="2" fill="white" />
    <circle cx="99" cy="76" r="1" fill="#FFD700" opacity="0.6" />

    <path d="M108,80 Q112,78 110,82" stroke="#333" strokeWidth="1.5" fill="none" strokeLinecap="round" />

    <path d="M70,80 Q80,65 90,80" fill="#6CB4EE" opacity="0.6" />

    <ellipse cx="60" cy="95" rx="8" ry="4" fill="#87CEEB" />

    <path d="M55,110 Q58,105 60,110" stroke="#FFB6C1" strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M70,112 Q73,107 75,112" stroke="#FFB6C1" strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M85,110 Q88,105 90,110" stroke="#FFB6C1" strokeWidth="2" fill="none" strokeLinecap="round" />

    <circle cx="40" cy="80" r="4" fill="#FFD700" opacity="0.3" className="animate-sparkle" />
    <circle cx="55" cy="85" r="3" fill="#FFD700" opacity="0.2" className="animate-sparkle" style={{ animationDelay: '0.5s' }} />
    <circle cx="80" cy="82" r="3.5" fill="#FFD700" opacity="0.25" className="animate-sparkle" style={{ animationDelay: '1s' }} />

    <ellipse cx="70" cy="100" rx="50" ry="6" fill="#FFD700" opacity="0.1" />
  </svg>
);

const FlameCatSVG: React.FC = () => (
  <svg viewBox="0 0 140 140" className="w-full h-full">
    <ellipse cx="70" cy="128" rx="38" ry="8" fill="rgba(0,0,0,0.12)" />

    <ellipse cx="70" cy="85" rx="30" ry="28" fill="#FF6B35" />
    <ellipse cx="70" cy="82" rx="26" ry="24" fill="#FF8C42" />
    <ellipse cx="70" cy="90" rx="18" ry="14" fill="#FFAA5C" opacity="0.5" />

    <ellipse cx="50" cy="115" rx="8" ry="7" fill="#FF6B35" />
    <ellipse cx="90" cy="115" rx="8" ry="7" fill="#FF6B35" />

    <circle cx="70" cy="55" r="28" fill="#FF6B35" />
    <circle cx="70" cy="53" r="24" fill="#FF8C42" />

    <path d="M42,40 L38,15 L50,35 Z" fill="#FF6B35" />
    <path d="M44,38 L42,20 L50,35 Z" fill="#FFB347" opacity="0.6" />
    <path d="M98,40 L102,15 L90,35 Z" fill="#FF6B35" />
    <path d="M96,38 L98,20 L90,35 Z" fill="#FFB347" opacity="0.6" />

    <path d="M45,15 Q40,5 48,8 Q44,0 52,6 Q48,-2 56,5 Q50,5 50,15" fill="#FF4500" opacity="0.7" />
    <path d="M95,15 Q100,5 92,8 Q96,0 88,6 Q92,-2 84,5 Q90,5 90,15" fill="#FF4500" opacity="0.7" />

    <ellipse cx="56" cy="50" rx="7" ry="8" fill="#FFD700" />
    <ellipse cx="56" cy="50" rx="3" ry="6" fill="#333" />
    <ellipse cx="84" cy="50" rx="7" ry="8" fill="#FFD700" />
    <ellipse cx="84" cy="50" rx="3" ry="6" fill="#333" />
    <circle cx="55" cy="48" r="1.5" fill="white" />
    <circle cx="83" cy="48" r="1.5" fill="white" />

    <ellipse cx="70" cy="62" rx="4" ry="3" fill="#333" />

    <path d="M63,67 Q70,72 77,67" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M66,69 L64,71" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M74,69 L76,71" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />

    <path d="M30,75 Q15,65 20,55" stroke="#FF6B35" strokeWidth="3" fill="none" strokeLinecap="round" />

    <circle cx="70" cy="35" r="8" fill="#FF4500" opacity="0.2" />
    <circle cx="60" cy="40" r="5" fill="#FF6347" opacity="0.15" />
    <circle cx="80" cy="38" r="6" fill="#FF4500" opacity="0.18" />

    <path d="M55,40 Q52,30 58,35" fill="#FF4500" opacity="0.5" />
    <path d="M75,38 Q78,28 72,33" fill="#FF6347" opacity="0.4" />
    <path d="M65,32 Q63,22 68,28" fill="#FF4500" opacity="0.3" />

    <circle cx="42" cy="60" r="4" fill="#FFB6C1" opacity="0.5" />
    <circle cx="98" cy="60" r="4" fill="#FFB6C1" opacity="0.5" />
  </svg>
);

const CrystalOwlSVG: React.FC = () => (
  <svg viewBox="0 0 140 140" className="w-full h-full">
    <ellipse cx="70" cy="128" rx="35" ry="8" fill="rgba(0,0,0,0.1)" />

    <ellipse cx="70" cy="88" rx="34" ry="32" fill="#9B7EBD" />
    <ellipse cx="70" cy="85" rx="30" ry="28" fill="#B8A0D2" />
    <ellipse cx="70" cy="90" rx="22" ry="18" fill="#D4C0EB" opacity="0.5" />

    <circle cx="70" cy="50" r="32" fill="#9B7EBD" />
    <circle cx="70" cy="48" r="28" fill="#B8A0D2" />

    <ellipse cx="42" cy="25" rx="14" ry="16" fill="#9B7EBD" transform="rotate(-25 42 25)" />
    <ellipse cx="42" cy="27" rx="8" ry="10" fill="#C8B0E0" opacity="0.5" transform="rotate(-25 42 27)" />
    <ellipse cx="98" cy="25" rx="14" ry="16" fill="#9B7EBD" transform="rotate(25 98 25)" />
    <ellipse cx="98" cy="27" rx="8" ry="10" fill="#C8B0E0" opacity="0.5" transform="rotate(25 98 27)" />

    <circle cx="56" cy="48" r="14" fill="#E8D8F8" stroke="#9B7EBD" strokeWidth="2" />
    <circle cx="56" cy="48" r="8" fill="#6A3D9A" />
    <circle cx="56" cy="47" r="4" fill="#2D1B4E" />
    <circle cx="54" cy="45" r="2" fill="white" />

    <circle cx="84" cy="48" r="14" fill="#E8D8F8" stroke="#9B7EBD" strokeWidth="2" />
    <circle cx="84" cy="48" r="8" fill="#6A3D9A" />
    <circle cx="84" cy="47" r="4" fill="#2D1B4E" />
    <circle cx="82" cy="45" r="2" fill="white" />

    <path d="M64,62 L70,68 L76,62" fill="#FFB347" stroke="#E09930" strokeWidth="1" />

    <polygon points="55,40 52,30 58,35" fill="white" opacity="0.7" />
    <polygon points="75,40 72,30 78,35" fill="white" opacity="0.7" />
    <polygon points="65,35 63,28 68,32" fill="white" opacity="0.5" />

    <ellipse cx="50" cy="115" rx="6" ry="8" fill="#9B7EBD" />
    <ellipse cx="50" cy="113" rx="3" ry="5" fill="#B8A0D2" opacity="0.5" />
    <ellipse cx="90" cy="115" rx="6" ry="8" fill="#9B7EBD" />
    <ellipse cx="90" cy="113" rx="3" ry="5" fill="#B8A0D2" opacity="0.5" />

    <circle cx="35" cy="72" r="4" fill="white" opacity="0.4" className="animate-sparkle" />
    <circle cx="105" cy="68" r="3" fill="white" opacity="0.3" className="animate-sparkle" style={{ animationDelay: '0.8s' }} />
    <circle cx="55" cy="105" r="3.5" fill="white" opacity="0.35" className="animate-sparkle" style={{ animationDelay: '1.5s' }} />
    <circle cx="85" cy="100" r="2.5" fill="white" opacity="0.3" className="animate-sparkle" style={{ animationDelay: '2s' }} />

    <polygon points="70,30 68,20 72,24" fill="#E8D8F8" opacity="0.6" />
  </svg>
);

const RainbowDeerSVG: React.FC = () => (
  <svg viewBox="0 0 140 140" className="w-full h-full">
    <ellipse cx="70" cy="128" rx="38" ry="8" fill="rgba(0,0,0,0.1)" />

    <ellipse cx="70" cy="85" rx="30" ry="28" fill="#C8A070" />
    <ellipse cx="70" cy="82" rx="26" ry="24" fill="#D4B088" />
    <ellipse cx="70" cy="88" rx="18" ry="14" fill="#E8D0B0" opacity="0.5" />

    <ellipse cx="50" cy="118" rx="6" ry="10" fill="#C8A070" />
    <ellipse cx="90" cy="118" rx="6" ry="10" fill="#C8A070" />

    <ellipse cx="75" cy="52" r="26" fill="#C8A070" />
    <ellipse cx="75" cy="50" r="22" fill="#D4B088" />

    <path d="M60,35 L55,5 L62,30" fill="#C8A070" />
    <path d="M58,35 L55,12 L60,30" fill="#FF6B6B" opacity="0.4" />
    <path d="M90,32 L95,2 L88,28" fill="#C8A070" />
    <path d="M92,32 L95,10 L90,28" fill="#4ECDC4" opacity="0.4" />

    <path d="M52,8 L50,0 L54,6" fill="#FF6B6B" />
    <path d="M56,6 L55,0 L58,5" fill="#FFD93D" />
    <path d="M48,10 L47,2 L51,8" fill="#6BCB77" />

    <path d="M98,5 L100,0 L96,4" fill="#4ECDC4" />
    <path d="M94,4 L95,0 L92,3" fill="#4D96FF" />
    <path d="M102,7 L103,2 L99,6" fill="#9B59B6" />

    <circle cx="67" cy="47" r="5" fill="#333" />
    <circle cx="83" cy="47" r="5" fill="#333" />
    <circle cx="68" cy="46" r="2" fill="white" />
    <circle cx="84" cy="46" r="2" fill="white" />

    <ellipse cx="75" cy="57" rx="4" ry="3" fill="#333" />

    <path d="M68,62 Q75,68 82,62" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round" />

    <path d="M50,65 Q38,60 30,68" fill="none" stroke="#C8A070" strokeWidth="4" strokeLinecap="round" />

    <circle cx="65" cy="80" r="6" fill="#FF6B6B" opacity="0.2" />
    <circle cx="80" cy="78" r="7" fill="#4ECDC4" opacity="0.2" />
    <circle cx="72" cy="72" r="5" fill="#FFD93D" opacity="0.15" />
    <circle cx="58" cy="76" r="4" fill="#9B59B6" opacity="0.15" />
    <circle cx="88" cy="82" r="5" fill="#4D96FF" opacity="0.18" />

    <circle cx="62" cy="42" r="4" fill="#FFB6C1" opacity="0.5" />
    <circle cx="88" cy="42" r="4" fill="#FFB6C1" opacity="0.5" />

    <circle cx="55" cy="70" r="3" fill="#FFD700" opacity="0.4" className="animate-sparkle" />
    <circle cx="95" cy="65" r="2.5" fill="#FFD700" opacity="0.3" className="animate-sparkle" style={{ animationDelay: '0.7s' }} />
    <circle cx="75" cy="95" r="3" fill="#FFD700" opacity="0.35" className="animate-sparkle" style={{ animationDelay: '1.3s' }} />
  </svg>
);

export default FusedAnimalSprite;
