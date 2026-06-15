import React, { useMemo } from 'react';
import { FusionType, FUSION_COMBOS, IslandType, WeatherType, ISLAND_INFO, TIME_OF_DAY_CONFIG } from '@/types/game';
import { useGameStore } from '@/store/gameStore';

interface IslandBackgroundProps {
  activeFusions?: FusionType[];
}

const IslandBackground: React.FC<IslandBackgroundProps> = ({ activeFusions = [] }) => {
  const { currentIsland, weather, timeOfDay } = useGameStore();
  const islandInfo = ISLAND_INFO[currentIsland];
  const timeConfig = TIME_OF_DAY_CONFIG[timeOfDay];
  const primaryFusion = activeFusions.length > 0 ? activeFusions[0] : null;
  const fusionCombo = primaryFusion ? FUSION_COMBOS.find(c => c.type === primaryFusion) : null;

  const skyGradient = fusionCombo
    ? getFusionSkyGradient(primaryFusion)
    : islandInfo.skyGradient;

  const grassPrimary = fusionCombo ? getFusionGrassColor(primaryFusion) : islandInfo.grassColor;
  const grassSecondary = fusionCombo ? getFusionGrassSecondary(primaryFusion) : islandInfo.grassSecondary;
  const waterColor = fusionCombo ? getFusionWaterColor(primaryFusion) : islandInfo.waterColor;

  const isNight = timeOfDay === 'night';
  const isDusk = timeOfDay === 'dusk';
  const isDawn = timeOfDay === 'dawn';

  const weatherParticles = useMemo(() => {
    return generateWeatherParticles(weather);
  }, [weather]);

  const stars = useMemo(() => {
    if (!isNight && !isDusk) return [];
    return generateStars(isNight ? 60 : 25);
  }, [isNight, isDusk]);

  const fireflies = useMemo(() => {
    if (currentIsland !== 'night') return [];
    return generateFireflies(15);
  }, [currentIsland]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute inset-0"
        style={{
          background: skyGradient,
          transition: 'background 2s ease-in-out',
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          background: timeConfig.overlay,
          transition: 'background 2s ease-in-out',
          mixBlendMode: 'multiply',
        }}
      />

      {fusionCombo && (
        <div
          className="absolute inset-0 animate-fusion-env-pulse"
          style={{
            background: `radial-gradient(ellipse at 50% 60%, ${fusionCombo.environmentGlow} 0%, transparent 60%)`,
            transition: 'background 2s ease-in-out',
          }}
        />
      )}

      {weather === 'foggy' && (
        <>
          <div
            className="absolute inset-0 animate-fog-drift"
            style={{
              background: 'radial-gradient(ellipse at 30% 50%, rgba(255,255,255,0.4) 0%, transparent 60%)',
            }}
          />
          <div
            className="absolute inset-0 animate-fog-drift"
            style={{
              background: 'radial-gradient(ellipse at 70% 40%, rgba(200,200,220,0.35) 0%, transparent 50%)',
              animationDelay: '-4s',
            }}
          />
        </>
      )}

      {stars.map((star, i) => (
        <div
          key={`star-${i}`}
          className="absolute rounded-full bg-white animate-star-twinkle"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            animationDelay: `${star.delay}s`,
            opacity: isDusk ? 0.6 : 0.9,
          }}
        />
      ))}

      {isNight || isDusk ? (
        <div
          className="absolute rounded-full"
          style={{
            top: '8%',
            right: '12%',
            width: 70,
            height: 70,
            background: 'radial-gradient(circle at 35% 35%, #FFFACD 0%, #F0E68C 50%, #DAA520 100%)',
            boxShadow: '0 0 50px 15px rgba(255, 250, 205, 0.4)',
            opacity: timeConfig.sunMoonOpacity,
            transition: 'opacity 2s ease-in-out',
          }}
        >
          <div
            className="absolute rounded-full"
            style={{
              top: '15%',
              left: '20%',
              width: 12,
              height: 12,
              background: 'rgba(180, 160, 120, 0.4)',
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              top: '45%',
              left: '55%',
              width: 8,
              height: 8,
              background: 'rgba(180, 160, 120, 0.35)',
            }}
          />
        </div>
      ) : (
        <div
          className="absolute rounded-full animate-breathing-slow"
          style={{
            top: '8%',
            right: '12%',
            width: 80,
            height: 80,
            background: isDawn
              ? 'radial-gradient(circle, #FFE4B5 0%, #FFA07A 100%)'
              : 'radial-gradient(circle, #FFFF99 0%, #FFD700 100%)',
            opacity: timeConfig.sunMoonOpacity,
            boxShadow: fusionCombo
              ? `0 0 60px 20px ${fusionCombo.environmentGlow}`
              : isDawn
                ? '0 0 60px 20px rgba(255, 180, 100, 0.5)'
                : '0 0 60px 20px rgba(255, 255, 200, 0.5)',
            transition: 'box-shadow 2s ease-in-out, opacity 2s ease-in-out',
          }}
        >
          <div className="absolute inset-2 rounded-full bg-yellow-50 opacity-80" />
        </div>
      )}

      {currentIsland === 'antigravity' && (
        <div className="absolute inset-0">
          {[...Array(8)].map((_, i) => (
            <div
              key={`float-island-${i}`}
              className="absolute animate-anti-gravity"
              style={{
                left: `${10 + i * 12}%`,
                top: `${15 + (i % 3) * 15}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${3 + (i % 2)}s`,
              }}
            >
              <svg width={40 + (i % 3) * 20} height={30 + (i % 3) * 15} viewBox="0 0 100 80">
                <ellipse cx="50" cy="30" rx="45" ry="20" fill={grassPrimary} opacity="0.7" />
                <ellipse cx="50" cy="45" rx="35" ry="25" fill={grassSecondary} opacity="0.5" />
                <path d="M15,35 Q50,80 85,35" fill="#8B4513" opacity="0.4" />
              </svg>
            </div>
          ))}
        </div>
      )}

      {weather !== 'foggy' && (
        <>
          <div className="absolute top-16 left-0 animate-cloud-drift" style={{ animationDuration: '80s', opacity: isNight ? 0.3 : 1 }}>
            <CloudSVG size={80} tint={fusionCombo?.environmentTint} dark={isNight} />
          </div>
          <div className="absolute top-24 left-1/4 animate-cloud-drift-slow" style={{ animationDelay: '-20s', opacity: isNight ? 0.25 : 0.9 }}>
            <CloudSVG size={60} tint={fusionCombo?.environmentTint} dark={isNight} />
          </div>
          <div className="absolute top-8 right-1/3 animate-cloud-drift" style={{ animationDuration: '100s', animationDelay: '-40s', opacity: isNight ? 0.2 : 0.8 }}>
            <CloudSVG size={100} tint={fusionCombo?.environmentTint} dark={isNight} />
          </div>
          <div className="absolute top-32 right-1/4 animate-cloud-drift-slow" style={{ animationDelay: '-60s', opacity: isNight ? 0.3 : 1 }}>
            <CloudSVG size={50} tint={fusionCombo?.environmentTint} dark={isNight} />
          </div>
        </>
      )}

      {weatherParticles.map((p, i) => (
        <div
          key={`weather-${i}`}
          className={`absolute pointer-events-none ${weather === 'rainy' ? 'animate-raindrop' : weather === 'snowy' ? 'animate-snowflake' : ''}`}
          style={{
            left: `${p.x}%`,
            top: `-${p.offset}%`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        >
          {weather === 'rainy' ? (
            <div
              className="rounded-full"
              style={{
                width: 2,
                height: 15,
                background: 'linear-gradient(180deg, rgba(150,200,255,0.1) 0%, rgba(100,180,255,0.8) 100%)',
              }}
            />
          ) : weather === 'snowy' ? (
            <span style={{ fontSize: p.size, opacity: 0.9 }}>❄️</span>
          ) : null}
        </div>
      ))}

      {fireflies.map((f, i) => (
        <div
          key={`firefly-${i}`}
          className="absolute rounded-full animate-firefly-float"
          style={{
            left: `${f.x}%`,
            top: `${f.y}%`,
            width: 6,
            height: 6,
            background: 'radial-gradient(circle, #FFFF00 0%, #ADFF2F 50%, transparent 100%)',
            boxShadow: '0 0 10px 3px rgba(173, 255, 47, 0.6)',
            animationDelay: `${f.delay}s`,
            animationDuration: `${3 + (i % 3)}s`,
          }}
        />
      ))}

      <svg
        className="absolute bottom-1/3 left-0 w-full"
        viewBox="0 0 1200 200"
        preserveAspectRatio="none"
        style={{ height: '25%' }}
      >
        <path
          d="M0,200 L0,120 Q150,60 300,100 T600,40 T900,80 T1200,50 L1200,200 Z"
          fill={grassPrimary}
          opacity="0.6"
        />
        <path
          d="M0,200 L0,150 Q200,100 400,130 T800,90 T1200,120 L1200,200 Z"
          fill={grassSecondary}
          opacity="0.7"
        />
      </svg>

      <div
        className="absolute bottom-0 left-0 right-0"
        style={{ height: '55%' }}
      >
        <svg
          className="w-full h-full"
          viewBox="0 0 1200 500"
          preserveAspectRatio="none"
        >
          <ellipse cx="600" cy="450" rx="700" ry="200" fill={grassPrimary} />
          <ellipse cx="600" cy="430" rx="650" ry="180" fill={grassSecondary} />

          <ellipse
            cx="600" cy="470" rx="680" ry="190"
            fill="none" stroke="#F5DEB3" strokeWidth="15" opacity="0.8"
          />

          <g opacity="0.3">
            {[...Array(20)].map((_, i) => (
              <path
                key={i}
                d={`M${100 + i * 60},380 Q${110 + i * 60},370 ${105 + i * 60},380`}
                stroke={fusionCombo ? fusionCombo.environmentGlow.replace('0.3', '0.5') : '#228B22'}
                strokeWidth="2"
                fill="none"
              />
            ))}
          </g>
        </svg>
      </div>

      <div className="absolute bottom-1/4 left-10" style={{ transform: 'translateY(50%)' }}>
        <TreeSVG size={120} fusionType={primaryFusion} islandType={currentIsland} dark={isNight} />
      </div>
      <div className="absolute bottom-1/3 right-16" style={{ transform: 'translateY(30%)' }}>
        <TreeSVG size={90} fusionType={primaryFusion} islandType={currentIsland} dark={isNight} />
      </div>
      <div className="absolute bottom-1/4 left-1/3" style={{ transform: 'translateY(60%)' }}>
        <TreeSVG size={70} fusionType={primaryFusion} islandType={currentIsland} dark={isNight} />
      </div>

      <div className="absolute bottom-1/4 right-1/4 w-32 h-16 animate-wave-rise" style={{ transform: 'translateY(100%)' }}>
        <svg viewBox="0 0 200 100" className="w-full h-full">
          <ellipse cx="100" cy="50" rx="90" ry="40" fill={waterColor} opacity="0.8" />
          <ellipse cx="100" cy="45" rx="80" ry="35" fill={waterColor} opacity="0.6" />
          <ellipse cx="100" cy="50" rx="60" ry="25" fill="none" stroke="white" strokeWidth="1.5" opacity="0.5" className="animate-ripple" />
        </svg>
      </div>

      {currentIsland !== 'night' && (
        <>
          <div className="absolute bottom-1/3 left-1/4 animate-sway" style={{ transform: 'translateY(150%)' }}>
            <FlowerSVG color={fusionCombo ? fusionCombo.environmentGlow.replace(/[\d.]+\)$/, '1)') : '#FFB6C1'} size={30} dark={isNight} />
          </div>
          <div className="absolute bottom-1/3 left-1/2 animate-sway-slow" style={{ transform: 'translateY(180%)' }}>
            <FlowerSVG color="#FFD700" size={25} dark={isNight} />
          </div>
          <div className="absolute bottom-1/4 right-1/3 animate-sway" style={{ transform: 'translateY(200%)', animationDelay: '1s' }}>
            <FlowerSVG color={fusionCombo ? '#E6E6FA' : '#E6E6FA'} size={28} dark={isNight} />
          </div>
          <div className="absolute bottom-1/3 left-2/3 animate-sway-slow" style={{ transform: 'translateY(160%)', animationDelay: '0.5s' }}>
            <FlowerSVG color={fusionCombo ? fusionCombo.environmentTint.replace(/[\d.]+\)$/, '1)') : '#FF69B4'} size={22} dark={isNight} />
          </div>
        </>
      )}

      <div className="absolute bottom-1/4 left-1/5" style={{ transform: 'translateY(250%)' }}>
        <MushroomSVG size={35} fusionType={primaryFusion} dark={isNight} />
      </div>
      <div className="absolute bottom-1/3 right-1/5" style={{ transform: 'translateY(220%)' }}>
        <MushroomSVG size={28} fusionType={primaryFusion} dark={isNight} />
      </div>
    </div>
  );
};

