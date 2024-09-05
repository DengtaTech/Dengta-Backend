import { EntityManager } from 'typeorm';
import { ProfileHashTagEmbedding } from '../../Database/Entities/profileHashTagEmbedding.js';
import { Embedding } from '../../Application/Features/Recommendation/Embedding/Types/api.js';

export const profileHashtagEmbeddingRepo = {
  findById: async (
    id: ProfileHashTagEmbedding['id'],
    transactionManager?: EntityManager,
  ) => {
    if (transactionManager) {
      return await transactionManager.findOne(ProfileHashTagEmbedding, {
        where: { id },
      });
    } else {
      return await ProfileHashTagEmbedding.findOne({ where: { id } });
    }
  },
  findByProfileHashTagId: async (
    profileHashTagId: ProfileHashTagEmbedding['profileHashTagId'],
    transactionManager?: EntityManager,
  ) => {
    if (transactionManager) {
      return await transactionManager.findOne(ProfileHashTagEmbedding, {
        where: { profileHashTagId },
      });
    } else {
      return await ProfileHashTagEmbedding.findOne({
        where: { profileHashTagId },
      });
    }
  },
  insertUserHashTagEmbedding: async (
    userHashTagEmbedding: Embedding.IProfileHashTagEmbeddingDto,
    transactionManager: EntityManager,
  ) => {
    if (transactionManager) {
      const newUserHashTagEmbedding = new ProfileHashTagEmbedding();
      Object.assign(newUserHashTagEmbedding, userHashTagEmbedding);

      return await transactionManager.save(newUserHashTagEmbedding);
    } else {
      const newUserHashTagEmbedding = new ProfileHashTagEmbedding();
      Object.assign(newUserHashTagEmbedding, userHashTagEmbedding);

      return await ProfileHashTagEmbedding.save(newUserHashTagEmbedding);
    }
  },
};
