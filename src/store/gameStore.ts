import { create } from 'zustand';
import {
  Animal,
  Particle,
  EmotionType,
  AnimationState,
  GameState,
  GameActions,
  FOOD_INFO,
  ANIMAL_FOOD_PREFERENCES,
  ANIMAL_MINI_GAMES,
  MiniGameResult,
  FUSION_COMBOS,
  FUSION_NEGLECT_THRESHOLD,
  FUSION_PROXIMITY_THRESHOLD,
  FusedAnimal,
  IslandType,
  WeatherType,
  TimeOfDay,
  ISLAND_INFO,
  TIME_OF_DAY_CONFIG,
} from '@/types/game';

const generateId = () => Math.random().toString(36).substring(2, 9);

const initialAnimals: Animal[] = [
  {
    id: 'rabbit-1',
    name: '兔兔',
    type: 'rabbit',
    emotion: 'happy',
    position: { x: 22, y: 58 },
    targetPosition: null,
    isMoving: false,
    hunger: 30,
    happiness: 75,
    lastFedTime: Date.now(),
    animationState: 'idle',
    direction: 'right',
    scale: 1,
    emotionRadius: 22,
    emotionStrength: 60,
    moveSpeed: 10,
    lastEmotionChange: 0,
  },
  {
    id: 'hedgehog-1',
    name: '刺刺',
    type: 'hedgehog',
    emotion: 'anxious',
    position: { x: 70, y: 62 },
    targetPosition: null,
    isMoving: false,
    hunger: 50,
    happiness: 35,
    lastFedTime: Date.now(),
    animationState: 'idle',
    direction: 'left',
    scale: 0.9,
    emotionRadius: 18,
    emotionStrength: 85,
    moveSpeed: 14,
    lastEmotionChange: 0,
  },
  {
    id: 'bear-1',
    name: '熊熊',
    type: 'bear',
    emotion: 'sleepy',
    position: { x: 82, y: 52 },
    targetPosition: null,
    isMoving: false,
    hunger: 20,
    happiness: 60,
    lastFedTime: Date.now(),
    animationState: 'idle',
    direction: 'right',
    scale: 1.1,
    emotionRadius: 20,
    emotionStrength: 50,
    moveSpeed: 6,
    lastEmotionChange: 0,
  },
  {
    id: 'turtle-1',
    name: '慢慢',
    type: 'turtle',
    emotion: 'calm',
    position: { x: 40, y: 68 },
    targetPosition: null,
    isMoving: false,
    hunger: 25,
    happiness: 65,
    lastFedTime: Date.now(),
    animationState: 'idle',
    direction: 'right',
    scale: 0.95,
    emotionRadius: 24,
    emotionStrength: 70,
    moveSpeed: 3,
    lastEmotionChange: 0,
  },
  {
    id: 'dog-1',
    name: '汪汪',
    type: 'dog',
    emotion: 'excited',
    position: { x: 52, y: 56 },
    targetPosition: null,
    isMoving: false,
    hunger: 35,
    happiness: 85,
    lastFedTime: Date.now(),
    animationState: 'idle',
    direction: 'left',
    scale: 1,
    emotionRadius: 28,
    emotionStrength: 90,
    moveSpeed: 12,
    lastEmotionChange: 0,
  },
];

