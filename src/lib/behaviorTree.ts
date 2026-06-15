import {
  BehaviorNode,
  BehaviorContext,
  BehaviorStatus,
  Animal,
  EmotionType,
  Position,
  ParticleType,
  AnimationState,
  AnimalType,
} from '@/types/game';
import { useGameStore } from '@/store/gameStore';

const getDistance = (a: Position, b: Position): number => {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
};

const getAnimal = (ctx: BehaviorContext): Animal | undefined => {
  return ctx.animals.find(a => a.id === ctx.animalId);
};

const getNearbyAnimals = (ctx: BehaviorContext, maxDistance: number): Animal[] => {
  const animal = getAnimal(ctx);
  if (!animal) return [];
  return ctx.animals.filter(a =>
    a.id !== animal.id && getDistance(a.position, animal.position) <= maxDistance
  );
};

const clampPosition = (pos: Position): Position => ({
  x: Math.max(8, Math.min(92, pos.x)),
  y: Math.max(42, Math.min(78, pos.y)),
});

type NodeExecutor = (node: BehaviorNode, ctx: BehaviorContext) => BehaviorStatus;

const nodeExecutors: Record<string, NodeExecutor> = {
  selector: (node, ctx) => {
    if (!node.children) return 'failure';
    for (const child of node.children) {
      const status = executeNode(child, ctx);
      if (status === 'success' || status === 'running') {
        return status;
      }
    }
    return 'failure';
  },

  sequence: (node, ctx) => {
    if (!node.children) return 'success';
    for (const child of node.children) {
      const status = executeNode(child, ctx);
      if (status === 'failure' || status === 'running') {
        return status;
      }
    }
    return 'success';
  },

  inverter: (node, ctx) => {
    if (!node.children || node.children.length === 0) return 'failure';
    const status = executeNode(node.children[0], ctx);
    if (status === 'success') return 'failure';
    if (status === 'failure') return 'success';
    return status;
  },

  check_emotion: (node, ctx) => {
    const animal = getAnimal(ctx);
    const targetEmotion = node.params?.emotion as EmotionType;
    if (!animal || !targetEmotion) return 'failure';
    return animal.emotion === targetEmotion ? 'success' : 'failure';
  },

  check_nearby_emotion: (node, ctx) => {
    const emotion = node.params?.emotion as EmotionType;
    const distance = (node.params?.distance as number) || 20;
    const minCount = (node.params?.minCount as number) || 1;
    const nearby = getNearbyAnimals(ctx, distance);
    const count = nearby.filter(a => a.emotion === emotion).length;
    return count >= minCount ? 'success' : 'failure';
  },

  check_hunger: (node, ctx) => {
    const animal = getAnimal(ctx);
    const threshold = (node.params?.threshold as number) || 50;
    const comparison = (node.params?.comparison as 'above' | 'below') || 'above';
    if (!animal) return 'failure';
    if (comparison === 'above') {
      return animal.hunger >= threshold ? 'success' : 'failure';
    }
    return animal.hunger <= threshold ? 'success' : 'failure';
  },

  check_happiness: (node, ctx) => {
    const animal = getAnimal(ctx);
    const threshold = (node.params?.threshold as number) || 50;
    const comparison = (node.params?.comparison as 'above' | 'below') || 'above';
    if (!animal) return 'failure';
    if (comparison === 'above') {
      return animal.happiness >= threshold ? 'success' : 'failure';
    }
    return animal.happiness <= threshold ? 'success' : 'failure';
  },

  random_chance: (node) => {
    const chance = (node.params?.chance as number) ?? 0.5;
    return Math.random() < chance ? 'success' : 'failure';
  },

  set_emotion: (node, ctx) => {
    const animal = getAnimal(ctx);
    const emotion = node.params?.emotion as EmotionType;
    if (!animal || !emotion) return 'failure';
    if (animal.emotion === emotion) return 'success';
    const cooldown = (node.params?.cooldown as number) || 3000;
    if (ctx.currentTime - animal.lastEmotionChange < cooldown) {
      return 'failure';
    }
    useGameStore.getState().updateAnimal(animal.id, {
      emotion,
      lastEmotionChange: ctx.currentTime,
    });
    useGameStore.getState().updateAnimalEmotion(animal.id, emotion);
    return 'success';
  },

  move_random: (node, ctx) => {
    const animal = getAnimal(ctx);
    if (!animal) return 'failure';
    if (animal.isMoving) return 'running';
    if (animal.animationState === 'eating' || animal.animationState === 'reacting') {
      return 'failure';
    }
    const range = (node.params?.range as number) || 25;
    const newX = animal.position.x + (Math.random() - 0.5) * range;
    const newY = animal.position.y + (Math.random() - 0.5) * (range * 0.5);
    const target = clampPosition({ x: newX, y: newY });
    useGameStore.getState().setAnimalMoving(animal.id, true, target);
    return 'success';
  },

  move_away_from: (node, ctx) => {
    const animal = getAnimal(ctx);
    const emotion = node.params?.emotion as EmotionType;
    const distance = (node.params?.distance as number) || 15;
    if (!animal) return 'failure';
    if (animal.isMoving) return 'running';
    const nearby = getNearbyAnimals(ctx, distance);
    const threats = nearby.filter(a => a.emotion === emotion);
    if (threats.length === 0) return 'failure';

    const threat = threats.reduce((nearest, t) => {
      const dN = getDistance(nearest.position, animal.position);
      const dT = getDistance(t.position, animal.position);
      return dT < dN ? t : nearest;
    });

    const dx = animal.position.x - threat.position.x;
    const dy = animal.position.y - threat.position.y;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    const escapeDist = (node.params?.escapeDistance as number) || 30;
    const target = clampPosition({
      x: animal.position.x + (dx / dist) * escapeDist,
      y: animal.position.y + (dy / dist) * escapeDist,
    });
    useGameStore.getState().setAnimalMoving(animal.id, true, target);
    useGameStore.getState().setAnimationState(animal.id, 'scared');
    setTimeout(() => {
      const s = useGameStore.getState();
      const a = s.animals.find(an => an.id === animal.id);
      if (a && a.animationState === 'scared') {
        useGameStore.getState().setAnimationState(animal.id, 'idle');
      }
    }, 800);
    return 'success';
  },

  move_towards: (node, ctx) => {
    const animal = getAnimal(ctx);
    const emotion = node.params?.emotion as EmotionType;
    const maxDistance = (node.params?.maxDistance as number) || 25;
    const stopDistance = (node.params?.stopDistance as number) || 8;
    if (!animal) return 'failure';
    if (animal.isMoving) return 'running';
    if (animal.animationState === 'eating') return 'failure';

    const nearby = getNearbyAnimals(ctx, maxDistance);
    const targets = nearby.filter(a => a.emotion === emotion);
    if (targets.length === 0) return 'failure';

    const target = targets.reduce((nearest, t) => {
      const dN = getDistance(nearest.position, animal.position);
      const dT = getDistance(t.position, animal.position);
      return dT < dN ? t : nearest;
    });

    const currentDist = getDistance(target.position, animal.position);
    if (currentDist <= stopDistance) return 'success';

    useGameStore.getState().setAnimalMoving(animal.id, true, { ...target.position });
    return 'success';
  },

  add_particle: (node, ctx) => {
    const animal = getAnimal(ctx);
    const type = node.params?.type as ParticleType;
    const count = (node.params?.count as number) || 1;
    if (!animal || !type) return 'failure';
    for (let i = 0; i < count; i++) {
      useGameStore.getState().addParticle({
        type,
        x: animal.position.x + (Math.random() - 0.5) * 10,
        y: animal.position.y - 5 + Math.random() * 5,
        duration: (node.params?.duration as number) || 1500,
        scale: node.params?.scale as number,
      });
    }
    return 'success';
  },

  wait: () => {
    return Math.random() > 0.3 ? 'success' : 'failure';
  },

  set_animation: (node, ctx) => {
    const animal = getAnimal(ctx);
    const state = node.params?.state as AnimationState;
    if (!animal || !state) return 'failure';
    const cooldown = (node.params?.cooldown as number) || 0;
    if (cooldown > 0) {
      useGameStore.getState().setAnimationState(animal.id, state);
      setTimeout(() => {
        const s = useGameStore.getState();
        const a = s.animals.find(an => an.id === animal.id);
        if (a && a.animationState === state && state !== 'idle' && state !== 'walking') {
          useGameStore.getState().setAnimationState(animal.id, 'idle');
        }
      }, cooldown);
    } else {
      useGameStore.getState().setAnimationState(animal.id, state);
    }
    return 'success';
  },
};