const generateWeatherParticles = (weather: WeatherType) => {
  const particles: { x: number; duration: number; delay: number; offset: number; size: number }[] = [];
  const count = weather === 'rainy' ? 80 : weather === 'snowy' ? 50 : 0;
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * 100,
      duration: weather === 'rainy' ? 0.6 + Math.random() * 0.4 : 4 + Math.random() * 4,
      delay: Math.random() * 5,
      offset: Math.random() * 30,
      size: 12 + Math.random() * 10,
    });
  }
  return particles;
};

const generateStars = (count: number) => {
  const stars: { x: number; y: number; size: number; delay: number }[] = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * 100,
      y: Math.random() * 50,
      size: 1 + Math.random() * 3,
      delay: Math.random() * 3,
    });
  }
  return stars;
};

const generateFireflies = (count: number) => {
  const fireflies: { x: number; y: number; delay: number }[] = [];
  for (let i = 0; i < count; i++) {
    fireflies.push({
      x: 15 + Math.random() * 70,
      y: 30 + Math.random() * 45,
      delay: Math.random() * 4,
    });
  }
  return fireflies;
};

const getFusionSkyGradient = (type: FusionType): string => {
  switch (type) {
    case 'mechanical_fox':
      return 'linear-gradient(180deg, #A8B8D0 0%, #C8D0E0 40%, #D8E0F0 100%)';
    case 'lying_dolphin':
      return 'linear-gradient(180deg, #FFD89B 0%, #FFE8C8 40%, #FFF5E6 100%)';
    case 'flame_cat':
      return 'linear-gradient(180deg, #FF8C60 0%, #FFB090 40%, #FFD8C0 100%)';
    case 'crystal_owl':
      return 'linear-gradient(180deg, #4A3070 0%, #7060A0 40%, #9888C0 100%)';
    case 'rainbow_deer':
      return 'linear-gradient(180deg, #C8A0FF 0%, #E0C0FF 40%, #F0E0FF 100%)';
    default:
      return 'linear-gradient(180deg, #87CEEB 0%, #B0E0E6 40%, #E0F7FA 100%)';
  }
};

