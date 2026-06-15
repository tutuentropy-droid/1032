import { Animal, EmotionType, EMOTION_INFLUENCES, EmotionInfluence } from '@/types/game';
import { useGameStore } from '@/store/gameStore';

const getDistance = (a: { x: number; y: number }, b: { x: number; y: number }): number => {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
};

const EMOTION_COOLDOWN = 3000;

export const processEmotionChain = (animals: Animal[], currentTime: number): void => {
  const state = useGameStore.getState();
  const pendingUpdates: Map<string, EmotionType> = new Map();
  let totalHappiness = 0;
  let happyAnimalCount = 0;
  let excitedAnimalCount = 0;

  for (const influencer of animals) {
    totalHappiness += influencer.happiness;
    if (influencer.emotion === 'happy') happyAnimalCount++;
    if (influencer.emotion === 'excited') excitedAnimalCount++;

    if (currentTime - influencer.lastEmotionChange < 1000) continue;

    const influences = EMOTION_INFLUENCES.filter(inf => inf.fromEmotion === influencer.emotion);

    for (const influence of influences) {
      applyInfluence(influencer, influence, animals, pendingUpdates, currentTime);
    }
  }

  pendingUpdates.forEach((newEmotion, animalId) => {
    state.updateAnimal(animalId, {
      emotion: newEmotion,
      lastEmotionChange: currentTime,
    });
    state.updateAnimalEmotion(animalId, newEmotion);
  });

  const avgHappiness = animals.length > 0 ? totalHappiness / animals.length : 50;
  const happyRatio = happyAnimalCount / Math.max(1, animals.length);
  const excitedRatio = excitedAnimalCount / Math.max(1, animals.length);
  const targetBrightness = 1 + (avgHappiness / 100) * 0.15 + happyRatio * 0.08 + excitedRatio * 0.12;

  const currentBrightness = state.globalBrightness;
  const newBrightness = currentBrightness + (targetBrightness - currentBrightness) * 0.05;
  state.setGlobalBrightness(Math.max(0.85, Math.min(1.35, newBrightness)));
};

const applyInfluence = (
  influencer: Animal,
  influence: EmotionInfluence,
  animals: Animal[],
  pendingUpdates: Map<string, EmotionType>,
  currentTime: number
): void => {
  const state = useGameStore.getState();

  for (const target of animals) {
    if (target.id === influencer.id) continue;
    if (!influence.targetTypes.includes(target.type)) continue;
    if (pendingUpdates.has(target.id)) continue;
    if (currentTime - target.lastEmotionChange < EMOTION_COOLDOWN) continue;

    const distance = getDistance(influencer.position, target.position);
    if (distance > influence.minDistance + influencer.emotionRadius) continue;

    const distanceFactor = Math.max(0, 1 - distance / (influence.minDistance + influencer.emotionRadius));
    const strengthFactor = influencer.emotionStrength / 100;
    const finalProbability = influence.probability * distanceFactor * strengthFactor;

    if (Math.random() < finalProbability) {
      pendingUpdates.set(target.id, influence.toEmotion);

      if (influence.toEmotion === 'anxious') {
        for (let i = 0; i < 2; i++) {
          state.addParticle({
            type: 'exclamation',
            x: target.position.x + (Math.random() - 0.5) * 8,
            y: target.position.y - 8 + Math.random() * 4,
            duration: 1200,
          });
        }
      } else if (influence.toEmotion === 'happy') {
        state.addParticle({
          type: 'heart',
          x: target.position.x + (Math.random() - 0.5) * 6,
          y: target.position.y - 6,
          duration: 1500,
        });
      } else if (influence.toEmotion === 'excited') {
        for (let i = 0; i < 3; i++) {
          state.addParticle({
            type: 'sparkle',
            x: target.position.x + (Math.random() - 0.5) * 10,
            y: target.position.y - 5 + Math.random() * 5,
            duration: 1000,
          });
        }
      } else if (influence.toEmotion === 'angry') {
        state.addParticle({
          type: 'sweat',
          x: target.position.x + 6,
          y: target.position.y - 10,
          duration: 1500,
        });
      } else if (influence.toEmotion === 'calm') {
        state.addParticle({
          type: 'zzz',
          x: target.position.x + 4,
          y: target.position.y - 8,
          duration: 1800,
        });
      }
    }
  }
};

export const getEmotionAura = (emotion: EmotionType): { color: string; intensity: number } => {
  const auras: Record<EmotionType, { color: string; intensity: number }> = {
    happy: { color: 'rgba(255, 215, 0, 0.15)', intensity: 1 },
    angry: { color: 'rgba(255, 68, 68, 0.15)', intensity: 1 },
    sleepy: { color: 'rgba(135, 206, 235, 0.12)', intensity: 0.8 },
    calm: { color: 'rgba(144, 238, 144, 0.15)', intensity: 0.9 },
    anxious: { color: 'rgba(221, 160, 221, 0.18)', intensity: 1.1 },
    excited: { color: 'rgba(255, 165, 0, 0.2)', intensity: 1.3 },
  };
  return auras[emotion] || auras.happy;
};
