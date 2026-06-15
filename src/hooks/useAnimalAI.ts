import { useEffect, useRef } from 'react';
import { useGameStore } from '@/store/gameStore';
import { EmotionType, Position } from '@/types/game';

export const useAnimalAI = () => {
  const { animals, updateAnimalPosition, setAnimalMoving, updateAnimalEmotion, addParticle } = useGameStore();
  const animationRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(Date.now());

  useEffect(() => {
    const moveIntervals: NodeJS.Timeout[] = [];

    animals.forEach((animal) => {
      const decideNextMove = () => {
        if (animal.animationState === 'eating' || animal.animationState === 'reacting') return;

        const shouldMove = Math.random() > 0.5;
        if (shouldMove) {
          const currentAnimal = useGameStore.getState().animals.find(a => a.id === animal.id);
          if (!currentAnimal) return;

          const newX = Math.max(10, Math.min(90, currentAnimal.position.x + (Math.random() - 0.5) * 30));
          const newY = Math.max(40, Math.min(80, currentAnimal.position.y + (Math.random() - 0.5) * 15));

          const target: Position = { x: newX, y: newY };
          setAnimalMoving(animal.id, true, target);

          const distance = Math.sqrt(
            Math.pow(target.x - currentAnimal.position.x, 2) +
            Math.pow(target.y - currentAnimal.position.y, 2)
          );
          const moveDuration = distance * 100;

          setTimeout(() => {
            const state = useGameStore.getState();
            const a = state.animals.find(an => an.id === animal.id);
            if (a && a.isMoving && a.targetPosition) {
              updateAnimalPosition(animal.id, a.targetPosition);
              setAnimalMoving(animal.id, false);
            }
          }, moveDuration);
        } else {
          setAnimalMoving(animal.id, false);
        }
      };

      decideNextMove();
      const interval = setInterval(decideNextMove, 3000 + Math.random() * 4000);
      moveIntervals.push(interval);
    });

    return () => {
      moveIntervals.forEach(interval => clearInterval(interval));
    };
  }, []);

  useEffect(() => {
    const emotionInterval = setInterval(() => {
      const state = useGameStore.getState();
      state.animals.forEach((animal) => {
        let newEmotion: EmotionType = animal.emotion;
        const currentAnimal = state.animals.find(a => a.id === animal.id);
        if (!currentAnimal) return;

        if (currentAnimal.animationState === 'eating' || currentAnimal.animationState === 'reacting') return;

        const timeSinceLastFed = Date.now() - currentAnimal.lastFedTime;
        const newHunger = Math.min(100, currentAnimal.hunger + timeSinceLastFed / 60000 * 2);

        if (newHunger > 70 && currentAnimal.emotion !== 'angry') {
          newEmotion = 'angry';
        } else if (newHunger < 30 && currentAnimal.happiness > 60) {
          const rand = Math.random();
          if (rand < 0.3) {
            newEmotion = 'happy';
          } else if (rand < 0.5 && currentAnimal.type === 'bear') {
            newEmotion = 'sleepy';
          }
        }

        if (newEmotion !== currentAnimal.emotion) {
          updateAnimalEmotion(animal.id, newEmotion);

          if (newEmotion === 'sleepy') {
            addParticle({
              type: 'zzz',
              x: currentAnimal.position.x + 5,
              y: currentAnimal.position.y - 10,
              duration: 2000,
            });
          }
        }
      });
    }, 5000);

    return () => clearInterval(emotionInterval);
  }, []);

  useEffect(() => {
    const animate = () => {
      const now = Date.now();
      const delta = (now - lastUpdateRef.current) / 1000;
      lastUpdateRef.current = now;

      const state = useGameStore.getState();
      state.animals.forEach((animal) => {
        if (animal.isMoving && animal.targetPosition) {
          const speed = 8;
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

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);
};

export default useAnimalAI;
