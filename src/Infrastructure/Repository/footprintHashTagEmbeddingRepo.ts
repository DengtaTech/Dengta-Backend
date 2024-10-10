import { EntityManager } from 'typeorm';
import { FootprintHashTagEmbedding } from '../../Database/Entities/footprintHashTagEmbedding.js';
import { Embedding } from '../../Application/Features/Recommendation/Embedding/Types/api.js';

export const footprintHashTagEmbeddingRepo = {
  findById: async (
    id: FootprintHashTagEmbedding['id'],
    transactionManager?: EntityManager,
  ) => {
    if (transactionManager) {
      return await transactionManager.findOne(FootprintHashTagEmbedding, {
        where: { id },
      });
    } else {
      return await FootprintHashTagEmbedding.findOne({ where: { id } });
    }
  },
  findByFootprintHashTagId: async (
    footprintHashTagId: FootprintHashTagEmbedding['footprintHashTagId'],
    transactionManager?: EntityManager,
  ) => {
    if (transactionManager) {
      return await transactionManager.findOne(FootprintHashTagEmbedding, {
        where: { footprintHashTagId },
      });
    } else {
      return await FootprintHashTagEmbedding.findOne({
        where: { footprintHashTagId },
      });
    }
  },
  insertFootprintHashTagEmbedding: async (
    footprintHashTagEmbedding: Embedding.IFootprintHashTagEmbeddingDto,
    transactionManager: EntityManager,
  ) => {
    try {
      const newFootprintHashTagEmbedding = new FootprintHashTagEmbedding();
      Object.assign(newFootprintHashTagEmbedding, footprintHashTagEmbedding);

      const savedFootprintHashTagEmbedding = await transactionManager.save(
        newFootprintHashTagEmbedding,
      );
      return savedFootprintHashTagEmbedding;
    } catch (error) {
      console.error('Failed to insert footprintHashTagEmbedding:');
      throw error;
    }
  },
};
