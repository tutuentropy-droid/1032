import { useEffect, useRef, useMemo } from 'react';
import { useGameStore } from '@/store/gameStore';
import { BehaviorContext } from '@/types/game';
import { createBehaviorTree, executeNode } from '@/lib/behaviorTree';
import { processEmotionChain } from '@/lib/emotionChain';

export const useAnimalAI = () => {
  const { animals, updateAnimalPosition, setAnimalMoving, activeMiniGame } = useGameStore();
  const animationRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(Date.now());
  const lastBehaviorTickRef = useRef<number>(Date.now());
  const lastEmotionTickRef = useRef<number>(Date.now());
  const lastHungerTickRef = useRef<number>(Date.now());

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
      const delta = (now - lastUpdateRef.current) / 1000;
      lastUpdateRef.current = now;

      const state = useGameStore.getState();
      state.animals.forEach((animal) => {
        if (state.activeMiniGame && state.activeMiniGame.animalId === animal.id) return;
        if (animal.isMoving && animal.targetPosition) {
          const speed = animal.moveSpeed;
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

      if (now - lastBehaviorTickRef.current > 800) {
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
          const tree = behaviorTrees[animal.id];
          if (!tree) return;
          ctx.animalId = animal.id;
          ctx.animals = useGameStore.getState().animals;
          executeNode(tree, ctx);
        });
      }

      if (now - lastEmotionTickRef.current > 1200) {
        lastEmotionTickRef.current = now;
        processEmotionChain(useGameStore.getState().animals, now);
      }

      if (now - lastHungerTickRef.current > 5000) {
        lastHungerTickRef.current = now;
        const s = useGameStore.getState();
        s.animals.forEach((animal) => {
          if (s.activeMiniGame && s.activeMiniGame.animalId === animal.id) return;
          const timeSinceLastFed = now - animal.lastFedTime;
          const newHunger = Math.min(100, animal.hunger + timeSinceLastFed / 60000 * 2);
          const newHappiness = Math.max(0, animal.happiness - (newHunger > 70 ? 0.5 : 0.1));

          s.updateAnimal(animal.id, {
            hunger: newHunger,
            happiness: newHappiness,
            lastFedTime: newHunger > animal.hunger + 0.5 ? animal.lastFedTime : animal.lastFedTime,
          });
        });
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