const getFusionGrassColor = (type: FusionType): string => {
  switch (type) {
    case 'mechanical_fox': return '#90A8B8';
    case 'lying_dolphin': return '#C8D890';
    case 'flame_cat': return '#C8A060';
    case 'crystal_owl': return '#6878A8';
    case 'rainbow_deer': return '#A0C8A0';
    default: return '#90EE90';
  }
};

const getFusionGrassSecondary = (type: FusionType): string => {
  switch (type) {
    case 'mechanical_fox': return '#A8C0D0';
    case 'lying_dolphin': return '#D8E8A0';
    case 'flame_cat': return '#D8B878';
    case 'crystal_owl': return '#8090B8';
    case 'rainbow_deer': return '#B8D8B8';
    default: return '#98FB98';
  }
};

const getFusionWaterColor = (type: FusionType): string => {
  switch (type) {
    case 'mechanical_fox': return '#90A8D0';
    case 'lying_dolphin': return '#90D8D0';
    case 'flame_cat': return '#D09070';
    case 'crystal_owl': return '#7060A0';
    case 'rainbow_deer': return '#B090D0';
    default: return '#87CEEB';
  }
};

const CloudSVG: React.FC<{ size?: number; tint?: string; dark?: boolean }> = ({ size = 60, tint, dark = false }) => (
  <svg width={size} height={size * 0.6} viewBox="0 0 100 60" className="drop-shadow-md">
    <ellipse cx="30" cy="40" rx="25" ry="18" fill={dark ? '#4A5568' : 'white'} opacity="0.9" />
    <ellipse cx="55" cy="35" rx="30" ry="22" fill={dark ? '#4A5568' : 'white'} opacity="0.9" />
    <ellipse cx="75" cy="42" rx="22" ry="16" fill={dark ? '#4A5568' : 'white'} opacity="0.9" />
    <ellipse cx="45" cy="25" rx="20" ry="18" fill={dark ? '#4A5568' : 'white'} opacity="0.9" />
    {tint && <ellipse cx="50" cy="35" rx="40" ry="25" fill={tint} opacity="0.3" />}
  </svg>
);

