import { EntityManager } from 'typeorm';
import { Footprint } from '../../Database/Entities/footprint.js';
import { InitFootprint } from '../../Application/Features/Footprint/InitFootprint/Types/api.js';
import { PublishFootprint } from '../../Application/Features/Footprint/PublishFootprint/Types/api.js';
import { User } from '../../Database/Entities/user.js';
import { GetFootprintDetail } from '../../Application/Features/Footprint/GetFootprintDetail/Types/api.js';
import { FootprintNotFoundError } from '../../Errors/errors.js';
import {
  buildFootprintWithAllRelationsQuery,
  mapFootprintData,
} from './View/VFootprintWithAllRelations.js';
import { View } from './View/view.js';

export const footprintRepo = {
  findById: async (id: Footprint['id'], transactionManager?: EntityManager) => {
    if (transactionManager) {
      return await transactionManager.findOne(Footprint, { where: { id } });
    } else {
      return await Footprint.findOne({ where: { id } });
    }
  },
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
  findByUserIdWithAllRelations: async (
    userId: User['id'],
    publicOnly: boolean = false,
    offset: number = 1,
    limit: number = 10,
  ): Promise<View.FootprintDto[]> => {
    const query = buildFootprintWithAllRelationsQuery()
      .where('footprint.userId = :userId', { userId })
      .andWhere(publicOnly ? 'footprint.status = :status' : '1=1', {
        status: 'published',
      })
      .orderBy('footprint.occurAt', 'DESC')
      .skip((offset - 1) * limit)
      .take(limit);

    const [footprints] = await query.getManyAndCount();

    return footprints.map(mapFootprintData);
  },
  findOneByIdWithAllRelations: async (
    footprintId: string,
  ): Promise<View.FootprintDto> => {
    try {
      const footprint = await buildFootprintWithAllRelationsQuery()
        .where('footprint.id = :footprintId', { footprintId })
        .getOne();

      if (!footprint) {
        throw new FootprintNotFoundError();
      }
      return mapFootprintData(
        footprint,
      ) as GetFootprintDetail.FootprintDetailDto;
    } catch (error) {
      console.error(
        'Failed to find footprint detail by id with all relations:',
      );
      throw error;
    }
  },
  getPublishedFootprintCountByUserId: async (
    userId: User['id'],
  ): Promise<number> => {
    return await Footprint.count({ where: { userId, status: 'published' } });
  },
};
