export type AnimalType = 'rabbit' | 'hedgehog' | 'bear' | 'turtle' | 'dog';
export type EmotionType = 'happy' | 'angry' | 'sleepy' | 'calm' | 'anxious' | 'excited';
export type AnimationState = 'idle' | 'walking' | 'eating' | 'reacting' | 'scared' | 'glowing';
export type FoodType = 'carrot' | 'apple' | 'fish' | 'honey';
export type ParticleType = 'heart' | 'star' | 'sparkle' | 'zzz' | 'exclamation' | 'sweat' | 'light';

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
  emotionRadius: number;
  emotionStrength: number;
  moveSpeed: number;
  lastEmotionChange: number;
}

export interface Particle {
  id: string;
  type: ParticleType;
  x: number;
  y: number;
  createdAt: number;
  duration?: number;
  scale?: number;
  opacity?: number;
}

export interface EmotionInfluence {
  fromEmotion: EmotionType;
  toEmotion: EmotionType;
  targetTypes: AnimalType[];
  minDistance: number;
  probability: number;
}

export type BehaviorStatus = 'success' | 'failure' | 'running';

export type BehaviorNodeType =
  | 'selector'
  | 'sequence'
  | 'inverter'
  | 'check_emotion'
  | 'check_nearby_emotion'
  | 'check_hunger'
  | 'check_happiness'
  | 'random_chance'
  | 'set_emotion'
  | 'move_random'
  | 'move_away_from'
  | 'move_towards'
  | 'add_particle'
  | 'wait'
  | 'set_animation';

export interface BehaviorNode {
  id: string;
  type: BehaviorNodeType;
  children?: BehaviorNode[];
  params?: Record<string, unknown>;
}

export interface BehaviorContext {
  animalId: string;
  animals: Animal[];
  deltaTime: number;
  currentTime: number;
}

export interface GameState {
  animals: Animal[];
  selectedFood: FoodType | null;
  particles: Particle[];
  timeOfDay: 'day';
  globalBrightness: number;
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
  setGlobalBrightness: (brightness: number) => void;
  updateAnimal: (animalId: string, updates: Partial<Animal>) => void;
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
  turtle: ['apple', 'carrot'],
  dog: ['fish', 'honey'],
};

export const EMOTION_COLORS: Record<EmotionType, string> = {
  happy: '#FFD700',
  angry: '#FF4444',
  sleepy: '#87CEEB',
  calm: '#90EE90',
  anxious: '#DDA0DD',
  excited: '#FFA500',
};

export const EMOTION_INFLUENCES: EmotionInfluence[] = [
  {
    fromEmotion: 'anxious',
    toEmotion: 'anxious',
    targetTypes: ['turtle', 'rabbit'],
    minDistance: 20,
    probability: 0.7,
  },
  {
    fromEmotion: 'angry',
    toEmotion: 'anxious',
    targetTypes: ['turtle', 'rabbit'],
    minDistance: 18,
    probability: 0.6,
  },
  {
    fromEmotion: 'happy',
    toEmotion: 'happy',
    targetTypes: ['rabbit', 'dog', 'turtle'],
    minDistance: 25,
    probability: 0.4,
  },
  {
    fromEmotion: 'excited',
    toEmotion: 'excited',
    targetTypes: ['dog', 'rabbit'],
    minDistance: 22,
    probability: 0.5,
  },
  {
    fromEmotion: 'calm',
    toEmotion: 'calm',
    targetTypes: ['bear', 'turtle', 'hedgehog'],
    minDistance: 20,
    probability: 0.35,
  },
  {
    fromEmotion: 'excited',
    toEmotion: 'angry',
    targetTypes: ['bear', 'hedgehog'],
    minDistance: 15,
    probability: 0.3,
  },
];