const TreeSVG: React.FC<{ size?: number; fusionType?: FusionType | null; islandType?: IslandType; dark?: boolean }> = ({ size = 100, fusionType, islandType = 'home', dark = false }) => {
  const trunkColor = islandType === 'night' ? '#3D2817' :
    fusionType === 'mechanical_fox' ? '#888' :
    fusionType === 'crystal_owl' ? '#6A3D9A' :
    fusionType === 'flame_cat' ? '#A0522D' : '#8B4513';
  const leafColor = islandType === 'night' ? '#1A3A2A' :
    fusionType === 'mechanical_fox' ? '#A0B8C8' :
    fusionType === 'crystal_owl' ? '#9B7EBD' :
    fusionType === 'flame_cat' ? '#FF6B35' :
    fusionType === 'rainbow_deer' ? '#B8A0D2' :
    fusionType === 'lying_dolphin' ? '#C8D890' : '#228B22';
  const leafHighlight = islandType === 'night' ? '#2A4A3A' :
    fusionType === 'mechanical_fox' ? '#C0D0E0' :
    fusionType === 'crystal_owl' ? '#B8A0D2' :
    fusionType === 'flame_cat' ? '#FF8C42' :
    fusionType === 'rainbow_deer' ? '#D0B0F0' :
    fusionType === 'lying_dolphin' ? '#E0F0A0' : '#32CD32';

  const animationClass = islandType === 'antigravity' ? 'animate-anti-gravity-rotate' : 'animate-sway-slow';

  return (
    <svg width={size} height={size * 1.4} viewBox="0 0 100 140" className={animationClass} style={{ transformOrigin: 'bottom center' }}>
      <rect x="42" y="80" width="16" height="55" fill={trunkColor} rx="3" />
      <rect x="45" y="85" width="4" height="50" fill={trunkColor} opacity={dark ? 0.3 : 0.5} />
      <ellipse cx="50" cy="50" rx="40" ry="45" fill={leafColor} />
      <ellipse cx="35" cy="40" rx="25" ry="30" fill={leafHighlight} />
      <ellipse cx="65" cy="45" rx="28" ry="32" fill={leafColor} opacity="0.8" />
      <ellipse cx="50" cy="30" rx="22" ry="25" fill={leafHighlight} opacity="0.6" />
      <ellipse cx="40" cy="35" rx="8" ry="10" fill="white" opacity={dark ? 0.05 : 0.2} />
    </svg>
  );
};

