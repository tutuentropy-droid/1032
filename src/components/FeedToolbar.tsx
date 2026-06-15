import React from 'react';
import { FoodType, FOOD_INFO } from '@/types/game';
import { useGameStore } from '@/store/gameStore';

const FeedToolbar: React.FC = () => {
  const { selectedFood, setSelectedFood } = useGameStore();

  const foods: FoodType[] = ['carrot', 'apple', 'fish', 'honey'];

  const handleFoodClick = (food: FoodType) => {
    if (selectedFood === food) {
      setSelectedFood(null);
    } else {
      setSelectedFood(food);
    }
  };

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
      <div
        className="bg-white/70 backdrop-blur-md rounded-3xl px-6 py-4 shadow-lg
          border-2 border-white/50"
      >
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600 font-bold mr-2">喂食：</span>
          {foods.map((food) => {
            const info = FOOD_INFO[food];
            const isSelected = selectedFood === food;
            return (
              <button
                key={food}
                onClick={() => handleFoodClick(food)}
                className={`relative w-14 h-14 rounded-2xl flex items-center justify-center
                  text-3xl transition-all duration-200 ease-out
                  ${isSelected
                    ? 'bg-yellow-200 scale-110 shadow-lg -translate-y-1'
                    : 'bg-white/80 hover:bg-white hover:scale-105 hover:-translate-y-0.5'
                  }
                  border-2 ${isSelected ? 'border-yellow-400' : 'border-gray-200'}
                `}
                title={info.name}
              >
                <span className={isSelected ? 'animate-bounce-gentle' : ''}>
                  {info.emoji}
                </span>
                {isSelected && (
                  <div className="absolute -top-2 -right-2 w-5 h-5 bg-green-400 
                    rounded-full border-2 border-white flex items-center justify-center
                    animate-pop-in">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
        {selectedFood && (
          <p className="text-center text-sm text-gray-500 mt-2 animate-pop-in">
            已选择 <span className="font-bold text-yellow-600">{FOOD_INFO[selectedFood].name}</span>，
            点击小动物投喂吧~
          </p>
        )}
      </div>
    </div>
  );
};

export default FeedToolbar;
