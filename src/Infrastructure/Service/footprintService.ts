import { InitFootprint } from '../../Application/Features/Footprint/InitFootprint/Types/api.js';
import { PublishFootprint } from '../../Application/Features/Footprint/PublishFootprint/Types/api.js';
import { Database } from '../../Database/data-source.js';
import { Footprint } from '../../Database/Entities/footprint.js';
import { FootprintHashTag } from '../../Database/Entities/footprintHashTag.js';
import {
  FootprintNotFoundError,
} from '../../Errors/errors.js';
import { footprintHashTagRepo } from '../Repository/footprintHashTagRepo.js';
import { footprintRepo } from '../Repository/footprintRepo.js';
import { mFootprintFootprintHashTagRepo } from '../Repository/mFootprintFootprintHashTagRepo.js';

export const footprintService = {
  initFootprint: async (
    userId: string,
    status: string,
  ): Promise<InitFootprint.IInitFootprintDto> => {
    
    const result = await footprintRepo.initFootprint(userId, status);
    return result;
  },
  publish: async (
    footprintObj: PublishFootprint.IPublishFootprintReqBody,
  ): Promise<Footprint> => {
    const footprint = await footprintRepo.findByFootprintId(
      footprintObj.footprintId,
    );
    if (!footprint) {
      throw new FootprintNotFoundError();
    }
    // transaction begin
    return Database.transaction(async (transactionManager) => {
      try {
        const updatedFootprint = await footprintRepo.updateFootprint(
          footprint,
          footprintObj,
          transactionManager,
        );
        for (const tagContent of footprintObj.tags) {
          let footprintHashTag =
            await footprintHashTagRepo.findByContent(tagContent);
          if (!footprintHashTag) {
            footprintHashTag =
              await footprintHashTagRepo.insertNewFootprintHashTag(
                tagContent,
                transactionManager,
              );
          }
          await mFootprintFootprintHashTagRepo.insertNewRecord(
            updatedFootprint,
            footprintHashTag as FootprintHashTag,
            transactionManager,
          );
        }
        return updatedFootprint;
      } catch (error) {
        console.error('Error in DB ->', error);
        throw error;
      }
    });
  },
  updateFootprintHeadImg: async (
    footprintId: string,
    permanentURL: string,
  ): Promise<void> => {
    const footprint = await footprintRepo.findByFootprintId(footprintId);
    if (!footprint) {
      throw new Error('Footprint not found');
    }
    footprint.titleImage = permanentURL;
    await footprint.save();
  },
};
