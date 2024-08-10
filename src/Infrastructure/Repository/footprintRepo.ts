import { EntityManager } from 'typeorm';
import { Footprint } from '../../Database/Entities/footprint.js';

export const footprintRepo = {
  findById: async (id: Footprint['id'], transactionManager?: EntityManager) => {
    if (transactionManager) {
      return await transactionManager.findOne(Footprint, { where: { id } });
    } else {
      return await Footprint.findOne({ where: { id } });
    }
  },
};
