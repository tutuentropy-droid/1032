import { useEffect, useRef, useMemo } from 'react';
import { useGameStore } from '@/store/gameStore';
import { BehaviorContext, ISLAND_INFO, Animal, Position, PathNode, FormationType } from '@/types/game';
import { createBehaviorTree, executeNode } from '@/lib/behaviorTree';
import { processEmotionChain } from '@/lib/emotionChain';

const clampPosition = (pos: Position): Position => ({
  x: Math.max(8, Math.min(92, pos.x)),
  y: Math.max(42, Math.min(78, pos.y)),
});

const getDistance = (a: Position, b: Position): number => {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
};

const generatePath = (start: Position, destination: Position, segments: number = 3): PathNode[] => {
  const path: PathNode[] = [];
  for (let i = 1; i <= segments; i++) {
    const t = i / segments;
    const midX = start.x + (destination.x - start.x) * t + (Math.random() - 0.5) * 8;
    const midY = start.y + (destination.y - start.y) * t + (Math.random() - 0.5) * 4;
    path.push({
      position: clampPosition({ x: midX, y: midY }),
      arrived: false,
    });
  }
  return path;
};

const findQuietCorner = (animals: Animal[], selfId: string): Position => {
  const corners = [
    { x: 12, y: 72 },
    { x: 88, y: 72 },
    { x: 15, y: 50 },
    { x: 85, y: 50 },
  ];

  let bestCorner = corners[0];
  let maxDist = -Infinity;

  for (const corner of corners) {
    let minDistToOther = Infinity;
    for (const animal of animals) {
      if (animal.id === selfId) continue;
      const dist = getDistance(corner, animal.position);
      if (dist < minDistToOther) {
        minDistToOther = dist;
      }
    }
    if (minDistToOther > maxDist) {
      maxDist = minDistToOther;
      bestCorner = corner;
    }
  }

  return bestCorner;
};

const findSocialArea = (animals: Animal[], selfId: string): Position => {
  let totalX = 0;
  let totalY = 0;
  let count = 0;

  for (const animal of animals) {
    if (animal.id === selfId) continue;
    totalX += animal.position.x;
    totalY += animal.position.y;
    count++;
  }

  if (count === 0) {
    return { x: 50, y: 60 };
  }

  const centerX = totalX / count + (Math.random() - 0.5) * 15;
  const centerY = totalY / count + (Math.random() - 0.5) * 8;
  return clampPosition({ x: centerX, y: centerY });
};

const findFoodArea = (): Position => {
  const foodSpots = [
    { x: 30, y: 65 },
    { x: 60, y: 68 },
    { x: 75, y: 58 },
  ];
  return foodSpots[Math.floor(Math.random() * foodSpots.length)];
};

const decideDestination = (animal: Animal, animals: Animal[]): Position => {
  const preference = animal.destinationPreference;
  const emotion = animal.emotion;

  let destination: Position;

  if (preference === 'quiet' || emotion === 'anxious' || emotion === 'sleepy' || emotion === 'calm') {
    if (Math.random() < 0.7) {
      destination = findQuietCorner(animals, animal.id);
    } else if (Math.random() < 0.5) {
      destination = findFoodArea();
    } else {
      destination = {
        x: animal.position.x + (Math.random() - 0.5) * 30,
        y: animal.position.y + (Math.random() - 0.5) * 15,
      };
    }
  } else if (preference === 'social' || emotion === 'happy' || emotion === 'excited') {
    if (Math.random() < 0.6) {
      destination = findSocialArea(animals, animal.id);
    } else if (Math.random() < 0.5) {
      destination = findFoodArea();
    } else {
      destination = {
        x: animal.position.x + (Math.random() - 0.5) * 35,
        y: animal.position.y + (Math.random() - 0.5) * 18,
      };
    }
  } else if (preference === 'food') {
    destination = findFoodArea();
  } else {
    destination = {
      x: animal.position.x + (Math.random() - 0.5) * 40,
      y: animal.position.y + (Math.random() - 0.5) * 20,
    };
  }

  return clampPosition(destination);
};

