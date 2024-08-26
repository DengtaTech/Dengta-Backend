import { EntityManager } from 'typeorm';
import { FootprintHashTag } from '../../Database/Entities/footprintHashTag.js';

export const footprintHashTagRepo = {
  findOrCreateByContent: async (
    content: string,
    transactionManager: EntityManager,
  ): Promise<FootprintHashTag> => {
    try {
      let footprintHashTag = await FootprintHashTag.findOne({
        where: { content: content },
      });
      if (!footprintHashTag) {
        footprintHashTag = await transactionManager.save(
          FootprintHashTag.create({ content }),
        );
      }
      return footprintHashTag;
    } catch (error) {
      console.error('Error finding footprint hash tag by content:');
      throw error;
    }
  },
  insertNewFootprintHashTag: async (
    content: string,
    transactionManager: EntityManager,
  ): Promise<FootprintHashTag> => {
    try {
      const newFootprintHashTag = new FootprintHashTag();
      newFootprintHashTag.content = content;
      await transactionManager.save(newFootprintHashTag);
      return newFootprintHashTag;
    } catch (error) {
      console.error('Failed to save footprint hash tag:');
      throw error;
    }
  },
};
