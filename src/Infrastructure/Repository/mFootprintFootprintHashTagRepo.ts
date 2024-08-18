import { EntityManager } from 'typeorm';
import { FootprintHashTag } from '../../Database/Entities/footprintHashTag.js';
import { MFootprintFootprintHashTag } from '../../Database/Entities/mFootprintFootprintHashTag.js';
import { Footprint } from '../../Database/Entities/footprint.js';

export const mFootprintFootprintHashTagRepo = {
  insertNewRecord: async (
    footprintId: string,
    footprintHashTagId: string,
    transactionManager: EntityManager,
  ): Promise<MFootprintFootprintHashTag> => {
    try {
      const newMFootprintFootprintHashTag = new MFootprintFootprintHashTag();
      newMFootprintFootprintHashTag.footprintId = footprintId;
      newMFootprintFootprintHashTag.footprintHashTagId = footprintHashTagId;
      const savedMFootprintFootprintHashTag = await transactionManager.save(
        newMFootprintFootprintHashTag,
      );
      return savedMFootprintFootprintHashTag;
    } catch (error) {
      console.error('Failed to save mFootprintFootprintHashTag:');
      throw error;
    }
  },
};