const getFormationPosition = (
  playerPos: Position,
  playerDirection: 'left' | 'right',
  formation: FormationType,
  animalIndex: number,
  totalAnimals: number
): Position => {
  const directionMultiplier = playerDirection === 'left' ? -1 : 1;
  const spacing = 8;
  const sideOffset = 6;

  switch (formation) {
    case 'single_file':
      return {
        x: playerPos.x - directionMultiplier * spacing * (animalIndex + 1),
        y: playerPos.y + (animalIndex % 2 === 0 ? 2 : -2),
      };

    case 'side_by_side': {
      const side = animalIndex % 2 === 0 ? 1 : -1;
      const row = Math.floor(animalIndex / 2);
      return {
        x: playerPos.x + directionMultiplier * (sideOffset * side) - directionMultiplier * spacing * row * 0.5,
        y: playerPos.y + 3 + row * 2,
      };
    }

    case 'triangle': {
      if (animalIndex === 0) {
        return {
          x: playerPos.x - directionMultiplier * spacing * 0.8,
          y: playerPos.y + 3,
        };
      } else if (animalIndex === 1) {
        return {
          x: playerPos.x - directionMultiplier * spacing * 1.5 - sideOffset,
          y: playerPos.y + 5,
        };
      } else {
        return {
          x: playerPos.x - directionMultiplier * spacing * 1.5 + sideOffset,
          y: playerPos.y + 5,
        };
      }
    }

    case 'loose': {
      const angle = (animalIndex / Math.max(totalAnimals, 1)) * Math.PI * 0.6 + Math.PI * 0.2;
      const dist = spacing * (1 + animalIndex * 0.3);
      return {
        x: playerPos.x - directionMultiplier * Math.cos(angle) * dist,
        y: playerPos.y + Math.sin(angle) * dist * 0.6 + 3,
      };
    }

    default:
      return {
        x: playerPos.x - directionMultiplier * spacing * (animalIndex + 1),
        y: playerPos.y,
      };
  }
};

const getCombinationSpeedMultiplier = (
  animal: Animal,
  comboName: string | null
): number => {
  if (!comboName) return 1;

  switch (comboName) {
    case 'funny_tempo':
      if (animal.type === 'dog') return 1.4;
      if (animal.type === 'hedgehog') return 0.6;
      return 1;
    case 'tortoise_hare':
      if (animal.type === 'rabbit') return 1.3;
      if (animal.type === 'turtle') return 0.5;
      return 1;
    case 'sleepy_excited':
      if (animal.type === 'dog') return 1.5;
      if (animal.type === 'bear') return 0.4;
      return 1;
    case 'happy_party':
      return 1.2;
    case 'calming':
      return 0.7;
    case 'chaos_harmony':
      return 1 + (Math.random() - 0.5) * 0.4;
    default:
      return 1;
  }
};

