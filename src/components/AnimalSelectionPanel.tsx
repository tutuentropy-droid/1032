import React from 'react';
import { useGameStore } from '@/store/gameStore';
import { FormationType, EMOTION_COLORS } from '@/types/game';
import AnimalSprite from './AnimalSprite';

const FORMATION_INFO: Record<FormationType, { name: string; icon: string; description: string }> = {
  single_file: { name: '单列纵队', icon: '🚶🚶🚶', description: '动物们排成一队跟在你身后' },
  side_by_side: { name: '并肩同行', icon: '👫🐕', description: '动物们在你左右两侧并肩走' },
  triangle: { name: '三角阵型', icon: '🔺', description: '动物们组成三角形跟随' },
  loose: { name: '自由散漫', icon: '✨', description: '动物们随意跟在周围' },
};

const AnimalSelectionPanel: React.FC = () => {
  const {
    animals,
    fusedAnimals,
    selectedWalkingAnimals,
    currentFormation,
    setFormation,
    startWalking,
    toggleWalkingMode,
    checkWalkingCombination,
  } = useGameStore();

  const availableAnimals = animals.filter((animal) => {
    if (animal.isDragged) return false;
    const isFused = fusedAnimals.some((f) => f.animalIds.includes(animal.id));
    return !isFused;
  });

  const potentialCombination = checkWalkingCombination();

  const handleAnimalClick = (animalId: string) => {
    const { toggleAnimalForWalk } = useGameStore.getState();
    toggleAnimalForWalk(animalId);
  };

  const handleStartWalking = () => {
    if (selectedWalkingAnimals.length > 0) {
      startWalking();
    }
  };

  return (
    <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-30 w-[90%] max-w-2xl">
      <div className="bg-white/95 backdrop-blur-md rounded-3xl p-5 shadow-2xl border-2 border-pink-200 animate-popIn">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <span className="text-2xl">🚶</span>
            选择散步伙伴
            <span className="text-sm font-normal text-gray-500">
              (已选 {selectedWalkingAnimals.length}/3)
            </span>
          </h3>
          <button
            onClick={toggleWalkingMode}
            className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>

        <p className="text-sm text-gray-500 mb-4">
          选择 1~3 只动物和你一起散步吧~ 不同的组合会有特殊效果哦！
        </p>

        {potentialCombination && (
          <div className="mb-4 p-3 bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl border-2 border-pink-300 animate-bounce-gentle">
            <div className="flex items-center gap-2">
              <span className="text-xl">✨</span>
              <div>
                <div className="font-bold text-pink-700">{potentialCombination.name}</div>
                <div className="text-xs text-pink-600">{potentialCombination.description}</div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-5 gap-2 mb-4">
          {availableAnimals.map((animal) => {
            const isSelected = selectedWalkingAnimals.includes(animal.id);
            return (
              <button
                key={animal.id}
                onClick={() => handleAnimalClick(animal.id)}
                className={`relative aspect-square rounded-2xl p-1 transition-all duration-200
                  ${isSelected
                    ? 'bg-gradient-to-br from-pink-200 to-purple-200 scale-110 shadow-lg ring-2 ring-pink-400'
                    : 'bg-gray-100 hover:bg-gray-200 hover:scale-105'
                  }
                  ${selectedWalkingAnimals.length >= 3 && !isSelected ? 'opacity-50 cursor-not-allowed' : ''}
                `}
                disabled={selectedWalkingAnimals.length >= 3 && !isSelected}
                title={animal.name}
              >
                <div className="w-full h-full flex items-center justify-center">
                  <AnimalSprite
                    type={animal.type}
                    emotion={animal.emotion}
                    animationState="idle"
                    direction="right"
                    size={55}
                  />
                </div>
                <div
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-md"
                  style={{
                    background: isSelected ? EMOTION_COLORS[animal.emotion] : '#9CA3AF',
                  }}
                >
                  {isSelected ? '✓' : animal.emotion.charAt(0)}
                </div>
                <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-gray-600 font-medium whitespace-nowrap">
                  {animal.name}
                </div>
              </button>
            );
          })}
        </div>

        <div className="mb-4">
          <div className="text-sm font-bold text-gray-700 mb-2">选择队形：</div>
          <div className="grid grid-cols-4 gap-2">
            {(Object.keys(FORMATION_INFO) as FormationType[]).map((formation) => {
              const info = FORMATION_INFO[formation];
              const isSelected = currentFormation === formation;
              return (
                <button
                  key={formation}
                  onClick={() => setFormation(formation)}
                  className={`p-2 rounded-xl transition-all duration-200 text-center
                    ${isSelected
                      ? 'bg-gradient-to-br from-blue-200 to-cyan-200 ring-2 ring-blue-400 shadow-md'
                      : 'bg-gray-100 hover:bg-gray-200'
                    }
                  `}
                  title={info.description}
                >
                  <div className="text-lg mb-1">{info.icon}</div>
                  <div className="text-[10px] font-medium text-gray-700">{info.name}</div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="text-xs text-gray-400 mb-3">
          💡 小贴士：试试这些组合 → 快乐狗+焦虑刺猬、快乐兔+淡定龟、嗜睡熊+兴奋狗
        </div>

        <div className="flex gap-2">
          <button
            onClick={toggleWalkingMode}
            className="flex-1 py-3 rounded-2xl bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleStartWalking}
            disabled={selectedWalkingAnimals.length === 0}
            className={`flex-2 py-3 px-8 rounded-2xl font-bold transition-all duration-200
              ${selectedWalkingAnimals.length > 0
                ? 'bg-gradient-to-r from-pink-400 to-purple-500 text-white hover:scale-105 shadow-lg hover:shadow-xl'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }
            `}
          >
            🚶 出发散步！({selectedWalkingAnimals.length})
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnimalSelectionPanel;
