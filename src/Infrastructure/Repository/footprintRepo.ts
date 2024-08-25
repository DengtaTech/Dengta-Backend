import { EntityManager } from 'typeorm';
import { Footprint } from '../../Database/Entities/footprint.js';
import { InitFootprint } from '../../Application/Features/Footprint/InitFootprint/Types/api.js';
import { PublishFootprint } from '../../Application/Features/Footprint/PublishFootprint/Types/api.js';
import { GetFootprints } from '../../Application/Features/User/GetFootprints/Types/api.js';
import { User } from '../../Database/Entities/user.js';
import {
  nativeReactions,
  type NativeReaction,
} from '../../Application/Features/Footprint/Reaction/Types/reactions.js';

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
  findByUserId: async (
    userId: User['id'],
    offset: number = 0,
    limit: number = 10,
  ): Promise<GetFootprints.TFootprintContent[]> => {
    const [footprints] = await Footprint.createQueryBuilder('footprint')
      .where('footprint.userId = :userId', { userId })
      .leftJoinAndSelect(
        'footprint.mFootprintFootprintHashTag',
        'hashTagRelation',
      )
      .leftJoinAndSelect('hashTagRelation.footprintHashTag', 'hashTag')
      .leftJoinAndSelect('footprint.mUserFootprintReaction', 'reaction')
      .leftJoinAndSelect('reaction.reactionType', 'reactionType')
      .select([
        'footprint',
        'hashTagRelation',
        'hashTag.content',
        'reaction',
        'reactionType.name',
      ])
      .orderBy('footprint.occurAt', 'DESC')
      .skip(offset * limit)
      .take(limit)
      .getManyAndCount();

    const mappedFootprints = footprints.map((footprint) => {
      // sort alphabetically
      let hashtags =
        footprint.mFootprintFootprintHashTag?.map(
          (hashTagRelation) => hashTagRelation.footprintHashTag?.content,
        ) || [];
      hashtags = (hashtags as string[]).sort((a, b) => a.localeCompare(b));

      const reactionCounts = footprint.mUserFootprintReaction?.reduce(
        (acc, reaction) => {
          const reactionName = reaction.reactionType?.name;
          if (reactionName) {
            acc[reactionName] = (acc[reactionName] || 0) + 1;
          }
          return acc;
        },
        {} as Record<NativeReaction, number>,
      );

      const reactionCountsWithZero = nativeReactions.reduce(
        (acc, reaction) => {
          acc[reaction] = reactionCounts?.[reaction] || 0;
          return acc;
        },
        {} as Record<NativeReaction, number>,
      );

      delete footprint.mFootprintFootprintHashTag;
      delete footprint.mUserFootprintReaction;

      return {
        ...footprint,
        hashtags: hashtags,
        reactionCounts: reactionCountsWithZero,
      } as GetFootprints.TFootprintContent;
    });

    return mappedFootprints;
  },
};