export const executeNode = (node: BehaviorNode, ctx: BehaviorContext): BehaviorStatus => {
  const executor = nodeExecutors[node.type];
  if (!executor) {
    console.warn(`Unknown behavior node type: ${node.type}`);
    return 'failure';
  }
  return executor(node, ctx);
};

export const createBehaviorTree = (animalType: AnimalType): BehaviorNode => {
  const trees: Record<AnimalType, BehaviorNode> = {
    hedgehog: {
      id: 'hedgehog-root',
      type: 'selector',
      children: [
        {
          id: 'h-seq-threat',
          type: 'sequence',
          children: [
            { id: 'h-check-threat', type: 'check_nearby_emotion', params: { emotion: 'excited', distance: 15 } },
            { id: 'h-set-anxious', type: 'set_emotion', params: { emotion: 'anxious', cooldown: 4000 } },
            { id: 'h-add-sweat', type: 'add_particle', params: { type: 'sweat', count: 2, duration: 1200 } },
            { id: 'h-move-fast', type: 'move_random', params: { range: 35 } },
          ],
        },
        {
          id: 'h-seq-anxious',
          type: 'sequence',
          children: [
            { id: 'h-check-anxious', type: 'check_emotion', params: { emotion: 'anxious' } },
            { id: 'h-move-fast-2', type: 'move_random', params: { range: 30 } },
          ],
        },
        {
          id: 'h-seq-hungry',
          type: 'sequence',
          children: [
            { id: 'h-check-hunger', type: 'check_hunger', params: { threshold: 65, comparison: 'above' } },
            { id: 'h-set-angry', type: 'set_emotion', params: { emotion: 'angry', cooldown: 5000 } },
          ],
        },
        {
          id: 'h-seq-calm',
          type: 'sequence',
          children: [
            { id: 'h-check-calm-nearby', type: 'check_nearby_emotion', params: { emotion: 'calm', distance: 20 } },
            { id: 'h-set-calm', type: 'set_emotion', params: { emotion: 'calm', cooldown: 5000 } },
            { id: 'h-wait-calm', type: 'wait' },
          ],
        },
        {
          id: 'h-default',
          type: 'sequence',
          children: [
            { id: 'h-rand-move', type: 'random_chance', params: { chance: 0.4 } },
            { id: 'h-do-move', type: 'move_random', params: { range: 15 } },
          ],
        },
      ],
    },

    turtle: {
      id: 'turtle-root',
      type: 'selector',
      children: [
        {
          id: 't-seq-threat-anxious',
          type: 'sequence',
          children: [
            { id: 't-check-anxious-nearby', type: 'check_nearby_emotion', params: { emotion: 'anxious', distance: 20 } },
            { id: 't-set-anxious-1', type: 'set_emotion', params: { emotion: 'anxious', cooldown: 5000 } },
            { id: 't-add-excl', type: 'add_particle', params: { type: 'exclamation', count: 3, duration: 1500 } },
            { id: 't-set-scared-anim', type: 'set_animation', params: { state: 'scared', cooldown: 1000 } },
          ],
        },
        {
          id: 't-seq-threat-angry',
          type: 'sequence',
          children: [
            { id: 't-check-angry-nearby', type: 'check_nearby_emotion', params: { emotion: 'angry', distance: 18 } },
            { id: 't-set-anxious-2', type: 'set_emotion', params: { emotion: 'anxious', cooldown: 5000 } },
            { id: 't-hide-in-shell', type: 'set_animation', params: { state: 'scared', cooldown: 1500 } },
          ],
        },
        {
          id: 't-seq-anxious',
          type: 'sequence',
          children: [
            { id: 't-check-anxious', type: 'check_emotion', params: { emotion: 'anxious' } },
            { id: 't-escape', type: 'move_away_from', params: { emotion: 'anxious', distance: 25, escapeDistance: 25 } },
          ],
        },
        {
          id: 't-seq-happy-spread',
          type: 'sequence',
          children: [
            { id: 't-check-happy', type: 'check_emotion', params: { emotion: 'happy' } },
            { id: 't-set-calm-1', type: 'set_emotion', params: { emotion: 'calm', cooldown: 6000 } },
          ],
        },
        {
          id: 't-seq-calm',
          type: 'sequence',
          children: [
            { id: 't-check-calm', type: 'check_emotion', params: { emotion: 'calm' } },
            { id: 't-rand-calm', type: 'random_chance', params: { chance: 0.2 } },
            { id: 't-slow-move', type: 'move_random', params: { range: 8 } },
          ],
        },
        {
          id: 't-default-calm',
          type: 'sequence',
          children: [
            { id: 't-check-not-calm', type: 'inverter', children: [{ id: 't-check-calm-2', type: 'check_emotion', params: { emotion: 'calm' } }] },
            { id: 't-set-calm-3', type: 'set_emotion', params: { emotion: 'calm', cooldown: 4000 } },
          ],
        },
      ],
    },

    dog: {
      id: 'dog-root',
      type: 'selector',
      children: [
        {
          id: 'd-seq-happy-excite',
          type: 'sequence',
          children: [
            { id: 'd-check-happy', type: 'check_emotion', params: { emotion: 'happy' } },
            { id: 'd-rand-excite', type: 'random_chance', params: { chance: 0.5 } },
            { id: 'd-set-excited', type: 'set_emotion', params: { emotion: 'excited', cooldown: 5000 } },
            { id: 'd-add-light', type: 'add_particle', params: { type: 'light', count: 5, duration: 2000 } },
            { id: 'd-set-glow', type: 'set_animation', params: { state: 'glowing', cooldown: 2000 } },
          ],
        },
        {
          id: 'd-seq-excited',
          type: 'sequence',
          children: [
            { id: 'd-check-excited', type: 'check_emotion', params: { emotion: 'excited' } },
            { id: 'd-jump-around', type: 'move_random', params: { range: 30 } },
            { id: 'd-add-sparkle', type: 'add_particle', params: { type: 'sparkle', count: 3, duration: 1000 } },
          ],
        },
        {
          id: 'd-seq-excited-spread',
          type: 'sequence',
          children: [
            { id: 'd-check-excited-nearby', type: 'check_nearby_emotion', params: { emotion: 'excited', distance: 22 } },
            { id: 'd-become-excited', type: 'set_emotion', params: { emotion: 'excited', cooldown: 4000 } },
          ],
        },
        {
          id: 'd-seq-happy-nearby',
          type: 'sequence',
          children: [
            { id: 'd-check-happy-nearby', type: 'check_nearby_emotion', params: { emotion: 'happy', distance: 25 } },
            { id: 'd-set-happy', type: 'set_emotion', params: { emotion: 'happy', cooldown: 4000 } },
            { id: 'd-add-heart', type: 'add_particle', params: { type: 'heart', count: 2, duration: 1200 } },
          ],
        },
        {
          id: 'd-seq-default',
          type: 'sequence',
          children: [
            { id: 'd-rand-happy', type: 'random_chance', params: { chance: 0.6 } },
            { id: 'd-set-happy-2', type: 'set_emotion', params: { emotion: 'happy', cooldown: 4000 } },
            { id: 'd-rand-move', type: 'random_chance', params: { chance: 0.5 } },
            { id: 'd-move-play', type: 'move_random', params: { range: 20 } },
          ],
        },
      ],
    },

    rabbit: {
      id: 'rabbit-root',
      type: 'selector',
      children: [
        {
          id: 'r-seq-threat',
          type: 'sequence',
          children: [
            { id: 'r-check-angry-nearby', type: 'check_nearby_emotion', params: { emotion: 'angry', distance: 18 } },
            { id: 'r-set-anxious', type: 'set_emotion', params: { emotion: 'anxious', cooldown: 4000 } },
            { id: 'r-escape', type: 'move_away_from', params: { emotion: 'angry', distance: 25, escapeDistance: 30 } },
            { id: 'r-add-excl', type: 'add_particle', params: { type: 'exclamation', count: 2, duration: 1000 } },
          ],
        },
        {
          id: 'r-seq-anxious-threat',
          type: 'sequence',
          children: [
            { id: 'r-check-anxious-nearby', type: 'check_nearby_emotion', params: { emotion: 'anxious', distance: 20 } },
            { id: 'r-set-anxious-2', type: 'set_emotion', params: { emotion: 'anxious', cooldown: 4000 } },
            { id: 'r-scared-anim', type: 'set_animation', params: { state: 'scared', cooldown: 800 } },
          ],
        },
        {
          id: 'r-seq-excited-spread',
          type: 'sequence',
          children: [
            { id: 'r-check-excited-nearby', type: 'check_nearby_emotion', params: { emotion: 'excited', distance: 22 } },
            { id: 'r-set-excited', type: 'set_emotion', params: { emotion: 'excited', cooldown: 4000 } },
          ],
        },
        {
          id: 'r-seq-happy-nearby',
          type: 'sequence',
          children: [
            { id: 'r-check-happy-nearby', type: 'check_nearby_emotion', params: { emotion: 'happy', distance: 25 } },
            { id: 'r-set-happy', type: 'set_emotion', params: { emotion: 'happy', cooldown: 5000 } },
          ],
        },
        {
          id: 'r-seq-hungry',
          type: 'sequence',
          children: [
            { id: 'r-check-hunger', type: 'check_hunger', params: { threshold: 70, comparison: 'above' } },
            { id: 'r-set-angry', type: 'set_emotion', params: { emotion: 'angry', cooldown: 5000 } },
          ],
        },
        {
          id: 'r-default',
          type: 'sequence',
          children: [
            { id: 'r-rand-happy', type: 'random_chance', params: { chance: 0.5 } },
            { id: 'r-set-happy-2', type: 'set_emotion', params: { emotion: 'happy', cooldown: 5000 } },
            { id: 'r-rand-move', type: 'random_chance', params: { chance: 0.4 } },
            { id: 'r-hop', type: 'move_random', params: { range: 20 } },
          ],
        },
      ],
    },

    bear: {
      id: 'bear-root',
      type: 'selector',
      children: [
        {
          id: 'b-seq-excited-bother',
          type: 'sequence',
          children: [
            { id: 'b-check-excited-nearby', type: 'check_nearby_emotion', params: { emotion: 'excited', distance: 15 } },
            { id: 'b-set-angry', type: 'set_emotion', params: { emotion: 'angry', cooldown: 6000 } },
            { id: 'b-angry-anim', type: 'set_animation', params: { state: 'reacting', cooldown: 1000 } },
          ],
        },
        {
          id: 'b-seq-angry',
          type: 'sequence',
          children: [
            { id: 'b-check-angry', type: 'check_emotion', params: { emotion: 'angry' } },
            { id: 'b-rand-calm', type: 'random_chance', params: { chance: 0.3 } },
            { id: 'b-set-sleepy', type: 'set_emotion', params: { emotion: 'sleepy', cooldown: 6000 } },
          ],
        },
        {
          id: 'b-seq-calm-nearby',
          type: 'sequence',
          children: [
            { id: 'b-check-calm-nearby', type: 'check_nearby_emotion', params: { emotion: 'calm', distance: 20 } },
            { id: 'b-set-calm', type: 'set_emotion', params: { emotion: 'calm', cooldown: 5000 } },
          ],
        },
        {
          id: 'b-seq-hungry',
          type: 'sequence',
          children: [
            { id: 'b-check-hunger', type: 'check_hunger', params: { threshold: 60, comparison: 'above' } },
            { id: 'b-set-angry-2', type: 'set_emotion', params: { emotion: 'angry', cooldown: 5000 } },
          ],
        },
        {
          id: 'b-seq-sleepy',
          type: 'sequence',
          children: [
            { id: 'b-check-sleepy', type: 'check_emotion', params: { emotion: 'sleepy' } },
            { id: 'b-add-zzz', type: 'add_particle', params: { type: 'zzz', count: 1, duration: 2000 } },
            { id: 'b-wait', type: 'wait' },
          ],
        },
        {
          id: 'b-default',
          type: 'sequence',
          children: [
            { id: 'b-rand-sleepy', type: 'random_chance', params: { chance: 0.4 } },
            { id: 'b-set-sleepy-2', type: 'set_emotion', params: { emotion: 'sleepy', cooldown: 6000 } },
            { id: 'b-rand-move', type: 'random_chance', params: { chance: 0.2 } },
            { id: 'b-slow-walk', type: 'move_random', params: { range: 10 } },
          ],
        },
      ],
    },
  };

  return trees[animalType] || trees.rabbit;
};
