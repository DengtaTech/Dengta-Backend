import { InitFootprint } from '../../Application/Features/Footprint/InitFootprint/Types/api.js';
import { Footprint } from '../../Database/Entities/footprint.js';
import { PublishFootprint } from '../../Application/Features/Footprint/PublishFootprint/Types/api.js';
import { EntityManager } from 'typeorm';

export const footprintRepo = {
  initFootprint: async (
    userId: string,
    status: string,
  ): Promise<InitFootprint.IInitFootprintDto> => {
    try {
      const footprint = new Footprint();
      footprint.status = status;
      footprint.userId = userId;
      const savedFootprint = await footprint.save();
      return {
        id: savedFootprint.id,
      };
    } catch (error) {
      console.error('Failed to init footprint:');
      throw error;
    }
  },
  updateFootprint: async (
    footprint: Footprint,
    footprintObj: PublishFootprint.IPublishFootprintReqBody,
    transactionManager: EntityManager,
  ): Promise<Footprint> => {
    try {
      footprint.title = footprintObj.title;
      footprint.content = footprintObj.content;
      footprint.category = footprintObj.category;
      footprint.milestone = footprintObj.milestone;
      footprint.occurAt = footprintObj.occurAt;
      footprint.status = footprintObj.status;
      const savedFootprint = await transactionManager.save(footprint);
      return savedFootprint;
    } catch (error) {
      console.error('Failed to init footprint:');
      throw error;
    }
  },
  findByFootprintId: async (footprintId: string): Promise<Footprint | null> => {
    try {
      const footprint = await Footprint.findOne({
        where: { id: footprintId },
      });
      return footprint;
    } catch (error) {
      console.error('Failed to find footprint by id:');
      throw error;
    }
  },
};
