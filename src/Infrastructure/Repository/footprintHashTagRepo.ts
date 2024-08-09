import { EntityManager } from "typeorm";
import { FootprintHashTag } from "../../Database/Entities/footprintHashTag.js";

export const footprintHashTagRepo = {
    findByContent: async (content: string): Promise<FootprintHashTag | null> => {
      try {
        const footprintHashTag = await FootprintHashTag.findOne({
          where: { content: content },
        });
        return footprintHashTag;
      } catch (error) {
        console.error('Error finding footprint hash tag by content:');
        throw error;
      }
    },
    insertNewFootprintHashTag: async (
      content: string,
      transactionManager: EntityManager,
    ): Promise<FootprintHashTag | null> => {
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