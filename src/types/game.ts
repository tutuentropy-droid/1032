export type AnimalType = 'rabbit' | 'hedgehog' | 'bear';
export type EmotionType = 'happy' | 'angry' | 'sleepy';
export type AnimationState = 'idle' | 'walking' | 'eating' | 'reacting';
export type FoodType = 'carrot' | 'apple' | 'fish' | 'honey';
export type ParticleType = 'heart' | 'star' | 'sparkle' | 'zzz';

export interface Position {
  x: number;
  y: number;
}

export interface Animal {
  id: string;
  name: string;
  type: AnimalType;
  emotion: EmotionType;
  position: Position;
  targetPosition: Position | null;
  isMoving: boolean;
  hunger: number;
  happiness: number;
  lastFedTime: number;
  animationState: AnimationState;
  direction: 'left' | 'right';
  scale: number;
}

export interface Particle {
  id: string;
  type: ParticleType;
  x: number;
  y: number;
  createdAt: number;
  duration?: number;
}

export interface GameState {
  animals: Animal[];
  selectedFood: FoodType | null;
  particles: Particle[];
  timeOfDay: 'day';
}

export interface GameActions {
  setSelectedFood: (food: FoodType | null) => void;
  feedAnimal: (animalId: string) => void;
  petAnimal: (animalId: string) => void;
  addParticle: (particle: Omit<Particle, 'id' | 'createdAt'>) => void;
  removeParticle: (id: string) => void;
  updateAnimalPosition: (animalId: string, position: Position) => void;
  updateAnimalEmotion: (animalId: string, emotion: EmotionType) => void;
  setAnimalMoving: (animalId: string, isMoving: boolean, target?: Position) => void;
  setAnimationState: (animalId: string, state: AnimationState) => void;
}

export const FOOD_INFO: Record<FoodType, { name: string; emoji: string; happiness: number; hunger: number }> = {
  carrot: { name: '胡萝卜', emoji: '🥕', happiness: 15, hunger: 20 },
  apple: { name: '苹果', emoji: '🍎', happiness: 10, hunger: 25 },
  fish: { name: '小鱼', emoji: '🐟', happiness: 20, hunger: 30 },
  honey: { name: '蜂蜜', emoji: '🍯', happiness: 25, hunger: 15 },
};

export const ANIMAL_FOOD_PREFERENCES: Record<AnimalType, FoodType[]> = {
  rabbit: ['carrot', 'apple'],
  hedgehog: ['apple', 'fish'],
  bear: ['fish', 'honey'],
};