const FlowerSVG: React.FC<{ color?: string; size?: number; dark?: boolean }> = ({ color = '#FFB6C1', size = 30, dark = false }) => (
  <svg width={size} height={size * 1.5} viewBox="0 0 40 60" style={{ filter: dark ? 'brightness(0.5)' : 'none' }}>
    <path d="M20,60 Q18,40 20,25" stroke={dark ? '#1A3A1A' : '#228B22'} strokeWidth="2" fill="none" />
    <ellipse cx="12" cy="45" rx="8" ry="4" fill={dark ? '#1A4A1A' : '#32CD32'} transform="rotate(-30 12 45)" />
    <circle cx="20" cy="15" r="8" fill={color} />
    <circle cx="12" cy="20" r="7" fill={color} />
    <circle cx="28" cy="20" r="7" fill={color} />
    <circle cx="15" cy="10" r="6" fill={color} />
    <circle cx="25" cy="10" r="6" fill={color} />
    <circle cx="20" cy="17" r="5" fill={dark ? '#B8860B' : '#FFD700'} />
    <circle cx="20" cy="17" r="3" fill={dark ? '#8B6914' : '#FFA500'} opacity="0.6" />
  </svg>
);

const MushroomSVG: React.FC<{ size?: number; fusionType?: FusionType | null; dark?: boolean }> = ({ size = 30, fusionType, dark = false }) => {
  const capColor = dark ? '#5A1A1A' :
    fusionType === 'mechanical_fox' ? '#4488AA' :
    fusionType === 'crystal_owl' ? '#7B5EA7' :
    fusionType === 'flame_cat' ? '#FF6347' :
    fusionType === 'rainbow_deer' ? '#9B59B6' :
    fusionType === 'lying_dolphin' ? '#6BCB77' : '#DC143C';
  const capHighlight = dark ? '#7A2A2A' :
    fusionType === 'mechanical_fox' ? '#66AACC' :
    fusionType === 'crystal_owl' ? '#9B7EBD' :
    fusionType === 'flame_cat' ? '#FF8C42' :
    fusionType === 'rainbow_deer' ? '#B8A0D2' :
    fusionType === 'lying_dolphin' ? '#90E090' : '#FF6347';

  return (
    <svg width={size} height={size * 1.2} viewBox="0 0 50 60" style={{ filter: dark ? 'brightness(0.6)' : 'none' }}>
      <ellipse cx="25" cy="45" rx="10" ry="15" fill={dark ? '#D8CFB0' : '#FFF8DC'} />
      <ellipse cx="22" cy="42" rx="3" ry="10" fill={dark ? '#C8BFA0' : '#FAEBD7'} opacity="0.6" />
      <ellipse cx="25" cy="25" rx="22" ry="18" fill={capColor} />
      <ellipse cx="25" cy="22" rx="18" ry="12" fill={capHighlight} opacity="0.5" />
      <circle cx="15" cy="20" r="4" fill="white" opacity="0.9" />
      <circle cx="30" cy="25" r="3" fill="white" opacity="0.9" />
      <circle cx="22" cy="30" r="3" fill="white" opacity="0.7" />
    </svg>
  );
};

export default IslandBackground;