export const useAnimalAI = () => {
  const {
    animals,
    updateAnimalPosition,
    setAnimalMoving,
    advanceAnimalPath,
    setAnimalPath,
    updateAnimal,
    setPlayerPosition,
    setPlayerMoving,
  } = useGameStore();
  const animationRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(Date.now());
  const lastBehaviorTickRef = useRef<number>(Date.now());
  const lastEmotionTickRef = useRef<number>(Date.now());
  const lastHungerTickRef = useRef<number>(Date.now());
  const lastFusionCheckRef = useRef<number>(Date.now());
  const lastTimeAdvanceRef = useRef<number>(Date.now());
  const lastPathDecisionRef = useRef<Record<string, number>>({});
  const lastCombinationParticleRef = useRef<number>(0);

  const behaviorTrees = useMemo(() => {
    const trees: Record<string, ReturnType<typeof createBehaviorTree>> = {};
    animals.forEach(animal => {
      trees[animal.id] = createBehaviorTree(animal.type);
    });
    return trees;
  }, [animals]);

  useEffect(() => {
    const animate = () => {
      const now = Date.now();
      const state = useGameStore.getState();
      const islandInfo = ISLAND_INFO[state.currentIsland];
      const timeScale = islandInfo.timeScale;
      const delta = ((now - lastUpdateRef.current) / 1000) * timeScale;
      lastUpdateRef.current = now;

      if (state.player.isMoving && state.player.targetPosition) {
        const playerSpeed = 8 * timeScale;
        const dx = state.player.targetPosition.x - state.player.position.x;
        const dy = state.player.targetPosition.y - state.player.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 0.5) {
          setPlayerPosition(state.player.targetPosition);
          setPlayerMoving(false);
        } else {
          const moveX = (dx / distance) * playerSpeed * delta;
          const moveY = (dy / distance) * playerSpeed * delta;
          const newX = state.player.position.x + moveX;
          const newY = state.player.position.y + moveY;
          setPlayerPosition({ x: newX, y: newY });
        }
      }

      if (state.player.isWalkingAnimals && state.selectedWalkingAnimals.length > 0) {
        if (now - lastCombinationParticleRef.current > 800 && state.activeWalkingCombination) {
          lastCombinationParticleRef.current = now;
          const combo = state.activeWalkingCombination;
          for (let i = 0; i < 2; i++) {
            state.addParticle({
              type: combo.particles[Math.floor(Math.random() * combo.particles.length)],
              x: state.player.position.x + (Math.random() - 0.5) * 20,
              y: state.player.position.y - 3 + (Math.random() - 0.5) * 10,
              duration: 1000 + Math.random() * 500,
              scale: 0.8 + Math.random() * 0.5,
            });
          }
        }

        state.selectedWalkingAnimals.forEach((animalId, index) => {
          const animal = state.animals.find((a) => a.id === animalId);
          if (!animal) return;

          const targetPos = getFormationPosition(
            state.player.position,
            state.player.direction,
            state.currentFormation,
            index,
            state.selectedWalkingAnimals.length
          );

          const comboMultiplier = getCombinationSpeedMultiplier(
            animal,
            state.activeWalkingCombination?.name || null
          );
          const speed = animal.moveSpeed * timeScale * comboMultiplier;

          const dx = targetPos.x - animal.position.x;
          const dy = targetPos.y - animal.position.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance > 1) {
            const moveX = (dx / distance) * speed * delta;
            const moveY = (dy / distance) * speed * delta;
            const newX = animal.position.x + moveX;
            const newY = animal.position.y + moveY;

            const newDirection = dx < -0.1 ? 'left' : dx > 0.1 ? 'right' : animal.direction;

            updateAnimal(animalId, {
              position: { x: newX, y: newY },
              isMoving: true,
              animationState: 'walking',
              direction: newDirection,
              path: [],
            });
          } else {
            updateAnimal(animalId, {
              isMoving: false,
              animationState: 'idle',
              path: [],
            });
          }
        });
      }

      state.animals.forEach((animal) => {
        if (state.activeMiniGame && state.activeMiniGame.animalId === animal.id) return;

        if (animal.isDragged) return;

        if (animal.animationState === 'protesting' ||
            animal.animationState === 'playing_dead' ||
            animal.animationState === 'stubborn') {
          return;
        }

        if (state.player.isWalkingAnimals && state.selectedWalkingAnimals.includes(animal.id)) {
          return;
        }

        if (animal.path && animal.path.length > 0) {
          const nextUnexplored = animal.path.findIndex(p => !p.arrived);

          if (nextUnexplored !== -1 && !animal.isMoving) {
            const nextNode = animal.path[nextUnexplored];
            state.setAnimalMoving(animal.id, true, nextNode.position);
            return;
          }
        }

        if (animal.isMoving && animal.targetPosition) {
          const speed = animal.animationState === 'escaping' ? animal.moveSpeed * 2.5 : animal.moveSpeed * timeScale;
          const dx = animal.targetPosition.x - animal.position.x;
          const dy = animal.targetPosition.y - animal.position.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 0.5) {
            updateAnimalPosition(animal.id, animal.targetPosition);

            if (animal.path && animal.path.length > 0) {
              const nextIdx = animal.path.findIndex(p => !p.arrived);
              if (nextIdx !== -1) {
                const newPath = [...animal.path];
                newPath[nextIdx] = { ...newPath[nextIdx], arrived: true };
                setAnimalPath(animal.id, newPath);

                const allArrived = newPath.every(p => p.arrived);
                if (allArrived) {
                  setAnimalMoving(animal.id, false);
                  setAnimalPath(animal.id, []);
                } else {
                  advanceAnimalPath(animal.id);
                }
              } else {
                setAnimalMoving(animal.id, false);
              }
            } else {
              setAnimalMoving(animal.id, false);
            }
          } else {
            const moveX = (dx / distance) * speed * delta;
            const moveY = (dy / distance) * speed * delta;
            const newX = animal.position.x + moveX;
            const newY = animal.position.y + moveY;
            updateAnimalPosition(animal.id, { x: newX, y: newY });
          }
          return;
        }

        const lastPathDecision = lastPathDecisionRef.current[animal.id] || 0;
        const pathDecisionCooldown = 3000 / timeScale;
        if (animal.lastDragTime > 0 &&
            now - animal.lastDragTime > 2500 / timeScale &&
            now - lastPathDecision > pathDecisionCooldown &&
            animal.path.length === 0 &&
            !animal.isMoving) {

          const destination = decideDestination(animal, state.animals);
          const segments = 2 + Math.floor(Math.random() * 3);
          const path = generatePath(animal.position, destination, segments);

          setAnimalPath(animal.id, path);
          lastPathDecisionRef.current[animal.id] = now;

          if (path.length > 0) {
            setTimeout(() => {
              advanceAnimalPath(animal.id);
            }, 300);
          }
          return;
        }
      });

      const behaviorTickInterval = 800 / timeScale;
      if (now - lastBehaviorTickRef.current > behaviorTickInterval) {
        lastBehaviorTickRef.current = now;
        const ctx: BehaviorContext = {
          animalId: '',
          animals: useGameStore.getState().animals,
          deltaTime: delta,
          currentTime: now,
        };

        useGameStore.getState().animals.forEach((animal) => {
          if (useGameStore.getState().activeMiniGame && useGameStore.getState().activeMiniGame!.animalId === animal.id) return;
          if (animal.isDragged) return;
          if (animal.animationState === 'eating' || animal.animationState === 'reacting') return;
          if (animal.animationState === 'protesting' ||
              animal.animationState === 'playing_dead' ||
              animal.animationState === 'stubborn' ||
              animal.animationState === 'escaping') return;
          if (animal.path && animal.path.length > 0) return;
          if (islandInfo.hasSleepwalking && (animal.animationState === 'sleepwalking' || animal.animationState === 'idle' || animal.animationState === 'walking')) {
            return;
          }
          const tree = behaviorTrees[animal.id];
          if (!tree) return;
          ctx.animalId = animal.id;
          ctx.animals = useGameStore.getState().animals;
          executeNode(tree, ctx);
        });
      }

      const emotionTickInterval = 1200 / timeScale;
      if (now - lastEmotionTickRef.current > emotionTickInterval) {
        lastEmotionTickRef.current = now;
        processEmotionChain(useGameStore.getState().animals, now);
      }

      const hungerTickInterval = 5000 / timeScale;
      if (now - lastHungerTickRef.current > hungerTickInterval) {
        lastHungerTickRef.current = now;
        const s = useGameStore.getState();
        s.animals.forEach((animal) => {
          if (s.activeMiniGame && s.activeMiniGame.animalId === animal.id) return;
          const timeSinceLastFed = (now - animal.lastFedTime) * timeScale;
          const newHunger = Math.min(100, animal.hunger + timeSinceLastFed / 60000 * 2);
          const newHappiness = Math.max(0, animal.happiness - (newHunger > 70 ? 0.5 : 0.1));

          s.updateAnimal(animal.id, {
            hunger: newHunger,
            happiness: newHappiness,
            lastFedTime: newHunger > animal.hunger + 0.5 ? animal.lastFedTime : animal.lastFedTime,
          });
        });
      }

      if (now - lastFusionCheckRef.current > 3000) {
        lastFusionCheckRef.current = now;
        useGameStore.getState().checkAndTriggerFusion();
      }

      if (now - lastTimeAdvanceRef.current > 60000) {
        lastTimeAdvanceRef.current = now;
        useGameStore.getState().advanceTimeOfDay();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [behaviorTrees, updateAnimalPosition, setAnimalMoving, advanceAnimalPath, setAnimalPath, updateAnimal, animals]);
};

export default useAnimalAI;
