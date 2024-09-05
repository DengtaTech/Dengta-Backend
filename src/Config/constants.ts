import { Embedding } from '../Application/Features/Recommendation/Embedding/Types/api.js';

export const FOOTPRINT_INTERVAL_SIZE = 4;
export const EMBEDDING_WEIGHTS: Embedding.IEmbeddingWeights = {
  lifeRole: 0.1,
  selfIntro: 0.1,
  profileTags: 0.2,
  goal: 0.3,
  footprints: {
    title: 0.2,
    tags: 0.1,
    content: 0.05,
  },
  questionnaire: 0.05,
};
export const RECOMMENDATION_LIMIT = 10;

const calculateTotalWeight = (weights: Embedding.IEmbeddingWeights) => {
  return Object.values(weights).reduce((total, weight) => {
    if (typeof weight === 'object') {
      return total + calculateTotalWeight(weight); // 遞迴計算內部權重的總和
    }
    return total + weight;
  }, 0);
};
export const TOTAL_WEIGHT = calculateTotalWeight(EMBEDDING_WEIGHTS);
