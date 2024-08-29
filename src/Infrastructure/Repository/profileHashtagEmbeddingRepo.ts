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
  insertUserHashTagEmbedding: async (
    userHashTagEmbedding: Embedding.IProfileHashTagEmbeddingDto,
    transactionManager: EntityManager,
  ) => {
    try {
      const newUserHashTagEmbedding = new ProfileHashTagEmbedding();
      Object.assign(newUserHashTagEmbedding, userHashTagEmbedding);

      const savedUserHashTagEmbedding = await transactionManager.save(
        newUserHashTagEmbedding,
      );
      return savedUserHashTagEmbedding;
    } catch (error) {
      console.error('Failed to insert userHashTagEmbedding:');
      throw error;
    }
  },
};
