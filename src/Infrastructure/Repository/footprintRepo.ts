import { InitFootprint } from '../../Application/Features/Footprint/InitFootprint/Types/api.js';
import { User } from '../../Database/Entities/user.js';
import { Footprint } from '../../Database/Entities/footprint.js';

export const footprintRepo = {
  initFootprint: async (
    user: User,
    status: string,
  ): Promise<InitFootprint.IInitFootprintDto> => {
    try {
      const footprint = new Footprint();
      footprint.status = status;
      footprint.user = user;
      const savedFootprint = await footprint.save();
      return {
        id: savedFootprint.id
      };
    } catch (error) {
      console.error('Failed to init footprint:');
      throw error;
    }
  },
};
