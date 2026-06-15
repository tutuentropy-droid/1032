import { useEffect, useRef, useMemo } from 'react';
import { useGameStore } from '@/store/gameStore';
import { BehaviorContext, ISLAND_INFO } from '@/types/game';
import { createBehaviorTree, executeNode } from '@/lib/behaviorTree';
import { processEmotionChain } from '@/lib/emotionChain';

export const useAnimalAI = () => {
  const { animals, updateAnimalPosition, setAnimalMoving } = useGameStore();
  const animationRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(Date.now());
  const lastBehaviorTickRef = useRef<number>(Date.now());
  const lastEmotionTickRef = useRef<number>(Date.now());
  const lastHungerTickRef = useRef<number>(Date.now());
  const lastFusionCheckRef = useRef<number>(Date.now());
  const lastTimeAdvanceRef = useRef<number>(Date.now());

  const behaviorTrees = useMemo(() => {
    const trees: Record<string, ReturnType<typeof createBehaviorTree>> = {};
    animals.forEach(animal => {
      trees[animal.id] = createBehaviorTree(animal.type);
    });
    return trees;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const animate = () => {
      const now = Date.now();
      const state = useGameStore.getState();
      const islandInfo = ISLAND_INFO[state.currentIsland];
      const timeScale = islandInfo.timeScale;
      const delta = ((now - lastUpdateRef.current) / 1000) * timeScale;
      lastUpdateRef.current = now;

      state.animals.forEach((animal) => {
        if (state.activeMiniGame && state.activeMiniGame.animalId === animal.id) return;
        if (animal.isMoving && animal.targetPosition) {
          const speed = animal.moveSpeed * timeScale;
          const dx = animal.targetPosition.x - animal.position.x;
          const dy = animal.targetPosition.y - animal.position.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 0.5) {
            updateAnimalPosition(animal.id, animal.targetPosition);
            setAnimalMoving(animal.id, false);
          } else {
            const moveX = (dx / distance) * speed * delta;
            const moveY = (dy / distance) * speed * delta;
            const newX = animal.position.x + moveX;
            const newY = animal.position.y + moveY;
            updateAnimalPosition(animal.id, { x: newX, y: newY });
          }
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
          if (animal.animationState === 'eating' || animal.animationState === 'reacting') return;
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
  }, [behaviorTrees, updateAnimalPosition, setAnimalMoving]);
};

export default useAnimalAI;
