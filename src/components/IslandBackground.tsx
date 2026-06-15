import React from 'react';

const IslandBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* 天空渐变 */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, #87CEEB 0%, #B0E0E6 40%, #E0F7FA 100%)',
        }}
      />

      {/* 太阳 */}
      <div className="absolute top-12 right-20 w-20 h-20 rounded-full bg-yellow-200 opacity-80 animate-breathing-slow"
        style={{
          boxShadow: '0 0 60px 20px rgba(255, 255, 200, 0.5)',
        }}
      >
        <div className="absolute inset-2 rounded-full bg-yellow-100" />
      </div>

      {/* 云朵 */}

      <div className="absolute top-16 left-0 animate-cloud-drift" style={{ animationDuration: '80s' }}>
        <CloudSVG size={80} />
      </div>
      <div className="absolute top-24 left-1/4 animate-cloud-drift-slow" style={{ animationDelay: '-20s' }}>
        <CloudSVG size={60} />
      </div>
      <div className="absolute top-8 right-1/3 animate-cloud-drift" style={{ animationDuration: '100s', animationDelay: '-40s' }}>
        <CloudSVG size={100} />
      </div>
      <div className="absolute top-32 right-1/4 animate-cloud-drift-slow" style={{ animationDelay: '-60s' }}>
        <CloudSVG size={50} />
      </div>

      {/* 远山 */}
      <svg
        className="absolute bottom-1/3 left-0 w-full"
        viewBox="0 0 1200 200"
        preserveAspectRatio="none"
        style={{ height: '25%' }}
      >
        <path
          d="M0,200 L0,120 Q150,60 300,100 T600,40 T900,80 T1200,50 L1200,200 Z"
          fill="#98D8C8"
          opacity="0.6"
        />
        <path
          d="M0,200 L0,150 Q200,100 400,130 T800,90 T1200,120 L1200,200 Z"
          fill="#7EC8B8"
          opacity="0.7"
        />
      </svg>

      {/* 岛屿/草地 */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{ height: '55%' }}
      >
        <svg
          className="w-full h-full"
          viewBox="0 0 1200 500"
          preserveAspectRatio="none"
        >
          {/* 岛屿主体 */}
          <ellipse
            cx="600"
            cy="450"
            rx="700"
            ry="200"
            fill="#90EE90"
          />
          <ellipse
            cx="600"
            cy="430"
            rx="650"
            ry="180"
            fill="#98FB98"
          />

          {/* 沙滩边缘 */}
          <ellipse
            cx="600"
            cy="470"
            rx="680"
            ry="190"
            fill="none"
            stroke="#F5DEB3"
            strokeWidth="15"
            opacity="0.8"
          />

          {/* 草地纹理 */}
          <g opacity="0.3">
            {[...Array(20)].map((_, i) => (
              <path
                key={i}
                d={`M${100 + i * 60},380 Q${110 + i * 60},370 ${105 + i * 60},380`}
                stroke="#228B22"
                strokeWidth="2"
                fill="none"
              />
            ))}
          </g>
        </svg>
      </div>

      {/* 树木 */}
      <div className="absolute bottom-1/4 left-10" style={{ transform: 'translateY(50%)' }}>
        <TreeSVG size={120} />
      </div>
      <div className="absolute bottom-1/3 right-16" style={{ transform: 'translateY(30%)' }}>
        <TreeSVG size={90} />
      </div>
      <div className="absolute bottom-1/4 left-1/3" style={{ transform: 'translateY(60%)' }}>
        <TreeSVG size={70} />
      </div>

      {/* 小池塘 */}
      <div className="absolute bottom-1/4 right-1/4 w-32 h-16" style={{ transform: 'translateY(100%)' }}>
        <svg viewBox="0 0 200 100" className="w-full h-full">
          <ellipse cx="100" cy="50" rx="90" ry="40" fill="#87CEEB" opacity="0.8" />
          <ellipse cx="100" cy="45" rx="80" ry="35" fill="#ADD8E6" opacity="0.6" />
          {/* 水面波纹 */}
          <ellipse cx="100" cy="50" rx="60" ry="25" fill="none" stroke="white" strokeWidth="1.5" opacity="0.5" className="animate-ripple" />
        </svg>
      </div>

      {/* 花朵装饰 */}
      <div className="absolute bottom-1/3 left-1/4 animate-sway" style={{ transform: 'translateY(150%)' }}>
        <FlowerSVG color="#FFB6C1" size={30} />
      </div>
      <div className="absolute bottom-1/3 left-1/2 animate-sway-slow" style={{ transform: 'translateY(180%)' }}>
        <FlowerSVG color="#FFD700" size={25} />
      </div>
      <div className="absolute bottom-1/4 right-1/3 animate-sway" style={{ transform: 'translateY(200%)', animationDelay: '1s' }}>
        <FlowerSVG color="#E6E6FA" size={28} />
      </div>
      <div className="absolute bottom-1/3 left-2/3 animate-sway-slow" style={{ transform: 'translateY(160%)', animationDelay: '0.5s' }}>
        <FlowerSVG color="#FF69B4" size={22} />
      </div>

      {/* 蘑菇 */}
      <div className="absolute bottom-1/4 left-1/5" style={{ transform: 'translateY(250%)' }}>
        <MushroomSVG size={35} />
      </div>
      <div className="absolute bottom-1/3 right-1/5" style={{ transform: 'translateY(220%)' }}>
        <MushroomSVG size={28} />
      </div>
    </div>
  );
};

