import { InitFootprint } from '../../Application/Features/Footprint/InitFootprint/Types/api.js';
import { User } from '../../Database/Entities/user.js';
import { Footprint } from '../../Database/Entities/footprint.js';
import { PublishFootprint } from '../../Application/Features/Footprint/PublishFootprint/Types/api.js';
import { EntityManager } from 'typeorm';

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
        id: savedFootprint.id,
      };
    } catch (error) {
      console.error('Failed to init footprint:');
      throw error;
    }
  },
  updateFootprint: async (
    footprint: Footprint,
    reqBody: PublishFootprint.IPublishFootprintReqBody,
    transactionManager: EntityManager,
  ): Promise<void> => {
    try {
      footprint.title = reqBody.title;
      footprint.content = reqBody.content;
      footprint.category = reqBody.category;
      footprint.milestone = reqBody.milestone;
      footprint.occurAt = reqBody.occurAt;
      footprint.status = reqBody.status;
      await transactionManager.save(footprint);
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