export const useGameStore = create<GameState & GameActions>((set, get) => ({
  animals: initialAnimals,
  selectedFood: null,
  particles: [],
  currentIsland: 'home',
  weather: 'sunny',
  timeOfDay: 'day',
  globalBrightness: 1,
  isTransitioning: false,
  targetIsland: null,
  activeMiniGame: null,
  fusedAnimals: [],
  fusionAnimation: null,

  setSelectedFood: (food) => set({ selectedFood: food }),

  setGlobalBrightness: (brightness) => set({ globalBrightness: brightness }),

  updateAnimal: (animalId, updates) => {
    set((state) => ({
      animals: state.animals.map((a) =>
        a.id === animalId ? { ...a, ...updates } : a
      ),
    }));
  },

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
    if (newHappiness > 75) {
      newEmotion = animal.type === 'dog' ? 'excited' : 'happy';
    } else if (newHunger > 70) {
      newEmotion = 'angry';
    } else if (animal.emotion === 'sleepy' && newHappiness < 60 && animal.type === 'bear') {
      newEmotion = 'sleepy';
    } else if (animal.type === 'turtle' && newHappiness > 60) {
      newEmotion = 'calm';
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
              lastEmotionChange: newEmotion !== a.emotion ? Date.now() : a.lastEmotionChange,
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

    const newHappiness = Math.min(100, animal.happiness + 8);

    let newEmotion: EmotionType = animal.emotion;
    if (animal.emotion === 'angry' || animal.emotion === 'anxious') {
      if (Math.random() > 0.4) {
        newEmotion = animal.type === 'dog' ? 'excited' : 'happy';
      }
    } else if (animal.emotion === 'sleepy' && animal.type === 'bear') {
      newEmotion = 'calm';
    } else if (newHappiness > 75) {
      newEmotion = animal.type === 'dog' ? 'excited' : 'happy';
    } else if (animal.type === 'turtle' && newHappiness > 60) {
      newEmotion = 'calm';
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

    if (animal.type === 'dog' && (newEmotion === 'excited' || newEmotion === 'happy')) {
      for (let i = 0; i < 4; i++) {
        setTimeout(() => {
          get().addParticle({
            type: 'light',
            x: animal.position.x + (Math.random() - 0.5) * 20,
            y: animal.position.y - 10 + Math.random() * 20,
            duration: 2000,
            scale: 1.5,
          });
        }, i * 120);
      }
    }

    set((state) => ({
      animals: state.animals.map((a) =>
        a.id === animalId
          ? {
              ...a,
              happiness: newHappiness,
              emotion: newEmotion,
              animationState: 'reacting',
              lastEmotionChange: newEmotion !== a.emotion ? Date.now() : a.lastEmotionChange,
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

  startMiniGame: (animalId, gameType) => {
    const gameInfo = Object.values(ANIMAL_MINI_GAMES).find(g => g.type === gameType);
    if (!gameInfo) return;
    set({
      activeMiniGame: {
        animalId,
        gameType,
        status: 'playing',
        score: 0,
        timeLeft: gameInfo.duration,
      },
    });
  },

  endMiniGame: (result: MiniGameResult) => {
    const state = get();
    const activeGame = state.activeMiniGame;
    if (!activeGame) return;

    const animal = state.animals.find(a => a.id === activeGame.animalId);
    if (!animal) {
      set({ activeMiniGame: null });
      return;
    }

    const gameInfo = Object.values(ANIMAL_MINI_GAMES).find(g => g.type === activeGame.gameType);
    if (!gameInfo) {
      set({ activeMiniGame: null });
      return;
    }

    if (result === 'success') {
      const newHappiness = Math.min(100, animal.happiness + 30);
      state.updateAnimal(animal.id, {
        emotion: gameInfo.targetEmotion,
        happiness: newHappiness,
        animationState: 'glowing',
        lastEmotionChange: Date.now(),
      });

      for (let i = 0; i < 10; i++) {
        const delay = i * 100;
        setTimeout(() => {
          get().addParticle({
            type: Math.random() > 0.5 ? 'star' : 'sparkle',
            x: animal.position.x + (Math.random() - 0.5) * 15,
            y: animal.position.y - 8 + Math.random() * 10,
            duration: 2000 + Math.random() * 500,
            scale: 1.5,
          });
        }, delay);
      }

      setTimeout(() => {
        get().setAnimationState(animal.id, 'idle');
      }, 3000);
    } else {
      state.updateAnimal(animal.id, {
        animationState: 'scared',
      });

      for (let i = 0; i < 5; i++) {
        const delay = i * 80;
        setTimeout(() => {
          get().addParticle({
            type: 'sweat',
            x: animal.position.x + (Math.random() - 0.5) * 8,
            y: animal.position.y - 5 + Math.random() * 5,
            duration: 1500,
          });
        }, delay);
      }

      setTimeout(() => {
        get().setAnimationState(animal.id, 'idle');
      }, 1500);
    }
  },

  clearMiniGame: () => {
    set({ activeMiniGame: null });
  },

  updateMiniGameScore: (score) => {
    set((state) => {
      if (!state.activeMiniGame) return state;
      return {
        activeMiniGame: {
          ...state.activeMiniGame,
          score,
        },
      };
    });
  },

  setMiniGameTimeLeft: (time) => {
    set((state) => {
      if (!state.activeMiniGame) return state;
      return {
        activeMiniGame: {
          ...state.activeMiniGame,
          timeLeft: time,
        },
      };
    });
  },

  createFusion: (animal1Id, animal2Id, fusionType) => {
    const state = get();
    const animal1 = state.animals.find(a => a.id === animal1Id);
    const animal2 = state.animals.find(a => a.id === animal2Id);
    if (!animal1 || !animal2) return;

    const alreadyFused = state.fusedAnimals.some(f =>
      f.animalIds.includes(animal1Id) || f.animalIds.includes(animal2Id)
    );
    if (alreadyFused) return;

    const combo = FUSION_COMBOS.find(c => c.type === fusionType);
    if (!combo) return;

    const midX = (animal1.position.x + animal2.position.x) / 2;
    const midY = (animal1.position.y + animal2.position.y) / 2;

    const fused: FusedAnimal = {
      id: generateId(),
      fusionType,
      animalIds: [animal1Id, animal2Id],
      position: { x: midX, y: midY },
      createdAt: Date.now(),
      direction: Math.random() > 0.5 ? 'left' : 'right',
      scale: 1.2,
    };

    set({
      fusedAnimals: [...state.fusedAnimals, fused],
      fusionAnimation: {
        type: fusionType,
        position: { x: midX, y: midY },
        startedAt: Date.now(),
      },
      animals: state.animals.map(a => {
        if (a.id === animal1Id || a.id === animal2Id) {
          return {
            ...a,
            animationState: 'glowing' as AnimationState,
            targetPosition: { x: midX, y: midY },
            isMoving: true,
          };
        }
        return a;
      }),
    });

    for (let i = 0; i < 20; i++) {
      const delay = i * 80;
      setTimeout(() => {
        get().addParticle({
          type: combo.particles[Math.floor(Math.random() * combo.particles.length)],
          x: midX + (Math.random() - 0.5) * 20,
          y: midY - 5 + (Math.random() - 0.5) * 15,
          duration: 2000 + Math.random() * 500,
          scale: 1.5,
        });
      }, delay);
    }

    setTimeout(() => {
      get().clearFusionAnimation();
      const s = get();
      s.animals.forEach(a => {
        if (a.id === animal1Id || a.id === animal2Id) {
          s.setAnimationState(a.id, 'idle');
          s.setAnimalMoving(a.id, false);
        }
      });
    }, 3000);
  },

  removeFusion: (fusedAnimalId) => {
    const state = get();
    const fused = state.fusedAnimals.find(f => f.id === fusedAnimalId);
    if (!fused) return;

    set({
      fusedAnimals: state.fusedAnimals.filter(f => f.id !== fusedAnimalId),
    });
  },

  checkAndTriggerFusion: () => {
    const state = get();
    if (state.fusionAnimation) return;
    if (state.fusedAnimals.length >= 3) return;

    const now = Date.now();
    const animals = state.animals;

    for (const combo of FUSION_COMBOS) {
      const animal1 = animals.find(a =>
        a.emotion === combo.emotion1 &&
        (now - a.lastEmotionChange) > FUSION_NEGLECT_THRESHOLD &&
        !state.fusedAnimals.some(f => f.animalIds.includes(a.id))
      );
      const animal2 = animals.find(a =>
        a.id !== (animal1?.id) &&
        a.emotion === combo.emotion2 &&
        (now - a.lastEmotionChange) > FUSION_NEGLECT_THRESHOLD &&
        !state.fusedAnimals.some(f => f.animalIds.includes(a.id))
      );

      if (animal1 && animal2) {
        const dx = animal1.position.x - animal2.position.x;
        const dy = animal1.position.y - animal2.position.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < FUSION_PROXIMITY_THRESHOLD) {
          get().createFusion(animal1.id, animal2.id, combo.type);
          return;
        }

        get().setAnimalMoving(animal1.id, true, {
          x: (animal1.position.x + animal2.position.x) / 2,
          y: (animal1.position.y + animal2.position.y) / 2,
        });
        get().setAnimalMoving(animal2.id, true, {
          x: (animal1.position.x + animal2.position.x) / 2,
          y: (animal1.position.y + animal2.position.y) / 2,
        });
        return;
      }
    }
  },

  clearFusionAnimation: () => {
    set({ fusionAnimation: null });
  },

  travelToIsland: (island: IslandType) => {
    const state = get();
    if (state.isTransitioning || state.currentIsland === island) return;

    const islandInfo = ISLAND_INFO[island];
    set({
      isTransitioning: true,
      targetIsland: island,
    });

    setTimeout(() => {
      set({
        currentIsland: island,
        weather: islandInfo.defaultWeather,
        timeOfDay: islandInfo.defaultTimeOfDay,
        globalBrightness: TIME_OF_DAY_CONFIG[islandInfo.defaultTimeOfDay].brightness,
        particles: [],
      });

      const s = get();
      s.animals.forEach((animal) => {
        if (islandInfo.hasSleepwalking) {
          s.setAnimationState(animal.id, 'sleepwalking');
        } else if (islandInfo.hasAntiGravity) {
          s.setAnimationState(animal.id, 'floating');
        } else {
          s.setAnimationState(animal.id, 'idle');
        }
      });
    }, 2500);
  },

  completeIslandTransition: () => {
    set({
      isTransitioning: false,
      targetIsland: null,
    });
  },

  setWeather: (weather: WeatherType) => {
    set({ weather });
  },

  setTimeOfDay: (time: TimeOfDay) => {
    const config = TIME_OF_DAY_CONFIG[time];
    set({
      timeOfDay: time,
      globalBrightness: config.brightness,
    });
  },

  advanceTimeOfDay: () => {
    const state = get();
    const order: TimeOfDay[] = ['dawn', 'day', 'dusk', 'night'];
    const currentIndex = order.indexOf(state.timeOfDay);
    const nextIndex = (currentIndex + 1) % order.length;
    const nextTime = order[nextIndex];
    get().setTimeOfDay(nextTime);
  },
}));