const CloudSVG: React.FC<{ size?: number }> = ({ size = 60 }) => (
  <svg width={size} height={size * 0.6} viewBox="0 0 100 60" className="drop-shadow-md">
    <ellipse cx="30" cy="40" rx="25" ry="18" fill="white" opacity="0.9" />
    <ellipse cx="55" cy="35" rx="30" ry="22" fill="white" opacity="0.9" />
    <ellipse cx="75" cy="42" rx="22" ry="16" fill="white" opacity="0.9" />
    <ellipse cx="45" cy="25" rx="20" ry="18" fill="white" opacity="0.9" />
  </svg>
);

const TreeSVG: React.FC<{ size?: number }> = ({ size = 100 }) => (
  <svg width={size} height={size * 1.4} viewBox="0 0 100 140" className="animate-sway-slow" style={{ transformOrigin: 'bottom center' }}>
    {/* 树干 */}
    <rect x="42" y="80" width="16" height="55" fill="#8B4513" rx="3" />
    <rect x="45" y="85" width="4" height="50" fill="#A0522D" opacity="0.5" />
    {/* 树冠 */}
    <ellipse cx="50" cy="50" rx="40" ry="45" fill="#228B22" />
    <ellipse cx="35" cy="40" rx="25" ry="30" fill="#32CD32" />
    <ellipse cx="65" cy="45" rx="28" ry="32" fill="#2E8B57" />
    <ellipse cx="50" cy="30" rx="22" ry="25" fill="#3CB371" />
    {/* 高光 */}
    <ellipse cx="40" cy="35" rx="8" ry="10" fill="#90EE90" opacity="0.4" />
  </svg>
);

const FlowerSVG: React.FC<{ color?: string; size?: number }> = ({ color = '#FFB6C1', size = 30 }) => (
  <svg width={size} height={size * 1.5} viewBox="0 0 40 60">
    {/* 花茎 */}
    <path d="M20,60 Q18,40 20,25" stroke="#228B22" strokeWidth="2" fill="none" />
    {/* 叶子 */}
    <ellipse cx="12" cy="45" rx="8" ry="4" fill="#32CD32" transform="rotate(-30 12 45)" />
    {/* 花瓣 */}
    <circle cx="20" cy="15" r="8" fill={color} />
    <circle cx="12" cy="20" r="7" fill={color} />
    <circle cx="28" cy="20" r="7" fill={color} />
    <circle cx="15" cy="10" r="6" fill={color} />
    <circle cx="25" cy="10" r="6" fill={color} />
    {/* 花心 */}
    <circle cx="20" cy="17" r="5" fill="#FFD700" />
    <circle cx="20" cy="17" r="3" fill="#FFA500" opacity="0.6" />
  </svg>
);

const MushroomSVG: React.FC<{ size?: number }> = ({ size = 30 }) => (
  <svg width={size} height={size * 1.2} viewBox="0 0 50 60">
    {/* 蘑菇柄 */}
    <ellipse cx="25" cy="45" rx="10" ry="15" fill="#FFF8DC" />
    <ellipse cx="22" cy="42" rx="3" ry="10" fill="#FAEBD7" opacity="0.6" />
    {/* 蘑菇帽 */}
    <ellipse cx="25" cy="25" rx="22" ry="18" fill="#DC143C" />
    <ellipse cx="25" cy="22" rx="18" ry="12" fill="#FF6347" opacity="0.5" />
    {/* 斑点 */}
    <circle cx="15" cy="20" r="4" fill="white" opacity="0.9" />
    <circle cx="30" cy="25" r="3" fill="white" opacity="0.9" />
    <circle cx="22" cy="30" r="3" fill="white" opacity="0.7" />
  </svg>
);

export default IslandBackground;
