export type AnimalType = 'rabbit' | 'hedgehog' | 'bear' | 'turtle' | 'dog';
export type EmotionType = 'happy' | 'angry' | 'sleepy' | 'calm' | 'anxious' | 'excited';
export type AnimationState = 'idle' | 'walking' | 'eating' | 'reacting' | 'scared' | 'glowing' | 'sleepwalking' | 'floating';
export type FoodType = 'carrot' | 'apple' | 'fish' | 'honey';
export type ParticleType = 'heart' | 'star' | 'sparkle' | 'zzz' | 'exclamation' | 'sweat' | 'light' | 'raindrop' | 'snowflake' | 'bubble' | 'firefly';
export type MiniGameType = 'push_time_ball' | 'find_key' | 'catch_carrot' | 'memory_match' | 'catch_frisbee';
export type MiniGameStatus = 'idle' | 'playing' | 'success' | 'failed';
export type FusionType = 'mechanical_fox' | 'lying_dolphin' | 'flame_cat' | 'crystal_owl' | 'rainbow_deer';
export type IslandType = 'home' | 'rainy' | 'night' | 'antigravity' | 'dream' | 'slowtime';
export type WeatherType = 'sunny' | 'rainy' | 'snowy' | 'foggy' | 'starry';
export type TimeOfDay = 'dawn' | 'day' | 'dusk' | 'night';

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
  currentIsland: IslandType;
  weather: WeatherType;
  timeOfDay: TimeOfDay;
  globalBrightness: number;
  isTransitioning: boolean;
  targetIsland: IslandType | null;
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
  travelToIsland: (island: IslandType) => void;
  setWeather: (weather: WeatherType) => void;
  setTimeOfDay: (time: TimeOfDay) => void;
  advanceTimeOfDay: () => void;
  completeIslandTransition: () => void;
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

export interface IslandInfo {
  type: IslandType;
  name: string;
  description: string;
  icon: string;
  defaultWeather: WeatherType;
  defaultTimeOfDay: TimeOfDay;
  skyGradient: string;
  grassColor: string;
  grassSecondary: string;
  waterColor: string;
  specialRule: string;
  timeScale: number;
  hasSleepwalking: boolean;
  hasAntiGravity: boolean;
}

export const ISLAND_INFO: Record<IslandType, IslandInfo> = {
  home: {
    type: 'home',
    name: '初心岛',
    description: '温暖阳光的起始之岛，一切冒险从这里开始',
    icon: '🏝️',
    defaultWeather: 'sunny',
    defaultTimeOfDay: 'day',
    skyGradient: 'linear-gradient(180deg, #87CEEB 0%, #B0E0E6 40%, #E0F7FA 100%)',
    grassColor: '#90EE90',
    grassSecondary: '#98FB98',
    waterColor: '#87CEEB',
    specialRule: 'normal',
    timeScale: 1,
    hasSleepwalking: false,
    hasAntiGravity: false,
  },
  rainy: {
    type: 'rainy',
    name: '细雨岛',
    description: '绵绵细雨的宁静之岛，雨滴在水面弹奏温柔的乐章',
    icon: '🌧️',
    defaultWeather: 'rainy',
    defaultTimeOfDay: 'day',
    skyGradient: 'linear-gradient(180deg, #6B7B8C 0%, #8B9BAB 40%, #A0B0C0 100%)',
    grassColor: '#6B8E6B',
    grassSecondary: '#7BA07B',
    waterColor: '#5B8AA0',
    specialRule: 'rainy',
    timeScale: 1,
    hasSleepwalking: false,
    hasAntiGravity: false,
  },
  night: {
    type: 'night',
    name: '星夜岛',
    description: '繁星点点的神秘之岛，萤火虫在空中翩翩起舞',
    icon: '🌙',
    defaultWeather: 'starry',
    defaultTimeOfDay: 'night',
    skyGradient: 'linear-gradient(180deg, #0D1B2A 0%, #1B263B 40%, #2C3E50 100%)',
    grassColor: '#2D4A3E',
    grassSecondary: '#3D5A4E',
    waterColor: '#1A3A5C',
    specialRule: 'night',
    timeScale: 1,
    hasSleepwalking: false,
    hasAntiGravity: false,
  },
  antigravity: {
    type: 'antigravity',
    name: '浮空岛',
    description: '反重力的奇幻之岛，所有东西都漂浮在半空中',
    icon: '🪐',
    defaultWeather: 'sunny',
    defaultTimeOfDay: 'day',
    skyGradient: 'linear-gradient(180deg, #9B59B6 0%, #8E44AD 40%, #C39BD3 100%)',
    grassColor: '#7D6699',
    grassSecondary: '#9B7FBB',
    waterColor: '#BB8FCE',
    specialRule: 'antigravity',
    timeScale: 1,
    hasSleepwalking: false,
    hasAntiGravity: true,
  },
  dream: {
    type: 'dream',
    name: '梦境岛',
    description: '如梦似幻的梦游之岛，动物们在睡梦中悠然漫步',
    icon: '💭',
    defaultWeather: 'foggy',
    defaultTimeOfDay: 'dusk',
    skyGradient: 'linear-gradient(180deg, #4A3070 0%, #7060A0 40%, #B0A0D0 100%)',
    grassColor: '#6A5A8A',
    grassSecondary: '#8A7AAA',
    waterColor: '#7A6AAA',
    specialRule: 'dream',
    timeScale: 0.8,
    hasSleepwalking: true,
    hasAntiGravity: false,
  },
  slowtime: {
    type: 'slowtime',
    name: '悠缓岛',
    description: '时间流速变慢的悠闲之岛，一切都慢慢发生',
    icon: '⏳',
    defaultWeather: 'sunny',
    defaultTimeOfDay: 'dawn',
    skyGradient: 'linear-gradient(180deg, #F39C12 0%, #E67E22 40%, #F5B041 100%)',
    grassColor: '#B8A060',
    grassSecondary: '#D8C080',
    waterColor: '#D4AC6E',
    specialRule: 'slowtime',
    timeScale: 0.4,
    hasSleepwalking: false,
    hasAntiGravity: false,
  },
};

export const TIME_OF_DAY_CONFIG: Record<TimeOfDay, { brightness: number; overlay: string; sunMoonOpacity: number; name: string }> = {
  dawn: { brightness: 0.95, overlay: 'rgba(255, 180, 100, 0.1)', sunMoonOpacity: 0.9, name: '清晨' },
  day: { brightness: 1, overlay: 'transparent', sunMoonOpacity: 1, name: '白天' },
  dusk: { brightness: 0.9, overlay: 'rgba(255, 100, 50, 0.12)', sunMoonOpacity: 0.8, name: '黄昏' },
  night: { brightness: 0.55, overlay: 'rgba(20, 30, 60, 0.35)', sunMoonOpacity: 0.95, name: '夜晚' },
};
