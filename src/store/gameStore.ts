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
  DragReactionType,
  FormationType,
  WALKING_COMBINATIONS,
  WalkingCombination,
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
    isDragged: false,
    dragReaction: null,
    path: [],
    lastDragTime: 0,
    destinationPreference: 'social',
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
    isDragged: false,
    dragReaction: null,
    path: [],
    lastDragTime: 0,
    destinationPreference: 'quiet',
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
    isDragged: false,
    dragReaction: null,
    path: [],
    lastDragTime: 0,
    destinationPreference: 'quiet',
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
    isDragged: false,
    dragReaction: null,
    path: [],
    lastDragTime: 0,
    destinationPreference: 'quiet',
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
    isDragged: false,
    dragReaction: null,
    path: [],
    lastDragTime: 0,
    destinationPreference: 'social',
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
  player: {
    position: { x: 50, y: 60 },
    targetPosition: null,
    isMoving: false,
    direction: 'right',
    isWalkingAnimals: false,
  },
  selectedWalkingAnimals: [],
  isWalkingMode: false,
  currentFormation: 'single_file',
  activeWalkingCombination: null,

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

  startDragAnimal: (animalId) => {
    const state = get();
    const animal = state.animals.find((a) => a.id === animalId);
    if (!animal || animal.isDragged) return;

    set((s) => ({
      animals: s.animals.map((a) =>
        a.id === animalId
          ? {
              ...a,
              isDragged: true,
              isMoving: false,
              targetPosition: null,
              path: [],
              animationState: 'dragged' as AnimationState,
            }
          : a
      ),
    }));

    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        get().addParticle({
          type: 'exclamation',
          x: animal.position.x + (Math.random() - 0.5) * 5,
          y: animal.position.y - 8 + Math.random() * 3,
          duration: 800,
          scale: 1.2,
        });
      }, i * 100);
    }
  },

  updateDragPosition: (animalId, position) => {
    const state = get();
    const animal = state.animals.find((a) => a.id === animalId);
    if (!animal || !animal.isDragged) return;

    const clampedX = Math.max(5, Math.min(95, position.x));
    const clampedY = Math.max(40, Math.min(82, position.y));

    set((s) => ({
      animals: s.animals.map((a) =>
        a.id === animalId
          ? { ...a, position: { x: clampedX, y: clampedY } }
          : a
      ),
    }));
  },

  endDragAnimal: (animalId, dropPosition) => {
    const state = get();
    const animal = state.animals.find((a) => a.id === animalId);
    if (!animal) return 'cooperate';

    const clampedX = Math.max(8, Math.min(92, dropPosition.x));
    const clampedY = Math.max(42, Math.min(78, dropPosition.y));
    const finalPosition = { x: clampedX, y: clampedY };

    let reaction: DragReactionType = 'cooperate';
    const rand = Math.random();

    if (animal.emotion === 'anxious' || animal.emotion === 'angry') {
      if (rand < 0.5) {
        reaction = 'escape';
      } else if (rand < 0.7) {
        reaction = 'protest';
      } else if (rand < 0.85) {
        reaction = 'play_dead';
      }
    } else if (animal.emotion === 'sleepy') {
      if (rand < 0.5) {
        reaction = 'stubborn';
      } else if (rand < 0.7) {
        reaction = 'play_dead';
      }
    } else if (animal.emotion === 'calm') {
      if (rand < 0.15) {
        reaction = 'stubborn';
      }
    } else if (animal.emotion === 'happy' || animal.emotion === 'excited') {
      if (rand < 0.1) {
        reaction = 'escape';
      }
    }

    const dropX = finalPosition.x;
    const dropY = finalPosition.y;

    if (reaction === 'escape') {
      const escapeAngle = Math.random() * Math.PI * 2;
      const escapeDist = 25 + Math.random() * 15;
      const escapePos = {
        x: Math.max(8, Math.min(92, dropX + Math.cos(escapeAngle) * escapeDist)),
        y: Math.max(42, Math.min(78, dropY + Math.sin(escapeAngle) * escapeDist * 0.5)),
      };

      set((s) => ({
        animals: s.animals.map((a) =>
          a.id === animalId
            ? {
                ...a,
                isDragged: false,
                dragReaction: 'escape',
                animationState: 'escaping' as AnimationState,
                position: finalPosition,
                targetPosition: escapePos,
                isMoving: true,
                lastDragTime: Date.now(),
                path: [],
                direction: escapePos.x < a.position.x ? 'left' : 'right',
              }
            : a
        ),
      }));

      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          get().addParticle({
            type: 'sweat',
            x: finalPosition.x + (Math.random() - 0.5) * 8,
            y: finalPosition.y - 5 + Math.random() * 5,
            duration: 1200,
          });
        }, i * 80);
      }

      setTimeout(() => {
        const s = useGameStore.getState();
        const a = s.animals.find((an) => an.id === animalId);
        if (a && a.animationState === 'escaping') {
          useGameStore.getState().updateAnimal(animalId, {
            animationState: 'idle',
            dragReaction: null,
          });
        }
      }, 2500);
    } else if (reaction === 'protest') {
      set((s) => ({
        animals: s.animals.map((a) =>
          a.id === animalId
            ? {
                ...a,
                isDragged: false,
                dragReaction: 'protest',
                animationState: 'protesting' as AnimationState,
                position: finalPosition,
                lastDragTime: Date.now(),
                path: [],
              }
            : a
        ),
      }));

      for (let i = 0; i < 6; i++) {
        setTimeout(() => {
          get().addParticle({
            type: 'exclamation',
            x: finalPosition.x + (Math.random() - 0.5) * 10,
            y: finalPosition.y - 10 + Math.random() * 5,
            duration: 1000,
            scale: 1.3,
          });
        }, i * 120);
      }

      setTimeout(() => {
        const s = useGameStore.getState();
        const a = s.animals.find((an) => an.id === animalId);
        if (a && a.animationState === 'protesting') {
          useGameStore.getState().updateAnimal(animalId, {
            animationState: 'idle',
            dragReaction: null,
          });
        }
      }, 2000);
    } else if (reaction === 'play_dead') {
      set((s) => ({
        animals: s.animals.map((a) =>
          a.id === animalId
            ? {
                ...a,
                isDragged: false,
                dragReaction: 'play_dead',
                animationState: 'playing_dead' as AnimationState,
                position: finalPosition,
                lastDragTime: Date.now(),
                path: [],
              }
            : a
        ),
      }));

      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          get().addParticle({
            type: 'zzz',
            x: finalPosition.x + (Math.random() - 0.5) * 6,
            y: finalPosition.y - 12 + Math.random() * 3,
            duration: 1500,
          });
        }, i * 200);
      }

      setTimeout(() => {
        const s = useGameStore.getState();
        const a = s.animals.find((an) => an.id === animalId);
        if (a && a.animationState === 'playing_dead') {
          useGameStore.getState().updateAnimal(animalId, {
            animationState: 'idle',
            dragReaction: null,
          });
        }
      }, 3000);
    } else if (reaction === 'stubborn') {
      set((s) => ({
        animals: s.animals.map((a) =>
          a.id === animalId
            ? {
                ...a,
                isDragged: false,
                dragReaction: 'stubborn',
                animationState: 'stubborn' as AnimationState,
                position: finalPosition,
                lastDragTime: Date.now(),
                path: [],
              }
            : a
        ),
      }));

      setTimeout(() => {
        get().addParticle({
          type: 'sparkle',
          x: finalPosition.x,
          y: finalPosition.y - 5,
          duration: 1500,
          scale: 1.5,
        });
      }, 300);

      setTimeout(() => {
        const s = useGameStore.getState();
        const a = s.animals.find((an) => an.id === animalId);
        if (a && a.animationState === 'stubborn') {
          useGameStore.getState().updateAnimal(animalId, {
            animationState: 'idle',
            dragReaction: null,
          });
        }
      }, 2500);
    } else {
      set((s) => ({
        animals: s.animals.map((a) =>
          a.id === animalId
            ? {
                ...a,
                isDragged: false,
                dragReaction: 'cooperate',
                animationState: 'reacting' as AnimationState,
                position: finalPosition,
                lastDragTime: Date.now(),
                path: [],
              }
            : a
        ),
      }));

      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          get().addParticle({
            type: Math.random() > 0.5 ? 'heart' : 'sparkle',
            x: finalPosition.x + (Math.random() - 0.5) * 6,
            y: finalPosition.y - 8 + Math.random() * 4,
            duration: 1200,
          });
        }, i * 100);
      }

      setTimeout(() => {
        const s = useGameStore.getState();
        const a = s.animals.find((an) => an.id === animalId);
        if (a && (a.animationState === 'reacting' || a.dragReaction === 'cooperate')) {
          useGameStore.getState().updateAnimal(animalId, {
            animationState: 'idle',
            dragReaction: null,
          });
        }
      }, 1200);
    }

    return reaction;
  },

  setAnimalPath: (animalId, path) => {
    set((s) => ({
      animals: s.animals.map((a) =>
        a.id === animalId ? { ...a, path } : a
      ),
    }));
  },

  advanceAnimalPath: (animalId) => {
    const state = get();
    const animal = state.animals.find((a) => a.id === animalId);
    if (!animal || animal.path.length === 0) return;

    const nextIndex = animal.path.findIndex((p) => !p.arrived);
    if (nextIndex === -1) {
      set((s) => ({
        animals: s.animals.map((a) =>
          a.id === animalId ? { ...a, path: [] } : a
        ),
      }));
      return;
    }

    const nextNode = animal.path[nextIndex];
    state.setAnimalMoving(animalId, true, nextNode.position);
  },

  toggleWalkingMode: () => {
    const state = get();
    if (state.isWalkingMode) {
      get().stopWalking();
    } else {
      set({
        isWalkingMode: true,
        selectedWalkingAnimals: [],
        activeWalkingCombination: null,
      });
    }
  },

  toggleAnimalForWalk: (animalId) => {
    const state = get();
    if (!state.isWalkingMode) return;

    const animal = state.animals.find((a) => a.id === animalId);
    if (!animal || animal.isDragged) return;

    const isFused = state.fusedAnimals.some((f) => f.animalIds.includes(animalId));
    if (isFused) return;

    set((s) => {
      const isSelected = s.selectedWalkingAnimals.includes(animalId);
      let newSelected: string[];

      if (isSelected) {
        newSelected = s.selectedWalkingAnimals.filter((id) => id !== animalId);
      } else {
        if (s.selectedWalkingAnimals.length >= 3) {
          return s;
        }
        newSelected = [...s.selectedWalkingAnimals, animalId];
      }

      return {
        selectedWalkingAnimals: newSelected,
      };
    });
  },

  setFormation: (formation: FormationType) => {
    set({ currentFormation: formation });
  },

  setPlayerPosition: (position) => {
    set((s) => ({
      player: { ...s.player, position },
    }));
  },

  setPlayerMoving: (isMoving, target) => {
    set((s) => {
      const newDirection =
        target && target.x < s.player.position.x
          ? 'left'
          : target && target.x > s.player.position.x
            ? 'right'
            : s.player.direction;
      return {
        player: {
          ...s.player,
          isMoving,
          targetPosition: target || null,
          direction: newDirection,
        },
      };
    });
  },

  startWalking: () => {
    const state = get();
    if (state.selectedWalkingAnimals.length === 0) return;

    const combination = get().checkWalkingCombination();

    set({
      isWalkingMode: false,
      player: {
        ...state.player,
        isWalkingAnimals: true,
      },
      activeWalkingCombination: combination,
    });

    if (combination) {
      for (let i = 0; i < 8; i++) {
        setTimeout(() => {
          get().addParticle({
            type: combination.particles[Math.floor(Math.random() * combination.particles.length)],
            x: state.player.position.x + (Math.random() - 0.5) * 15,
            y: state.player.position.y - 5 + (Math.random() - 0.5) * 10,
            duration: 1500 + Math.random() * 500,
            scale: 1.2,
          });
        }, i * 100);
      }
    }
  },

  stopWalking: () => {
    const state = get();
    const walkingAnimalIds = [...state.selectedWalkingAnimals];

    set({
      isWalkingMode: false,
      player: {
        ...state.player,
        isWalkingAnimals: false,
        isMoving: false,
        targetPosition: null,
      },
      selectedWalkingAnimals: [],
      activeWalkingCombination: null,
    });

    walkingAnimalIds.forEach((animalId) => {
      state.setAnimalMoving(animalId, false);
      state.updateAnimal(animalId, {
        path: [],
        animationState: 'idle',
      });
    });
  },

  checkWalkingCombination: (): WalkingCombination | null => {
    const state = get();
    const selectedAnimals = state.selectedWalkingAnimals
      .map((id) => state.animals.find((a) => a.id === id))
      .filter((a): a is Animal => a !== undefined);

    if (selectedAnimals.length < 2) return null;

    const selectedTypes = selectedAnimals.map((a) => a.type).sort();
    const selectedEmotions = selectedAnimals.map((a) => a.emotion).sort();

    for (const combo of WALKING_COMBINATIONS) {
      const comboTypes = [...combo.types].sort();
      const comboEmotions = [...combo.emotions].sort();

      const typesMatch =
        selectedTypes.length === comboTypes.length &&
        selectedTypes.every((t, i) => t === comboTypes[i]);

      const emotionsMatch =
        selectedEmotions.length === comboEmotions.length &&
        selectedEmotions.every((e, i) => e === comboEmotions[i]);

      if (typesMatch && emotionsMatch) {
        return combo;
      }

      if (typesMatch && combo.types.length === 2) {
        const reversedEmotions = [...combo.emotions].reverse();
        const reverseEmotionsMatch =
          selectedEmotions.length === reversedEmotions.length &&
          selectedEmotions.every((e, i) => e === reversedEmotions[i]);
        if (reverseEmotionsMatch) {
          return combo;
        }
      }
    }

    return null;
  },
}));
