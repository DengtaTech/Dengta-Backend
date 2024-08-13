import { EntityManager } from 'typeorm';
import { FootprintHashTag } from '../../Database/Entities/footprintHashTag.js';
import { MFootprintFootprintHashTag } from '../../Database/Entities/mFootprintFootprintHashTag.js';
import { Footprint } from '../../Database/Entities/footprint.js';

export const mFootprintFootprintHashTagRepo = {
  insertNewRecord: async (
    footprint: Footprint,
    footprintHashTag: FootprintHashTag,
    transactionManager: EntityManager,
  ): Promise<void> => {
    try {
      const newMFootprintFootprintHashTag = new MFootprintFootprintHashTag();
      newMFootprintFootprintHashTag.footprint = footprint;
      newMFootprintFootprintHashTag.footprintHashTag = footprintHashTag;
      await transactionManager.save(newMFootprintFootprintHashTag);
    } catch (error) {
      console.error('Failed to save mFootprintFootprintHashTag:');
      throw error;
    }
  },
};
