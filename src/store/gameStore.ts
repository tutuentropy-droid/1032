import { create } from 'zustand';
import {
  Animal,
  Particle,
  FoodType,
  EmotionType,
  Position,
  AnimationState,
  GameState,
  GameActions,
  FOOD_INFO,
  ANIMAL_FOOD_PREFERENCES,
} from '@/types/game';

const generateId = () => Math.random().toString(36).substring(2, 9);

const initialAnimals: Animal[] = [
  {
    id: 'rabbit-1',
    name: '兔兔',
    type: 'rabbit',
    emotion: 'happy',
    position: { x: 25, y: 55 },
    targetPosition: null,
    isMoving: false,
    hunger: 30,
    happiness: 70,
    lastFedTime: Date.now(),
    animationState: 'idle',
    direction: 'right',
    scale: 1,
  },
  {
    id: 'hedgehog-1',
    name: '刺刺',
    type: 'hedgehog',
    emotion: 'angry',
    position: { x: 55, y: 60 },
    targetPosition: null,
    isMoving: false,
    hunger: 50,
    happiness: 40,
    lastFedTime: Date.now(),
    animationState: 'idle',
    direction: 'left',
    scale: 0.9,
  },
  {
    id: 'bear-1',
    name: '熊熊',
    type: 'bear',
    emotion: 'sleepy',
    position: { x: 75, y: 50 },
    targetPosition: null,
    isMoving: false,
    hunger: 20,
    happiness: 60,
    lastFedTime: Date.now(),
    animationState: 'idle',
    direction: 'right',
    scale: 1.1,
  },
];

export const useGameStore = create<GameState & GameActions>((set, get) => ({
  animals: initialAnimals,
  selectedFood: null,
  particles: [],
  timeOfDay: 'day',

  setSelectedFood: (food) => set({ selectedFood: food }),

  feedAnimal: (animalId) => {
    const state = get();
    const selectedFood = state.selectedFood;
    if (!selectedFood) return;

    const animal = state.animals.find((a) => a.id === animalId);
    if (!animal) return;

    const foodInfo = FOOD_INFO[selectedFood];
    const preferredFoods = ANIMAL_FOOD_PREFERENCES[animal.type];
    const isPreferred = preferredFoods.includes(selectedFood);

    const happinessBonus = isPreferred ? foodInfo.happiness * 1.5 : foodInfo.happiness * 0.7;
    const newHappiness = Math.min(100, animal.happiness + happinessBonus);
    const newHunger = Math.max(0, animal.hunger - foodInfo.hunger);

    let newEmotion: EmotionType = animal.emotion;
    if (newHappiness > 70) {
      newEmotion = 'happy';
    } else if (newHunger > 70) {
      newEmotion = 'angry';
    } else if (animal.emotion === 'sleepy' && newHappiness < 60) {
      newEmotion = 'sleepy';
    }

    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        get().addParticle({
          type: 'heart',
          x: animal.position.x + (Math.random() - 0.5) * 10,
          y: animal.position.y - 5 + Math.random() * 5,
          duration: 1500 + Math.random() * 500,
        });
      }, i * 100);
    }

    set((state) => ({
      animals: state.animals.map((a) =>
        a.id === animalId
          ? {
              ...a,
              happiness: newHappiness,
              hunger: newHunger,
              emotion: newEmotion,
              lastFedTime: Date.now(),
              animationState: 'eating',
            }
          : a
      ),
      selectedFood: null,
    }));

    setTimeout(() => {
      set((state) => ({
        animals: state.animals.map((a) =>
          a.id === animalId ? { ...a, animationState: 'idle' as AnimationState } : a
        ),
      }));
    }, 1500);
  },

  petAnimal: (animalId) => {
    const state = get();
    const animal = state.animals.find((a) => a.id === animalId);
    if (!animal) return;

    const newHappiness = Math.min(100, animal.happiness + 5);

    let newEmotion: EmotionType = animal.emotion;
    if (animal.emotion === 'angry') {
      if (Math.random() > 0.5) {
        newEmotion = 'happy';
      }
    } else if (newHappiness > 70) {
      newEmotion = 'happy';
    }

    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        get().addParticle({
          type: Math.random() > 0.5 ? 'star' : 'sparkle',
          x: animal.position.x + (Math.random() - 0.5) * 8,
          y: animal.position.y - 3 + Math.random() * 3,
          duration: 1200 + Math.random() * 300,
        });
      }, i * 80);
    }

    set((state) => ({
      animals: state.animals.map((a) =>
        a.id === animalId
          ? {
              ...a,
              happiness: newHappiness,
              emotion: newEmotion,
              animationState: 'reacting',
            }
          : a
      ),
    }));

    setTimeout(() => {
      set((state) => ({
        animals: state.animals.map((a) =>
          a.id === animalId ? { ...a, animationState: 'idle' as AnimationState } : a
        ),
      }));
    }, 800);
  },

  addParticle: (particle) => {
    const newParticle: Particle = {
      ...particle,
      id: generateId(),
      createdAt: Date.now(),
    };
    set((state) => ({
      particles: [...state.particles, newParticle],
    }));

    setTimeout(() => {
      get().removeParticle(newParticle.id);
    }, particle.duration || 2000);
  },

  removeParticle: (id) => {
    set((state) => ({
      particles: state.particles.filter((p) => p.id !== id),
    }));
  },

  updateAnimalPosition: (animalId, position) => {
    set((state) => ({
      animals: state.animals.map((a) =>
        a.id === animalId ? { ...a, position } : a
      ),
    }));
  },

  updateAnimalEmotion: (animalId, emotion) => {
    set((state) => ({
      animals: state.animals.map((a) =>
        a.id === animalId ? { ...a, emotion } : a
      ),
    }));
  },

  setAnimalMoving: (animalId, isMoving, target) => {
    set((state) => ({
      animals: state.animals.map((a) => {
        if (a.id !== animalId) return a;
        const newDirection =
          target && target.x < a.position.x ? 'left' : target && target.x > a.position.x ? 'right' : a.direction;
        return {
          ...a,
          isMoving,
          targetPosition: target || null,
          animationState: isMoving ? 'walking' : 'idle',
          direction: newDirection,
        };
      }),
    }));
  },

  setAnimationState: (animalId, state) => {
    set((s) => ({
      animals: s.animals.map((a) =>
        a.id === animalId ? { ...a, animationState: state } : a
      ),
    }));
  },
}));
