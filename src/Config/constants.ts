import { Embedding } from '../Application/Features/Recommendation/Embedding/Types/api.js';

export const FOOTPRINT_INTERVAL_SIZE = 4;
export const EMBEDDING_WEIGHTS: Embedding.IEmbeddingWeights = {
  lifeRole: 0.2837710806425091,
  selfIntro: 0.2837710806425091,
  profileTags: 0.6278933453881503,
  goal: 0.7170155135986972,
  footprints: {
    title: 0.49944944398455426,
    tags: 0.09638881389573006,
    content: 0.45620581710468733,
  },
  questionnaire: 0,
};
export const RECOMMENDATION_LIMIT = 8;

const calculateTotalWeight = (weights: Embedding.IEmbeddingWeights) => {
  return Object.values(weights).reduce((total, weight) => {
    if (typeof weight === 'object') {
      return total + calculateTotalWeight(weight); // 遞迴計算內部權重的總和
    }
    return total + weight;
  }, 0);
};
export const TOTAL_WEIGHT = calculateTotalWeight(EMBEDDING_WEIGHTS);

export const TOTAL_WEIGHT_WITHOUT_FOOTPRINTS = calculateTotalWeight({
  ...EMBEDDING_WEIGHTS,
  footprints: {
    title: 0,
    tags: 0,
    content: 0,
  },
});

export const KEYWORDS_LIMIT = 3;
