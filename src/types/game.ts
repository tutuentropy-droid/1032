export type AnimalType = 'rabbit' | 'hedgehog' | 'bear' | 'turtle' | 'dog';
export type EmotionType = 'happy' | 'angry' | 'sleepy' | 'calm' | 'anxious' | 'excited';
export type AnimationState = 'idle' | 'walking' | 'eating' | 'reacting' | 'scared' | 'glowing';
export type FoodType = 'carrot' | 'apple' | 'fish' | 'honey';
export type ParticleType = 'heart' | 'star' | 'sparkle' | 'zzz' | 'exclamation' | 'sweat' | 'light';
export type MiniGameType = 'push_time_ball' | 'find_key' | 'catch_carrot' | 'memory_match' | 'catch_frisbee';
export type MiniGameStatus = 'idle' | 'playing' | 'success' | 'failed';
export type FusionType = 'mechanical_fox' | 'lying_dolphin' | 'flame_cat' | 'crystal_owl' | 'rainbow_deer';

export interface FusedAnimal {
  id: string;
  fusionType: FusionType;
  animalIds: [string, string];
  position: Position;
  createdAt: number;
  direction: 'left' | 'right';
  scale: number;
}

export interface FusionCombo {
  type: FusionType;
  emotion1: EmotionType;
  emotion2: EmotionType;
  name: string;
  description: string;
  emoji: string;
  environmentTint: string;
  environmentGlow: string;
  particles: ParticleType[];
}

export const FUSION_COMBOS: FusionCombo[] = [
  {
    type: 'mechanical_fox',
    emotion1: 'anxious',
    emotion2: 'calm',
    name: '机械狐狸',
    description: '焦虑与克制的融合产物，手持放大镜审视一切细节',
    emoji: '🔍',
    environmentTint: 'rgba(180, 180, 200, 0.15)',
    environmentGlow: 'rgba(100, 150, 255, 0.3)',
    particles: ['sparkle', 'light'],
  },
  {
    type: 'lying_dolphin',
    emotion1: 'happy',
    emotion2: 'sleepy',
    name: '躺平海豚',
    description: '快乐与拖延的融合产物，只想躺平享受生活',
    emoji: '🐬',
    environmentTint: 'rgba(255, 200, 150, 0.15)',
    environmentGlow: 'rgba(255, 180, 100, 0.3)',
    particles: ['heart', 'zzz'],
  },
  {
    type: 'flame_cat',
    emotion1: 'angry',
    emotion2: 'excited',
    name: '火焰猫',
    description: '愤怒与兴奋的融合产物，浑身燃烧着战斗的烈焰',
    emoji: '🔥',
    environmentTint: 'rgba(255, 100, 50, 0.15)',
    environmentGlow: 'rgba(255, 80, 30, 0.3)',
    particles: ['light', 'star'],
  },
  {
    type: 'crystal_owl',
    emotion1: 'anxious',
    emotion2: 'sleepy',
    name: '水晶猫头鹰',
    description: '焦虑与疲惫的融合产物，在深夜中凝视你的灵魂',
    emoji: '🦉',
    environmentTint: 'rgba(150, 130, 200, 0.2)',
    environmentGlow: 'rgba(120, 80, 200, 0.35)',
    particles: ['sparkle', 'star'],
  },
  {
    type: 'rainbow_deer',
    emotion1: 'calm',
    emotion2: 'excited',
    name: '彩虹鹿',
    description: '平静与兴奋的融合产物，散发着绚丽的七彩光芒',
    emoji: '🦌',
    environmentTint: 'rgba(200, 150, 255, 0.12)',
    environmentGlow: 'rgba(180, 100, 255, 0.25)',
    particles: ['heart', 'sparkle', 'light'],
  },
];

export const FUSION_NEGLECT_THRESHOLD = 30000;
export const FUSION_PROXIMITY_THRESHOLD = 25;

export type MiniGameResult = 'success' | 'failed' | null;

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
  activeMiniGame: {
    animalId: string;
    gameType: MiniGameType;
    status: MiniGameStatus;
    score: number;
    timeLeft: number;
  } | null;
  fusedAnimals: FusedAnimal[];
  fusionAnimation: {
    type: FusionType;
    position: Position;
    startedAt: number;
  } | null;
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
  startMiniGame: (animalId: string, gameType: MiniGameType) => void;
  endMiniGame: (result: MiniGameResult) => void;
  clearMiniGame: () => void;
  updateMiniGameScore: (score: number) => void;
  setMiniGameTimeLeft: (time: number) => void;
  createFusion: (animal1Id: string, animal2Id: string, fusionType: FusionType) => void;
  removeFusion: (fusedAnimalId: string) => void;
  checkAndTriggerFusion: () => void;
  clearFusionAnimation: () => void;
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

export interface MiniGameInfo {
  type: MiniGameType;
  name: string;
  description: string;
  duration: number;
  animalType: AnimalType;
  targetEmotion: EmotionType;
  icon: string;
}

export const ANIMAL_MINI_GAMES: Record<AnimalType, MiniGameInfo> = {
  bear: {
    type: 'push_time_ball',
    name: '推回时间球',
    description: '帮拖延的熊熊把滚走的时间球推回来！',
    duration: 30,
    animalType: 'bear',
    targetEmotion: 'calm',
    icon: '⏰',
  },
  hedgehog: {
    type: 'find_key',
    name: '寻找钥匙',
    description: '帮焦虑的刺刺找到丢掉的钥匙！',
    duration: 25,
    animalType: 'hedgehog',
    targetEmotion: 'calm',
    icon: '🔑',
  },
  rabbit: {
    type: 'catch_carrot',
    name: '接胡萝卜',
    description: '帮兔兔接住掉下来的胡萝卜！',
    duration: 30,
    animalType: 'rabbit',
    targetEmotion: 'happy',
    icon: '🥕',
  },
  turtle: {
    type: 'memory_match',
    name: '记忆配对',
    description: '和慢慢一起玩记忆翻牌游戏！',
    duration: 45,
    animalType: 'turtle',
    targetEmotion: 'calm',
    icon: '🃏',
  },
  dog: {
    type: 'catch_frisbee',
    name: '接飞盘',
    description: '和汪汪一起玩接飞盘游戏！',
    duration: 30,
    animalType: 'dog',
    targetEmotion: 'excited',
    icon: '🥏',
  },
};
